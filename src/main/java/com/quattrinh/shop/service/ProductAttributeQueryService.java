package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.repository.ProductAttributeRepository;
import com.quattrinh.shop.service.criteria.ProductAttributeCriteria;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.service.mapper.ProductAttributeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link ProductAttribute} entities in the database.
 * The main input is a {@link ProductAttributeCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ProductAttributeDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProductAttributeQueryService extends QueryService<ProductAttribute> {

    private static final Logger LOG = LoggerFactory.getLogger(ProductAttributeQueryService.class);

    private final ProductAttributeRepository productAttributeRepository;

    private final ProductAttributeMapper productAttributeMapper;

    public ProductAttributeQueryService(
        ProductAttributeRepository productAttributeRepository,
        ProductAttributeMapper productAttributeMapper
    ) {
        this.productAttributeRepository = productAttributeRepository;
        this.productAttributeMapper = productAttributeMapper;
    }

    /**
     * Return a {@link Page} of {@link ProductAttributeDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductAttributeDTO> findByCriteria(ProductAttributeCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ProductAttribute> specification = createSpecification(criteria);
        return productAttributeRepository.findAll(specification, page).map(productAttributeMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProductAttributeCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<ProductAttribute> specification = createSpecification(criteria);
        return productAttributeRepository.count(specification);
    }

    /**
     * Function to convert {@link ProductAttributeCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ProductAttribute> createSpecification(ProductAttributeCriteria criteria) {
        Specification<ProductAttribute> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ProductAttribute_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), ProductAttribute_.name));
            }
        }
        return specification;
    }
}
