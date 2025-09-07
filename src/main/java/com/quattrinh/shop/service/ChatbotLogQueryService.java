package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.*; // for static metamodels
import com.quattrinh.shop.domain.ChatbotLog;
import com.quattrinh.shop.repository.ChatbotLogRepository;
import com.quattrinh.shop.service.criteria.ChatbotLogCriteria;
import com.quattrinh.shop.service.dto.ChatbotLogDTO;
import com.quattrinh.shop.service.mapper.ChatbotLogMapper;
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
 * Service for executing complex queries for {@link ChatbotLog} entities in the database.
 * The main input is a {@link ChatbotLogCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ChatbotLogDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ChatbotLogQueryService extends QueryService<ChatbotLog> {

    private static final Logger LOG = LoggerFactory.getLogger(ChatbotLogQueryService.class);

    private final ChatbotLogRepository chatbotLogRepository;

    private final ChatbotLogMapper chatbotLogMapper;

    public ChatbotLogQueryService(ChatbotLogRepository chatbotLogRepository, ChatbotLogMapper chatbotLogMapper) {
        this.chatbotLogRepository = chatbotLogRepository;
        this.chatbotLogMapper = chatbotLogMapper;
    }

    /**
     * Return a {@link Page} of {@link ChatbotLogDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ChatbotLogDTO> findByCriteria(ChatbotLogCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ChatbotLog> specification = createSpecification(criteria);
        return chatbotLogRepository.findAll(specification, page).map(chatbotLogMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ChatbotLogCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<ChatbotLog> specification = createSpecification(criteria);
        return chatbotLogRepository.count(specification);
    }

    /**
     * Function to convert {@link ChatbotLogCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ChatbotLog> createSpecification(ChatbotLogCriteria criteria) {
        Specification<ChatbotLog> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ChatbotLog_.id));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), ChatbotLog_.createdAt));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(
                    buildSpecification(criteria.getUserId(), root -> root.join(ChatbotLog_.user, JoinType.LEFT).get(User_.id))
                );
            }
        }
        return specification;
    }
}
