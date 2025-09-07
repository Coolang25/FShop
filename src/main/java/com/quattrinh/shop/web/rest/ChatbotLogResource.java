package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.ChatbotLogRepository;
import com.quattrinh.shop.service.ChatbotLogQueryService;
import com.quattrinh.shop.service.ChatbotLogService;
import com.quattrinh.shop.service.criteria.ChatbotLogCriteria;
import com.quattrinh.shop.service.dto.ChatbotLogDTO;
import com.quattrinh.shop.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.quattrinh.shop.domain.ChatbotLog}.
 */
@RestController
@RequestMapping("/api/chatbot-logs")
public class ChatbotLogResource {

    private static final Logger LOG = LoggerFactory.getLogger(ChatbotLogResource.class);

    private static final String ENTITY_NAME = "chatbotLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChatbotLogService chatbotLogService;

    private final ChatbotLogRepository chatbotLogRepository;

    private final ChatbotLogQueryService chatbotLogQueryService;

    public ChatbotLogResource(
        ChatbotLogService chatbotLogService,
        ChatbotLogRepository chatbotLogRepository,
        ChatbotLogQueryService chatbotLogQueryService
    ) {
        this.chatbotLogService = chatbotLogService;
        this.chatbotLogRepository = chatbotLogRepository;
        this.chatbotLogQueryService = chatbotLogQueryService;
    }

    /**
     * {@code POST  /chatbot-logs} : Create a new chatbotLog.
     *
     * @param chatbotLogDTO the chatbotLogDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chatbotLogDTO, or with status {@code 400 (Bad Request)} if the chatbotLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ChatbotLogDTO> createChatbotLog(@Valid @RequestBody ChatbotLogDTO chatbotLogDTO) throws URISyntaxException {
        LOG.debug("REST request to save ChatbotLog : {}", chatbotLogDTO);
        if (chatbotLogDTO.getId() != null) {
            throw new BadRequestAlertException("A new chatbotLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        chatbotLogDTO = chatbotLogService.save(chatbotLogDTO);
        return ResponseEntity.created(new URI("/api/chatbot-logs/" + chatbotLogDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, chatbotLogDTO.getId().toString()))
            .body(chatbotLogDTO);
    }

    /**
     * {@code PUT  /chatbot-logs/:id} : Updates an existing chatbotLog.
     *
     * @param id the id of the chatbotLogDTO to save.
     * @param chatbotLogDTO the chatbotLogDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatbotLogDTO,
     * or with status {@code 400 (Bad Request)} if the chatbotLogDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chatbotLogDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ChatbotLogDTO> updateChatbotLog(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChatbotLogDTO chatbotLogDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ChatbotLog : {}, {}", id, chatbotLogDTO);
        if (chatbotLogDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatbotLogDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatbotLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        chatbotLogDTO = chatbotLogService.update(chatbotLogDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chatbotLogDTO.getId().toString()))
            .body(chatbotLogDTO);
    }

    /**
     * {@code PATCH  /chatbot-logs/:id} : Partial updates given fields of an existing chatbotLog, field will ignore if it is null
     *
     * @param id the id of the chatbotLogDTO to save.
     * @param chatbotLogDTO the chatbotLogDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatbotLogDTO,
     * or with status {@code 400 (Bad Request)} if the chatbotLogDTO is not valid,
     * or with status {@code 404 (Not Found)} if the chatbotLogDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the chatbotLogDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChatbotLogDTO> partialUpdateChatbotLog(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChatbotLogDTO chatbotLogDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ChatbotLog partially : {}, {}", id, chatbotLogDTO);
        if (chatbotLogDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatbotLogDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatbotLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChatbotLogDTO> result = chatbotLogService.partialUpdate(chatbotLogDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chatbotLogDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /chatbot-logs} : get all the chatbotLogs.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chatbotLogs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ChatbotLogDTO>> getAllChatbotLogs(
        ChatbotLogCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get ChatbotLogs by criteria: {}", criteria);

        Page<ChatbotLogDTO> page = chatbotLogQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chatbot-logs/count} : count all the chatbotLogs.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countChatbotLogs(ChatbotLogCriteria criteria) {
        LOG.debug("REST request to count ChatbotLogs by criteria: {}", criteria);
        return ResponseEntity.ok().body(chatbotLogQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /chatbot-logs/:id} : get the "id" chatbotLog.
     *
     * @param id the id of the chatbotLogDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chatbotLogDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChatbotLogDTO> getChatbotLog(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ChatbotLog : {}", id);
        Optional<ChatbotLogDTO> chatbotLogDTO = chatbotLogService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chatbotLogDTO);
    }

    /**
     * {@code DELETE  /chatbot-logs/:id} : delete the "id" chatbotLog.
     *
     * @param id the id of the chatbotLogDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChatbotLog(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ChatbotLog : {}", id);
        chatbotLogService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
