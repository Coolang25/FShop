package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.repository.ProductRepository;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.mapper.ProductMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
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

    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
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
}
