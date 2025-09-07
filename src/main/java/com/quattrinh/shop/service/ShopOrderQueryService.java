package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.repository.ShopOrderRepository;
import com.quattrinh.shop.service.criteria.ShopOrderCriteria;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import com.quattrinh.shop.service.mapper.ShopOrderMapper;
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
 * Service for executing complex queries for {@link ShopOrder} entities in the database.
 * The main input is a {@link ShopOrderCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ShopOrderDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ShopOrderQueryService extends QueryService<ShopOrder> {

    private static final Logger LOG = LoggerFactory.getLogger(ShopOrderQueryService.class);

    private final ShopOrderRepository shopOrderRepository;

    private final ShopOrderMapper shopOrderMapper;

    public ShopOrderQueryService(ShopOrderRepository shopOrderRepository, ShopOrderMapper shopOrderMapper) {
        this.shopOrderRepository = shopOrderRepository;
        this.shopOrderMapper = shopOrderMapper;
    }

    /**
     * Return a {@link Page} of {@link ShopOrderDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ShopOrderDTO> findByCriteria(ShopOrderCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ShopOrder> specification = createSpecification(criteria);
        return shopOrderRepository.findAll(specification, page).map(shopOrderMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ShopOrderCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<ShopOrder> specification = createSpecification(criteria);
        return shopOrderRepository.count(specification);
    }

    /**
     * Function to convert {@link ShopOrderCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ShopOrder> createSpecification(ShopOrderCriteria criteria) {
        Specification<ShopOrder> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ShopOrder_.id));
            }
            if (criteria.getStatus() != null) {
                specification = specification.and(buildSpecification(criteria.getStatus(), ShopOrder_.status));
            }
            if (criteria.getTotal() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getTotal(), ShopOrder_.total));
            }
            if (criteria.getShippingAddress() != null) {
                specification = specification.and(buildStringSpecification(criteria.getShippingAddress(), ShopOrder_.shippingAddress));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), ShopOrder_.createdAt));
            }
            if (criteria.getUpdatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdatedAt(), ShopOrder_.updatedAt));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getUserId(), root -> root.join(ShopOrder_.user, JoinType.LEFT).get(User_.id))
                );
            }
            if (criteria.getPaymentId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getPaymentId(), root -> root.join(ShopOrder_.payment, JoinType.LEFT).get(Payment_.id))
                );
            }
        }
        return specification;
    }
}
