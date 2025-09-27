package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.repository.ProductVariantRepository;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.mapper.ProductVariantMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ProductVariant}.
 */
@Service
@Transactional
public class ProductVariantService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductVariantService.class);

    private final ProductVariantRepository productVariantRepository;

    private final ProductVariantMapper productVariantMapper;

    public ProductVariantService(ProductVariantRepository productVariantRepository, ProductVariantMapper productVariantMapper) {
        this.productVariantRepository = productVariantRepository;
        this.productVariantMapper = productVariantMapper;
    }

    /**
     * Save a productVariant.
     *
     * @param productVariantDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductVariantDTO save(ProductVariantDTO productVariantDTO) {
        LOG.debug("Request to save ProductVariant : {}", productVariantDTO);
        ProductVariant productVariant = productVariantMapper.toEntity(productVariantDTO);
        productVariant = productVariantRepository.save(productVariant);
        return productVariantMapper.toDto(productVariant);
    }

    /**
     * Update a productVariant.
     *
     * @param productVariantDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductVariantDTO update(ProductVariantDTO productVariantDTO) {
        LOG.debug("Request to update ProductVariant : {}", productVariantDTO);
        ProductVariant productVariant = productVariantMapper.toEntity(productVariantDTO);
        productVariant = productVariantRepository.save(productVariant);
        return productVariantMapper.toDto(productVariant);
    }

    /**
     * Partially update a productVariant.
     *
     * @param productVariantDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductVariantDTO> partialUpdate(ProductVariantDTO productVariantDTO) {
        LOG.debug("Request to partially update ProductVariant : {}", productVariantDTO);

        return productVariantRepository
            .findById(productVariantDTO.getId())
            .map(existingProductVariant -> {
                productVariantMapper.partialUpdate(existingProductVariant, productVariantDTO);

                return existingProductVariant;
            })
            .map(productVariantRepository::save)
            .map(productVariantMapper::toDto);
    }

    /**
     * Get all the productVariants with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProductVariantDTO> findAllWithEagerRelationships(Pageable pageable) {
        return productVariantRepository.findAllWithEagerRelationships(pageable).map(productVariantMapper::toDto);
    }

    /**
     * Get one productVariant by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductVariantDTO> findOne(Long id) {
        LOG.debug("Request to get ProductVariant : {}", id);
        return productVariantRepository.findOneWithEagerRelationships(id).map(productVariantMapper::toDto);
    }

    /**
     * Delete the productVariant by id (soft delete).
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to soft delete ProductVariant : {}", id);
        productVariantRepository
            .findById(id)
            .ifPresent(variant -> {
                variant.setIsActive(false);
                productVariantRepository.save(variant);
            });
    }
}
