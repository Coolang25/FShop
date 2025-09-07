package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.VariantAttributeValue;
import com.quattrinh.shop.repository.VariantAttributeValueRepository;
import com.quattrinh.shop.service.criteria.VariantAttributeValueCriteria;
import com.quattrinh.shop.service.dto.VariantAttributeValueDTO;
import com.quattrinh.shop.service.mapper.VariantAttributeValueMapper;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link VariantAttributeValue} entities in the database.
 * The main input is a {@link VariantAttributeValueCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link VariantAttributeValueDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class VariantAttributeValueQueryService extends QueryService<VariantAttributeValue> {

    private static final Logger LOG = LoggerFactory.getLogger(VariantAttributeValueQueryService.class);

    private final VariantAttributeValueRepository variantAttributeValueRepository;

    private final VariantAttributeValueMapper variantAttributeValueMapper;

    public VariantAttributeValueQueryService(
        VariantAttributeValueRepository variantAttributeValueRepository,
        VariantAttributeValueMapper variantAttributeValueMapper
    ) {
        this.variantAttributeValueRepository = variantAttributeValueRepository;
        this.variantAttributeValueMapper = variantAttributeValueMapper;
    }

    /**
     * Return a {@link Page} of {@link VariantAttributeValueDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<VariantAttributeValueDTO> findByCriteria(VariantAttributeValueCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<VariantAttributeValue> specification = createSpecification(criteria);
        return variantAttributeValueRepository.findAll(specification, page).map(variantAttributeValueMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(VariantAttributeValueCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<VariantAttributeValue> specification = createSpecification(criteria);
        return variantAttributeValueRepository.count(specification);
    }

    /**
     * Function to convert {@link VariantAttributeValueCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<VariantAttributeValue> createSpecification(VariantAttributeValueCriteria criteria) {
        Specification<VariantAttributeValue> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), VariantAttributeValue_.id));
            }
            if (criteria.getVariantId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getVariantId(), root ->
                        root.join(VariantAttributeValue_.variant, JoinType.LEFT).get(ProductVariant_.id)
                    )
                );
            }
            if (criteria.getAttributeValueId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getAttributeValueId(), root ->
                        root.join(VariantAttributeValue_.attributeValue, JoinType.LEFT).get(ProductAttributeValue_.id)
                    )
                );
            }
        }
        return specification;
    }
}
