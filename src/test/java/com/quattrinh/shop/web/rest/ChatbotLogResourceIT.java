package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.ChatbotLogAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.ChatbotLog;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.repository.ChatbotLogRepository;
import com.quattrinh.shop.repository.UserRepository;
import com.quattrinh.shop.service.ChatbotLogService;
import com.quattrinh.shop.service.dto.ChatbotLogDTO;
import com.quattrinh.shop.service.mapper.ChatbotLogMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChatbotLogResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ChatbotLogResourceIT {

    private static final String DEFAULT_QUESTION = "AAAAAAAAAA";
    private static final String UPDATED_QUESTION = "BBBBBBBBBB";

    private static final String DEFAULT_ANSWER = "AAAAAAAAAA";
    private static final String UPDATED_ANSWER = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/chatbot-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ChatbotLogRepository chatbotLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private ChatbotLogRepository chatbotLogRepositoryMock;

    @Autowired
    private ChatbotLogMapper chatbotLogMapper;

    @Mock
    private ChatbotLogService chatbotLogServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChatbotLogMockMvc;

    private ChatbotLog chatbotLog;

    private ChatbotLog insertedChatbotLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatbotLog createEntity() {
        return new ChatbotLog().question(DEFAULT_QUESTION).answer(DEFAULT_ANSWER).createdAt(DEFAULT_CREATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatbotLog createUpdatedEntity() {
        return new ChatbotLog().question(UPDATED_QUESTION).answer(UPDATED_ANSWER).createdAt(UPDATED_CREATED_AT);
    }

    @BeforeEach
    public void initTest() {
        chatbotLog = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedChatbotLog != null) {
            chatbotLogRepository.delete(insertedChatbotLog);
            insertedChatbotLog = null;
        }
    }

    @Test
    @Transactional
    void createChatbotLog() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);
        var returnedChatbotLogDTO = om.readValue(
            restChatbotLogMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(chatbotLogDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ChatbotLogDTO.class
        );

        // Validate the ChatbotLog in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedChatbotLog = chatbotLogMapper.toEntity(returnedChatbotLogDTO);
        assertChatbotLogUpdatableFieldsEquals(returnedChatbotLog, getPersistedChatbotLog(returnedChatbotLog));

        insertedChatbotLog = returnedChatbotLog;
    }

    @Test
    @Transactional
    void createChatbotLogWithExistingId() throws Exception {
        // Create the ChatbotLog with an existing ID
        chatbotLog.setId(1L);
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChatbotLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(chatbotLogDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChatbotLogs() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        // Get all the chatbotLogList
        restChatbotLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatbotLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChatbotLogsWithEagerRelationshipsIsEnabled() throws Exception {
        when(chatbotLogServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChatbotLogMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(chatbotLogServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChatbotLogsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(chatbotLogServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChatbotLogMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(chatbotLogRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getChatbotLog() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        // Get the chatbotLog
        restChatbotLogMockMvc
            .perform(get(ENTITY_API_URL_ID, chatbotLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chatbotLog.getId().intValue()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION.toString()))
            .andExpect(jsonPath("$.answer").value(DEFAULT_ANSWER.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    void getChatbotLogsByIdFiltering() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        Long id = chatbotLog.getId();

        defaultChatbotLogFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultChatbotLogFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultChatbotLogFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllChatbotLogsByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        // Get all the chatbotLogList where createdAt equals to
        defaultChatbotLogFiltering("createdAt.equals=" + DEFAULT_CREATED_AT, "createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllChatbotLogsByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        // Get all the chatbotLogList where createdAt in
        defaultChatbotLogFiltering("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT, "createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllChatbotLogsByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        // Get all the chatbotLogList where createdAt is not null
        defaultChatbotLogFiltering("createdAt.specified=true", "createdAt.specified=false");
    }

    @Test
    @Transactional
    void getAllChatbotLogsByUserIsEqualToSomething() throws Exception {
        User user;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            chatbotLogRepository.saveAndFlush(chatbotLog);
            user = UserResourceIT.createEntity();
        } else {
            user = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(user);
        em.flush();
        chatbotLog.setUser(user);
        chatbotLogRepository.saveAndFlush(chatbotLog);
        Long userId = user.getId();
        // Get all the chatbotLogList where user equals to userId
        defaultChatbotLogShouldBeFound("userId.equals=" + userId);

        // Get all the chatbotLogList where user equals to (userId + 1)
        defaultChatbotLogShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    private void defaultChatbotLogFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultChatbotLogShouldBeFound(shouldBeFound);
        defaultChatbotLogShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultChatbotLogShouldBeFound(String filter) throws Exception {
        restChatbotLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatbotLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION.toString())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));

        // Check, that the count call also returns 1
        restChatbotLogMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultChatbotLogShouldNotBeFound(String filter) throws Exception {
        restChatbotLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restChatbotLogMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingChatbotLog() throws Exception {
        // Get the chatbotLog
        restChatbotLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChatbotLog() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the chatbotLog
        ChatbotLog updatedChatbotLog = chatbotLogRepository.findById(chatbotLog.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedChatbotLog are not directly saved in db
        em.detach(updatedChatbotLog);
        updatedChatbotLog.question(UPDATED_QUESTION).answer(UPDATED_ANSWER).createdAt(UPDATED_CREATED_AT);
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(updatedChatbotLog);

        restChatbotLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chatbotLogDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(chatbotLogDTO))
            )
            .andExpect(status().isOk());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedChatbotLogToMatchAllProperties(updatedChatbotLog);
    }

    @Test
    @Transactional
    void putNonExistingChatbotLog() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        chatbotLog.setId(longCount.incrementAndGet());

        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatbotLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chatbotLogDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(chatbotLogDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChatbotLog() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        chatbotLog.setId(longCount.incrementAndGet());

        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatbotLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(chatbotLogDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChatbotLog() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        chatbotLog.setId(longCount.incrementAndGet());

        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatbotLogMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(chatbotLogDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChatbotLogWithPatch() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the chatbotLog using partial update
        ChatbotLog partialUpdatedChatbotLog = new ChatbotLog();
        partialUpdatedChatbotLog.setId(chatbotLog.getId());

        restChatbotLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatbotLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedChatbotLog))
            )
            .andExpect(status().isOk());

        // Validate the ChatbotLog in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertChatbotLogUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedChatbotLog, chatbotLog),
            getPersistedChatbotLog(chatbotLog)
        );
    }

    @Test
    @Transactional
    void fullUpdateChatbotLogWithPatch() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the chatbotLog using partial update
        ChatbotLog partialUpdatedChatbotLog = new ChatbotLog();
        partialUpdatedChatbotLog.setId(chatbotLog.getId());

        partialUpdatedChatbotLog.question(UPDATED_QUESTION).answer(UPDATED_ANSWER).createdAt(UPDATED_CREATED_AT);

        restChatbotLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatbotLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedChatbotLog))
            )
            .andExpect(status().isOk());

        // Validate the ChatbotLog in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertChatbotLogUpdatableFieldsEquals(partialUpdatedChatbotLog, getPersistedChatbotLog(partialUpdatedChatbotLog));
    }

    @Test
    @Transactional
    void patchNonExistingChatbotLog() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        chatbotLog.setId(longCount.incrementAndGet());

        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatbotLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chatbotLogDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(chatbotLogDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChatbotLog() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        chatbotLog.setId(longCount.incrementAndGet());

        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatbotLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(chatbotLogDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChatbotLog() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        chatbotLog.setId(longCount.incrementAndGet());

        // Create the ChatbotLog
        ChatbotLogDTO chatbotLogDTO = chatbotLogMapper.toDto(chatbotLog);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatbotLogMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(chatbotLogDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChatbotLog in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChatbotLog() throws Exception {
        // Initialize the database
        insertedChatbotLog = chatbotLogRepository.saveAndFlush(chatbotLog);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the chatbotLog
        restChatbotLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, chatbotLog.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return chatbotLogRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ChatbotLog getPersistedChatbotLog(ChatbotLog chatbotLog) {
        return chatbotLogRepository.findById(chatbotLog.getId()).orElseThrow();
    }

    protected void assertPersistedChatbotLogToMatchAllProperties(ChatbotLog expectedChatbotLog) {
        assertChatbotLogAllPropertiesEquals(expectedChatbotLog, getPersistedChatbotLog(expectedChatbotLog));
    }

    protected void assertPersistedChatbotLogToMatchUpdatableProperties(ChatbotLog expectedChatbotLog) {
        assertChatbotLogAllUpdatablePropertiesEquals(expectedChatbotLog, getPersistedChatbotLog(expectedChatbotLog));
    }
}
