package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.Cart;
import com.quattrinh.shop.repository.CartRepository;
import com.quattrinh.shop.service.criteria.CartCriteria;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.service.mapper.CartMapper;
import jakarta.persistence.criteria.JoinType;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Cart} entities in the database.
 * The main input is a {@link CartCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link CartDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class CartQueryService extends QueryService<Cart> {

    private static final Logger LOG = LoggerFactory.getLogger(CartQueryService.class);

    private final CartRepository cartRepository;

    private final CartMapper cartMapper;

    public CartQueryService(CartRepository cartRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.cartMapper = cartMapper;
    }

    /**
     * Return a {@link List} of {@link CartDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<CartDTO> findByCriteria(CartCriteria criteria) {
        LOG.debug("find by criteria : {}", criteria);
        final Specification<Cart> specification = createSpecification(criteria);
        return cartMapper.toDto(cartRepository.findAll(specification));
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(CartCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Cart> specification = createSpecification(criteria);
        return cartRepository.count(specification);
    }

    /**
     * Function to convert {@link CartCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Cart> createSpecification(CartCriteria criteria) {
        Specification<Cart> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Cart_.id));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), Cart_.createdAt));
            }
            if (criteria.getUpdatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdatedAt(), Cart_.updatedAt));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getUserId(), root -> root.join(Cart_.user, JoinType.LEFT).get(User_.id))
                );
            }
        }
        return specification;
    }
}
