package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.ChatbotLog;
import com.quattrinh.shop.repository.ChatbotLogRepository;
import com.quattrinh.shop.service.dto.ChatbotLogDTO;
import com.quattrinh.shop.service.mapper.ChatbotLogMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ChatbotLog}.
 */
@Service
@Transactional
public class ChatbotLogService {

    private static final Logger LOG = LoggerFactory.getLogger(ChatbotLogService.class);

    private final ChatbotLogRepository chatbotLogRepository;

    private final ChatbotLogMapper chatbotLogMapper;

    public ChatbotLogService(ChatbotLogRepository chatbotLogRepository, ChatbotLogMapper chatbotLogMapper) {
        this.chatbotLogRepository = chatbotLogRepository;
        this.chatbotLogMapper = chatbotLogMapper;
    }

    /**
     * Save a chatbotLog.
     *
     * @param chatbotLogDTO the entity to save.
     * @return the persisted entity.
     */
    public ChatbotLogDTO save(ChatbotLogDTO chatbotLogDTO) {
        LOG.debug("Request to save ChatbotLog : {}", chatbotLogDTO);
        ChatbotLog chatbotLog = chatbotLogMapper.toEntity(chatbotLogDTO);
        chatbotLog = chatbotLogRepository.save(chatbotLog);
        return chatbotLogMapper.toDto(chatbotLog);
    }

    /**
     * Update a chatbotLog.
     *
     * @param chatbotLogDTO the entity to save.
     * @return the persisted entity.
     */
    public ChatbotLogDTO update(ChatbotLogDTO chatbotLogDTO) {
        LOG.debug("Request to update ChatbotLog : {}", chatbotLogDTO);
        ChatbotLog chatbotLog = chatbotLogMapper.toEntity(chatbotLogDTO);
        chatbotLog = chatbotLogRepository.save(chatbotLog);
        return chatbotLogMapper.toDto(chatbotLog);
    }

    /**
     * Partially update a chatbotLog.
     *
     * @param chatbotLogDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ChatbotLogDTO> partialUpdate(ChatbotLogDTO chatbotLogDTO) {
        LOG.debug("Request to partially update ChatbotLog : {}", chatbotLogDTO);

        return chatbotLogRepository
            .findById(chatbotLogDTO.getId())
            .map(existingChatbotLog -> {
                chatbotLogMapper.partialUpdate(existingChatbotLog, chatbotLogDTO);

                return existingChatbotLog;
            })
            .map(chatbotLogRepository::save)
            .map(chatbotLogMapper::toDto);
    }

    /**
     * Get all the chatbotLogs with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ChatbotLogDTO> findAllWithEagerRelationships(Pageable pageable) {
        return chatbotLogRepository.findAllWithEagerRelationships(pageable).map(chatbotLogMapper::toDto);
    }

    /**
     * Get one chatbotLog by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ChatbotLogDTO> findOne(Long id) {
        LOG.debug("Request to get ChatbotLog : {}", id);
        return chatbotLogRepository.findOneWithEagerRelationships(id).map(chatbotLogMapper::toDto);
    }

    /**
     * Delete the chatbotLog by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ChatbotLog : {}", id);
        chatbotLogRepository.deleteById(id);
    }
}
