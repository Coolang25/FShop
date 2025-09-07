package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.VariantAttributeValue;
import com.quattrinh.shop.repository.VariantAttributeValueRepository;
import com.quattrinh.shop.service.dto.VariantAttributeValueDTO;
import com.quattrinh.shop.service.mapper.VariantAttributeValueMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.VariantAttributeValue}.
 */
@Service
@Transactional
public class VariantAttributeValueService {

    private static final Logger LOG = LoggerFactory.getLogger(VariantAttributeValueService.class);

    private final VariantAttributeValueRepository variantAttributeValueRepository;

    private final VariantAttributeValueMapper variantAttributeValueMapper;

    public VariantAttributeValueService(
        VariantAttributeValueRepository variantAttributeValueRepository,
        VariantAttributeValueMapper variantAttributeValueMapper
    ) {
        this.variantAttributeValueRepository = variantAttributeValueRepository;
        this.variantAttributeValueMapper = variantAttributeValueMapper;
    }

    /**
     * Save a variantAttributeValue.
     *
     * @param variantAttributeValueDTO the entity to save.
     * @return the persisted entity.
     */
    public VariantAttributeValueDTO save(VariantAttributeValueDTO variantAttributeValueDTO) {
        LOG.debug("Request to save VariantAttributeValue : {}", variantAttributeValueDTO);
        VariantAttributeValue variantAttributeValue = variantAttributeValueMapper.toEntity(variantAttributeValueDTO);
        variantAttributeValue = variantAttributeValueRepository.save(variantAttributeValue);
        return variantAttributeValueMapper.toDto(variantAttributeValue);
    }

    /**
     * Update a variantAttributeValue.
     *
     * @param variantAttributeValueDTO the entity to save.
     * @return the persisted entity.
     */
    public VariantAttributeValueDTO update(VariantAttributeValueDTO variantAttributeValueDTO) {
        LOG.debug("Request to update VariantAttributeValue : {}", variantAttributeValueDTO);
        VariantAttributeValue variantAttributeValue = variantAttributeValueMapper.toEntity(variantAttributeValueDTO);
        variantAttributeValue = variantAttributeValueRepository.save(variantAttributeValue);
        return variantAttributeValueMapper.toDto(variantAttributeValue);
    }

    /**
     * Partially update a variantAttributeValue.
     *
     * @param variantAttributeValueDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<VariantAttributeValueDTO> partialUpdate(VariantAttributeValueDTO variantAttributeValueDTO) {
        LOG.debug("Request to partially update VariantAttributeValue : {}", variantAttributeValueDTO);

        return variantAttributeValueRepository
            .findById(variantAttributeValueDTO.getId())
            .map(existingVariantAttributeValue -> {
                variantAttributeValueMapper.partialUpdate(existingVariantAttributeValue, variantAttributeValueDTO);

                return existingVariantAttributeValue;
            })
            .map(variantAttributeValueRepository::save)
            .map(variantAttributeValueMapper::toDto);
    }

    /**
     * Get all the variantAttributeValues with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<VariantAttributeValueDTO> findAllWithEagerRelationships(Pageable pageable) {
        return variantAttributeValueRepository.findAllWithEagerRelationships(pageable).map(variantAttributeValueMapper::toDto);
    }

    /**
     * Get one variantAttributeValue by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<VariantAttributeValueDTO> findOne(Long id) {
        LOG.debug("Request to get VariantAttributeValue : {}", id);
        return variantAttributeValueRepository.findOneWithEagerRelationships(id).map(variantAttributeValueMapper::toDto);
    }

    /**
     * Delete the variantAttributeValue by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete VariantAttributeValue : {}", id);
        variantAttributeValueRepository.deleteById(id);
    }
}
