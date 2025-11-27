package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.repository.CategoryRepository;
import com.quattrinh.shop.repository.ProductRepository;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.mapper.ProductMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.Product}.
 */
@Service
@Transactional
public class ProductService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    /**
     * Save a product.
     *
     * @param productDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductDTO save(ProductDTO productDTO) {
        LOG.debug("Request to save Product : {}", productDTO);
        Product product = productMapper.toEntity(productDTO);
        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    /**
     * Update a product.
     *
     * @param productDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductDTO update(ProductDTO productDTO) {
        LOG.debug("Request to update Product : {}", productDTO);
        Product product = productMapper.toEntity(productDTO);
        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    /**
     * Partially update a product.
     *
     * @param productDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductDTO> partialUpdate(ProductDTO productDTO) {
        LOG.debug("Request to partially update Product : {}", productDTO);

        return productRepository
            .findById(productDTO.getId())
            .map(existingProduct -> {
                productMapper.partialUpdate(existingProduct, productDTO);

                return existingProduct;
            })
            .map(productRepository::save)
            .map(productMapper::toDto);
    }

    /**
     * Get all the products with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @param search the search term for filtering products by name or description.
     * @return the list of entities.
     */
    public Page<ProductDTO> findAllWithEagerRelationships(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.findAllWithEagerRelationshipsAndSearch(pageable, search.trim()).map(productMapper::toDto);
        } else {
            return productRepository.findAllWithEagerRelationships(pageable).map(productMapper::toDto);
        }
    }

    /**
     * Get one product by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductDTO> findOne(Long id) {
        LOG.debug("Request to get Product : {}", id);
        return productRepository.findOneWithEagerRelationships(id).map(productMapper::toDto);
    }

    /**
     * Delete the product by id (soft delete).
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to soft delete Product : {}", id);
        productRepository
            .findById(id)
            .ifPresent(product -> {
                product.setIsActive(false);
                productRepository.save(product);
            });
    }

    /**
     * Activate the "id" product.
     *
     * @param id the id of the entity.
     * @return the activated productDTO.
     */
    public ProductDTO activate(Long id) {
        LOG.debug("Request to activate Product : {}", id);
        return productRepository
            .findById(id)
            .map(product -> {
                product.setIsActive(true);
                Product savedProduct = productRepository.save(product);
                return productMapper.toDto(savedProduct);
            })
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    /**
     * Get featured products for home page (sorted by ID ASC for consistent ordering).
     *
     * @param limit the number of products to return.
     * @return the list of featured products.
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> findFeaturedProducts(int limit) {
        LOG.debug("Request to get Featured Products, limit: {}", limit);
        Pageable pageable = PageRequest.of(0, limit);
        Page<Product> products = productRepository.findFeaturedProducts(pageable);
        return products.getContent().stream().map(productMapper::toDto).toList();
    }

    /**
     * Get new products for home page (sorted by ID DESC - newest first).
     *
     * @param limit the number of products to return.
     * @return the list of new products.
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> findNewProducts(int limit) {
        LOG.debug("Request to get New Products, limit: {}", limit);
        Pageable pageable = PageRequest.of(0, limit);
        Page<Product> products = productRepository.findNewProducts(pageable);
        return products.getContent().stream().map(productMapper::toDto).toList();
    }

    /**
     * Get trend products for home page (sorted by ID DESC - trending items).
     *
     * @param limit the number of products to return.
     * @return the list of trend products.
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> findTrendProducts(int limit) {
        LOG.debug("Request to get Trend Products, limit: {}", limit);
        Pageable pageable = PageRequest.of(0, limit);
        Page<Product> products = productRepository.findTrendProducts(pageable);
        return products.getContent().stream().map(productMapper::toDto).toList();
    }

    /**
     * Get best seller products for home page (sorted by ID ASC - best sellers).
     *
     * @param limit the number of products to return.
     * @return the list of best seller products.
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> findBestSellerProducts(int limit) {
        LOG.debug("Request to get Best Seller Products, limit: {}", limit);
        Pageable pageable = PageRequest.of(0, limit);
        Page<Product> products = productRepository.findBestSellerProducts(pageable);
        return products.getContent().stream().map(productMapper::toDto).toList();
    }

    /**
     * Get product statistics for home page.
     *
     * @return the product statistics.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProductStats() {
        LOG.debug("Request to get Product Statistics");
        Map<String, Object> stats = new HashMap<>();

        // Total products count
        long totalProducts = productRepository.count();
        stats.put("totalProducts", totalProducts);

        // Total categories count
        long totalCategories = categoryRepository.count();
        stats.put("totalCategories", totalCategories);

        // Average rating (placeholder)
        stats.put("averageRating", 4.8);

        // Total customers (placeholder)
        stats.put("totalCustomers", 10000);

        return stats;
    }

    /**
     * Get product detail with variants, attributes and images for detail page.
     *
     * @param id the id of the product.
     * @return the product detail with variants and attributes.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProductDetail(Long id) {
        LOG.debug("Request to get Product Detail : {}", id);

        Optional<Product> productOpt = productRepository.findOneWithEagerRelationships(id);
        if (productOpt.isEmpty()) {
            return null;
        }

        Product product = productOpt.get();
        Map<String, Object> detail = new HashMap<>();

        // Basic product info
        detail.put("product", productMapper.toDto(product));

        // Collect all images from variants and product
        Set<String> allImages = new HashSet<>();
        if (product.getImageUrl() != null) {
            allImages.add(product.getImageUrl());
        }

        // Collect variants with their images and attributes
        List<Map<String, Object>> variants = new ArrayList<>();
        Set<String> allAttributes = new HashSet<>();

        for (ProductVariant variant : product.getVariants()) {
            Map<String, Object> variantData = new HashMap<>();
            variantData.put("id", variant.getId());
            variantData.put("sku", variant.getSku());
            variantData.put("price", variant.getPrice());
            int stock = variant.getStock() != null ? variant.getStock() : 0;
            int reserved = variant.getReserved() != null ? variant.getReserved() : 0;
            variantData.put("stock", stock);
            variantData.put("reserved", reserved);
            variantData.put("available", Math.max(0, stock - reserved));
            variantData.put("imageUrl", variant.getImageUrl());
            variantData.put("isActive", variant.getIsActive());

            // Add variant image to all images
            if (variant.getImageUrl() != null) {
                allImages.add(variant.getImageUrl());
            }

            // Collect attribute values for this variant
            List<Map<String, Object>> attributeValues = new ArrayList<>();
            for (ProductAttributeValue attrValue : variant.getAttributeValues()) {
                Map<String, Object> attrData = new HashMap<>();
                attrData.put("id", attrValue.getId());
                attrData.put("value", attrValue.getValue());
                attrData.put("attributeId", attrValue.getAttribute().getId());
                attrData.put("attributeName", attrValue.getAttribute().getName());
                attributeValues.add(attrData);

                // Collect unique attributes
                allAttributes.add(attrValue.getAttribute().getName());
            }
            variantData.put("attributeValues", attributeValues);
            variants.add(variantData);
        }

        detail.put("variants", variants);
        detail.put("images", new ArrayList<>(allImages));

        // Group attributes with their possible values
        Map<String, List<String>> attributesMap = new HashMap<>();
        for (ProductVariant variant : product.getVariants()) {
            for (ProductAttributeValue attrValue : variant.getAttributeValues()) {
                String attrName = attrValue.getAttribute().getName();
                String value = attrValue.getValue();

                attributesMap.computeIfAbsent(attrName, k -> new ArrayList<>()).add(value);
            }
        }

        // Remove duplicates and sort
        for (Map.Entry<String, List<String>> entry : attributesMap.entrySet()) {
            List<String> uniqueValues = entry.getValue().stream().distinct().sorted().collect(Collectors.toList());
            entry.setValue(uniqueValues);
        }

        detail.put("attributes", attributesMap);

        return detail;
    }
}
