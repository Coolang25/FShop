package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.repository.ProductAttributeValueRepository;
import com.quattrinh.shop.service.criteria.ProductAttributeValueCriteria;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import com.quattrinh.shop.service.mapper.ProductAttributeValueMapper;
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
 * Service for executing complex queries for {@link ProductAttributeValue} entities in the database.
 * The main input is a {@link ProductAttributeValueCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ProductAttributeValueDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProductAttributeValueQueryService extends QueryService<ProductAttributeValue> {

    private static final Logger LOG = LoggerFactory.getLogger(ProductAttributeValueQueryService.class);

    private final ProductAttributeValueRepository productAttributeValueRepository;

    private final ProductAttributeValueMapper productAttributeValueMapper;

    public ProductAttributeValueQueryService(
        ProductAttributeValueRepository productAttributeValueRepository,
        ProductAttributeValueMapper productAttributeValueMapper
    ) {
        this.productAttributeValueRepository = productAttributeValueRepository;
        this.productAttributeValueMapper = productAttributeValueMapper;
    }

    /**
     * Return a {@link Page} of {@link ProductAttributeValueDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductAttributeValueDTO> findByCriteria(ProductAttributeValueCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ProductAttributeValue> specification = createSpecification(criteria);
        return productAttributeValueRepository.findAll(specification, page).map(productAttributeValueMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProductAttributeValueCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<ProductAttributeValue> specification = createSpecification(criteria);
        return productAttributeValueRepository.count(specification);
    }

    /**
     * Function to convert {@link ProductAttributeValueCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ProductAttributeValue> createSpecification(ProductAttributeValueCriteria criteria) {
        Specification<ProductAttributeValue> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ProductAttributeValue_.id));
            }
            if (criteria.getValue() != null) {
                specification = specification.and(buildStringSpecification(criteria.getValue(), ProductAttributeValue_.value));
            }
            if (criteria.getAttributeId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getAttributeId(), root ->
                        root.join(ProductAttributeValue_.attribute, JoinType.LEFT).get(ProductAttribute_.id)
                    )
                );
            }
        }
        return specification;
    }
}
