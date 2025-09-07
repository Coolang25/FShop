package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.repository.ProductAttributeRepository;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.service.mapper.ProductAttributeMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ProductAttribute}.
 */
@Service
@Transactional
public class ProductAttributeService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductAttributeService.class);

    private final ProductAttributeRepository productAttributeRepository;

    private final ProductAttributeMapper productAttributeMapper;

    public ProductAttributeService(ProductAttributeRepository productAttributeRepository, ProductAttributeMapper productAttributeMapper) {
        this.productAttributeRepository = productAttributeRepository;
        this.productAttributeMapper = productAttributeMapper;
    }

    /**
     * Save a productAttribute.
     *
     * @param productAttributeDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductAttributeDTO save(ProductAttributeDTO productAttributeDTO) {
        LOG.debug("Request to save ProductAttribute : {}", productAttributeDTO);
        ProductAttribute productAttribute = productAttributeMapper.toEntity(productAttributeDTO);
        productAttribute = productAttributeRepository.save(productAttribute);
        return productAttributeMapper.toDto(productAttribute);
    }

    /**
     * Update a productAttribute.
     *
     * @param productAttributeDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductAttributeDTO update(ProductAttributeDTO productAttributeDTO) {
        LOG.debug("Request to update ProductAttribute : {}", productAttributeDTO);
        ProductAttribute productAttribute = productAttributeMapper.toEntity(productAttributeDTO);
        productAttribute = productAttributeRepository.save(productAttribute);
        return productAttributeMapper.toDto(productAttribute);
    }

    /**
     * Partially update a productAttribute.
     *
     * @param productAttributeDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductAttributeDTO> partialUpdate(ProductAttributeDTO productAttributeDTO) {
        LOG.debug("Request to partially update ProductAttribute : {}", productAttributeDTO);

        return productAttributeRepository
            .findById(productAttributeDTO.getId())
            .map(existingProductAttribute -> {
                productAttributeMapper.partialUpdate(existingProductAttribute, productAttributeDTO);

                return existingProductAttribute;
            })
            .map(productAttributeRepository::save)
            .map(productAttributeMapper::toDto);
    }

    /**
     * Get one productAttribute by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductAttributeDTO> findOne(Long id) {
        LOG.debug("Request to get ProductAttribute : {}", id);
        return productAttributeRepository.findById(id).map(productAttributeMapper::toDto);
    }

    /**
     * Delete the productAttribute by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ProductAttribute : {}", id);
        productAttributeRepository.deleteById(id);
    }
}
