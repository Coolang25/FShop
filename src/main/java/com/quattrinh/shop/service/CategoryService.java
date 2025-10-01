package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Category;
import com.quattrinh.shop.repository.CategoryRepository;
import com.quattrinh.shop.service.dto.CategoryDTO;
import com.quattrinh.shop.service.mapper.CategoryMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.Category}.
 */
@Service
@Transactional
public class CategoryService {

    private static final Logger LOG = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    /**
     * Save a category.
     *
     * @param categoryDTO the entity to save.
     * @return the persisted entity.
     */
    public CategoryDTO save(CategoryDTO categoryDTO) {
        LOG.debug("Request to save Category : {}", categoryDTO);
        Category category = categoryMapper.toEntity(categoryDTO);

        // Set parent category if parentId is provided
        if (categoryDTO.getParentId() != null) {
            categoryRepository.findById(categoryDTO.getParentId()).ifPresent(category::setParentCategory);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    /**
     * Update a category.
     *
     * @param categoryDTO the entity to save.
     * @return the persisted entity.
     */
    public CategoryDTO update(CategoryDTO categoryDTO) {
        LOG.debug("Request to update Category : {}", categoryDTO);
        Category category = categoryMapper.toEntity(categoryDTO);

        // Set parent category if parentId is provided
        if (categoryDTO.getParentId() != null) {
            categoryRepository.findById(categoryDTO.getParentId()).ifPresent(category::setParentCategory);
        } else {
            category.setParentCategory(null);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    /**
     * Partially update a category.
     *
     * @param categoryDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CategoryDTO> partialUpdate(CategoryDTO categoryDTO) {
        LOG.debug("Request to partially update Category : {}", categoryDTO);

        return categoryRepository
            .findById(categoryDTO.getId())
            .map(existingCategory -> {
                categoryMapper.partialUpdate(existingCategory, categoryDTO);

                return existingCategory;
            })
            .map(categoryRepository::save)
            .map(categoryMapper::toDto);
    }

    /**
     * Get one category by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CategoryDTO> findOne(Long id) {
        LOG.debug("Request to get Category : {}", id);
        return categoryRepository.findById(id).map(categoryMapper::toDto);
    }

    /**
     * Delete the category by id (soft delete).
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to soft delete Category : {}", id);
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setActive(false);
            categoryRepository.save(category);
        }
    }

    /**
     * Activate the category by id.
     *
     * @param id the id of the entity.
     */
    public void activate(Long id) {
        LOG.debug("Request to activate Category : {}", id);
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setActive(true);
            categoryRepository.save(category);
        }
    }

    /**
     * Get all active parent categories (categories without parent) with product counts.
     *
     * @return the list of active parent categories.
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> findParentCategories() {
        LOG.debug("Request to get Active Parent Categories");
        List<Category> parentCategories = categoryRepository.findByParentCategoryIsNullAndIsActiveTrue();
        return parentCategories
            .stream()
            .map(category -> {
                CategoryDTO dto = categoryMapper.toDto(category);
                // Count products in this category and all its subcategories
                long productCount = countProductsInCategory(category);
                dto.setProductCount(productCount);
                return dto;
            })
            .collect(Collectors.toList());
    }

    /**
     * Get all parent categories (including inactive ones) for admin management.
     *
     * @return the list of all parent categories.
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAllParentCategories() {
        LOG.debug("Request to get All Parent Categories (Admin)");
        List<Category> parentCategories = categoryRepository.findByParentCategoryIsNull();
        return parentCategories
            .stream()
            .map(category -> {
                CategoryDTO dto = categoryMapper.toDto(category);
                // Count products in this category and all its subcategories
                long productCount = countProductsInCategory(category);
                dto.setProductCount(productCount);
                return dto;
            })
            .collect(Collectors.toList());
    }

    /**
     * Get all categories (including inactive ones and subcategories) for admin management.
     *
     * @return the list of all categories.
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> findAllCategories() {
        LOG.debug("Request to get All Categories (Admin)");
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories
            .stream()
            .map(category -> {
                CategoryDTO dto = categoryMapper.toDto(category);
                // Count products in this category only (not recursive for performance)
                long productCount = category.getProducts().size();
                dto.setProductCount(productCount);
                return dto;
            })
            .collect(Collectors.toList());
    }

    /**
     * Count products in a category and all its active subcategories recursively.
     *
     * @param category the category to count products for.
     * @return the total product count.
     */
    private long countProductsInCategory(Category category) {
        long count = category.getProducts().size();

        // Add products from active subcategories only
        for (Category subCategory : category.getSubCategories()) {
            if (subCategory.getActive()) {
                count += countProductsInCategory(subCategory);
            }
        }

        return count;
    }
}
