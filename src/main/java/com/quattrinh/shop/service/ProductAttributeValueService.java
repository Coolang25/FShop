package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.repository.ProductAttributeValueRepository;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import com.quattrinh.shop.service.mapper.ProductAttributeValueMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ProductAttributeValue}.
 */
@Service
@Transactional
public class ProductAttributeValueService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductAttributeValueService.class);

    private final ProductAttributeValueRepository productAttributeValueRepository;

    private final ProductAttributeValueMapper productAttributeValueMapper;

    public ProductAttributeValueService(
        ProductAttributeValueRepository productAttributeValueRepository,
        ProductAttributeValueMapper productAttributeValueMapper
    ) {
        this.productAttributeValueRepository = productAttributeValueRepository;
        this.productAttributeValueMapper = productAttributeValueMapper;
    }

    /**
     * Save a productAttributeValue.
     *
     * @param productAttributeValueDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductAttributeValueDTO save(ProductAttributeValueDTO productAttributeValueDTO) {
        LOG.debug("Request to save ProductAttributeValue : {}", productAttributeValueDTO);
        ProductAttributeValue productAttributeValue = productAttributeValueMapper.toEntity(productAttributeValueDTO);
        productAttributeValue = productAttributeValueRepository.save(productAttributeValue);
        return productAttributeValueMapper.toDto(productAttributeValue);
    }

    /**
     * Update a productAttributeValue.
     *
     * @param productAttributeValueDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductAttributeValueDTO update(ProductAttributeValueDTO productAttributeValueDTO) {
        LOG.debug("Request to update ProductAttributeValue : {}", productAttributeValueDTO);
        ProductAttributeValue productAttributeValue = productAttributeValueMapper.toEntity(productAttributeValueDTO);
        productAttributeValue = productAttributeValueRepository.save(productAttributeValue);
        return productAttributeValueMapper.toDto(productAttributeValue);
    }

    /**
     * Partially update a productAttributeValue.
     *
     * @param productAttributeValueDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductAttributeValueDTO> partialUpdate(ProductAttributeValueDTO productAttributeValueDTO) {
        LOG.debug("Request to partially update ProductAttributeValue : {}", productAttributeValueDTO);

        return productAttributeValueRepository
            .findById(productAttributeValueDTO.getId())
            .map(existingProductAttributeValue -> {
                productAttributeValueMapper.partialUpdate(existingProductAttributeValue, productAttributeValueDTO);

                return existingProductAttributeValue;
            })
            .map(productAttributeValueRepository::save)
            .map(productAttributeValueMapper::toDto);
    }

    /**
     * Get all the productAttributeValues with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProductAttributeValueDTO> findAllWithEagerRelationships(Pageable pageable) {
        return productAttributeValueRepository.findAllWithEagerRelationships(pageable).map(productAttributeValueMapper::toDto);
    }

    /**
     * Get one productAttributeValue by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductAttributeValueDTO> findOne(Long id) {
        LOG.debug("Request to get ProductAttributeValue : {}", id);
        return productAttributeValueRepository.findOneWithEagerRelationships(id).map(productAttributeValueMapper::toDto);
    }

    /**
     * Delete the productAttributeValue by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ProductAttributeValue : {}", id);
        productAttributeValueRepository.deleteById(id);
    }
}
