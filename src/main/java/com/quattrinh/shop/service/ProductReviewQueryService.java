package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.ProductReview;
import com.quattrinh.shop.repository.ProductReviewRepository;
import com.quattrinh.shop.service.criteria.ProductReviewCriteria;
import com.quattrinh.shop.service.dto.ProductReviewDTO;
import com.quattrinh.shop.service.mapper.ProductReviewMapper;
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
 * Service for executing complex queries for {@link ProductReview} entities in the database.
 * The main input is a {@link ProductReviewCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ProductReviewDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProductReviewQueryService extends QueryService<ProductReview> {

    private static final Logger LOG = LoggerFactory.getLogger(ProductReviewQueryService.class);

    private final ProductReviewRepository productReviewRepository;

    private final ProductReviewMapper productReviewMapper;

    public ProductReviewQueryService(ProductReviewRepository productReviewRepository, ProductReviewMapper productReviewMapper) {
        this.productReviewRepository = productReviewRepository;
        this.productReviewMapper = productReviewMapper;
    }

    /**
     * Return a {@link Page} of {@link ProductReviewDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductReviewDTO> findByCriteria(ProductReviewCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ProductReview> specification = createSpecification(criteria);
        Page<ProductReview> test = productReviewRepository.findAll(specification, page);
        return productReviewRepository.findAll(specification, page).map(productReviewMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProductReviewCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<ProductReview> specification = createSpecification(criteria);
        return productReviewRepository.count(specification);
    }

    /**
     * Function to convert {@link ProductReviewCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ProductReview> createSpecification(ProductReviewCriteria criteria) {
        Specification<ProductReview> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ProductReview_.id));
            }
            if (criteria.getRating() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getRating(), ProductReview_.rating));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), ProductReview_.createdAt));
            }
            if (criteria.getUpdatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdatedAt(), ProductReview_.updatedAt));
            }
            if (criteria.getProductId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getProductId(), root -> root.join(ProductReview_.product, JoinType.LEFT).get(Product_.id))
                );
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getUserId(), root -> root.join(ProductReview_.user, JoinType.LEFT).get(User_.id))
                );
            }
        }
        return specification;
    }
}
