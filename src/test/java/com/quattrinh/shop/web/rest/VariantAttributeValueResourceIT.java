//package com.quattrinh.shop.web.rest;
//
//import static com.quattrinh.shop.domain.VariantAttributeValueAsserts.*;
//import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.hamcrest.Matchers.hasItem;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.quattrinh.shop.IntegrationTest;
//import com.quattrinh.shop.domain.ProductAttributeValue;
//import com.quattrinh.shop.domain.ProductVariant;
//import com.quattrinh.shop.domain.VariantAttributeValue;
//import com.quattrinh.shop.repository.VariantAttributeValueRepository;
//import com.quattrinh.shop.service.VariantAttributeValueService;
//import com.quattrinh.shop.service.dto.VariantAttributeValueDTO;
//import com.quattrinh.shop.service.mapper.VariantAttributeValueMapper;
//import jakarta.persistence.EntityManager;
//import java.util.ArrayList;
//import java.util.Random;
//import java.util.concurrent.atomic.AtomicLong;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.transaction.annotation.Transactional;
//
///**
// * Integration tests for the {@link VariantAttributeValueResource} REST controller.
// */
//@IntegrationTest
//@ExtendWith(MockitoExtension.class)
//@AutoConfigureMockMvc
//@WithMockUser
//class VariantAttributeValueResourceIT {
//
//    private static final String ENTITY_API_URL = "/api/variant-attribute-values";
//    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
//
//    private static Random random = new Random();
//    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
//
//    @Autowired
//    private ObjectMapper om;
//
//    @Autowired
//    private VariantAttributeValueRepository variantAttributeValueRepository;
//
//    @Mock
//    private VariantAttributeValueRepository variantAttributeValueRepositoryMock;
//
//    @Autowired
//    private VariantAttributeValueMapper variantAttributeValueMapper;
//
//    @Mock
//    private VariantAttributeValueService variantAttributeValueServiceMock;
//
//    @Autowired
//    private EntityManager em;
//
//    @Autowired
//    private MockMvc restVariantAttributeValueMockMvc;
//
//    private VariantAttributeValue variantAttributeValue;
//
//    private VariantAttributeValue insertedVariantAttributeValue;
//
//    /**
//     * Create an entity for this test.
//     *
//     * This is a static method, as tests for other entities might also need it,
//     * if they test an entity which requires the current entity.
//     */
//    public static VariantAttributeValue createEntity() {
//        return new VariantAttributeValue();
//    }
//
//    /**
//     * Create an updated entity for this test.
//     *
//     * This is a static method, as tests for other entities might also need it,
//     * if they test an entity which requires the current entity.
//     */
//    public static VariantAttributeValue createUpdatedEntity() {
//        return new VariantAttributeValue();
//    }
//
//    @BeforeEach
//    public void initTest() {
//        variantAttributeValue = createEntity();
//    }
//
//    @AfterEach
//    public void cleanup() {
//        if (insertedVariantAttributeValue != null) {
//            variantAttributeValueRepository.delete(insertedVariantAttributeValue);
//            insertedVariantAttributeValue = null;
//        }
//    }
//
//    @Test
//    @Transactional
//    void createVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeCreate = getRepositoryCount();
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//        var returnedVariantAttributeValueDTO = om.readValue(
//            restVariantAttributeValueMockMvc
//                .perform(
//                    post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(variantAttributeValueDTO))
//                )
//                .andExpect(status().isCreated())
//                .andReturn()
//                .getResponse()
//                .getContentAsString(),
//            VariantAttributeValueDTO.class
//        );
//
//        // Validate the VariantAttributeValue in the database
//        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
//        var returnedVariantAttributeValue = variantAttributeValueMapper.toEntity(returnedVariantAttributeValueDTO);
//        assertVariantAttributeValueUpdatableFieldsEquals(
//            returnedVariantAttributeValue,
//            getPersistedVariantAttributeValue(returnedVariantAttributeValue)
//        );
//
//        insertedVariantAttributeValue = returnedVariantAttributeValue;
//    }
//
//    @Test
//    @Transactional
//    void createVariantAttributeValueWithExistingId() throws Exception {
//        // Create the VariantAttributeValue with an existing ID
//        variantAttributeValue.setId(1L);
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        long databaseSizeBeforeCreate = getRepositoryCount();
//
//        // An entity with an existing ID cannot be created, so this API call must fail
//        restVariantAttributeValueMockMvc
//            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(variantAttributeValueDTO)))
//            .andExpect(status().isBadRequest());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeCreate);
//    }
//
//    @Test
//    @Transactional
//    void getAllVariantAttributeValues() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        // Get all the variantAttributeValueList
//        restVariantAttributeValueMockMvc
//            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
//            .andExpect(status().isOk())
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//            .andExpect(jsonPath("$.[*].id").value(hasItem(variantAttributeValue.getId().intValue())));
//    }
//
//    @SuppressWarnings({ "unchecked" })
//    void getAllVariantAttributeValuesWithEagerRelationshipsIsEnabled() throws Exception {
//        when(variantAttributeValueServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
//
//        restVariantAttributeValueMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());
//
//        verify(variantAttributeValueServiceMock, times(1)).findAllWithEagerRelationships(any());
//    }
//
//    @SuppressWarnings({ "unchecked" })
//    void getAllVariantAttributeValuesWithEagerRelationshipsIsNotEnabled() throws Exception {
//        when(variantAttributeValueServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
//
//        restVariantAttributeValueMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
//        verify(variantAttributeValueRepositoryMock, times(1)).findAll(any(Pageable.class));
//    }
//
//    @Test
//    @Transactional
//    void getVariantAttributeValue() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        // Get the variantAttributeValue
//        restVariantAttributeValueMockMvc
//            .perform(get(ENTITY_API_URL_ID, variantAttributeValue.getId()))
//            .andExpect(status().isOk())
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//            .andExpect(jsonPath("$.id").value(variantAttributeValue.getId().intValue()));
//    }
//
//    @Test
//    @Transactional
//    void getVariantAttributeValuesByIdFiltering() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        Long id = variantAttributeValue.getId();
//
//        defaultVariantAttributeValueFiltering("id.equals=" + id, "id.notEquals=" + id);
//
//        defaultVariantAttributeValueFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);
//
//        defaultVariantAttributeValueFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
//    }
//
//    @Test
//    @Transactional
//    void getAllVariantAttributeValuesByVariantIsEqualToSomething() throws Exception {
//        ProductVariant variant;
//        if (TestUtil.findAll(em, ProductVariant.class).isEmpty()) {
//            variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//            variant = ProductVariantResourceIT.createEntity();
//        } else {
//            variant = TestUtil.findAll(em, ProductVariant.class).get(0);
//        }
//        em.persist(variant);
//        em.flush();
//        variantAttributeValue.setVariant(variant);
//        variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//        Long variantId = variant.getId();
//        // Get all the variantAttributeValueList where variant equals to variantId
//        defaultVariantAttributeValueShouldBeFound("variantId.equals=" + variantId);
//
//        // Get all the variantAttributeValueList where variant equals to (variantId + 1)
//        defaultVariantAttributeValueShouldNotBeFound("variantId.equals=" + (variantId + 1));
//    }
//
//    @Test
//    @Transactional
//    void getAllVariantAttributeValuesByAttributeValueIsEqualToSomething() throws Exception {
//        ProductAttributeValue attributeValue;
//        if (TestUtil.findAll(em, ProductAttributeValue.class).isEmpty()) {
//            variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//            attributeValue = ProductAttributeValueResourceIT.createEntity();
//        } else {
//            attributeValue = TestUtil.findAll(em, ProductAttributeValue.class).get(0);
//        }
//        em.persist(attributeValue);
//        em.flush();
//        variantAttributeValue.setAttributeValue(attributeValue);
//        variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//        Long attributeValueId = attributeValue.getId();
//        // Get all the variantAttributeValueList where attributeValue equals to attributeValueId
//        defaultVariantAttributeValueShouldBeFound("attributeValueId.equals=" + attributeValueId);
//
//        // Get all the variantAttributeValueList where attributeValue equals to (attributeValueId + 1)
//        defaultVariantAttributeValueShouldNotBeFound("attributeValueId.equals=" + (attributeValueId + 1));
//    }
//
//    private void defaultVariantAttributeValueFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
//        defaultVariantAttributeValueShouldBeFound(shouldBeFound);
//        defaultVariantAttributeValueShouldNotBeFound(shouldNotBeFound);
//    }
//
//    /**
//     * Executes the search, and checks that the default entity is returned.
//     */
//    private void defaultVariantAttributeValueShouldBeFound(String filter) throws Exception {
//        restVariantAttributeValueMockMvc
//            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
//            .andExpect(status().isOk())
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//            .andExpect(jsonPath("$.[*].id").value(hasItem(variantAttributeValue.getId().intValue())));
//
//        // Check, that the count call also returns 1
//        restVariantAttributeValueMockMvc
//            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
//            .andExpect(status().isOk())
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//            .andExpect(content().string("1"));
//    }
//
//    /**
//     * Executes the search, and checks that the default entity is not returned.
//     */
//    private void defaultVariantAttributeValueShouldNotBeFound(String filter) throws Exception {
//        restVariantAttributeValueMockMvc
//            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
//            .andExpect(status().isOk())
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//            .andExpect(jsonPath("$").isArray())
//            .andExpect(jsonPath("$").isEmpty());
//
//        // Check, that the count call also returns 0
//        restVariantAttributeValueMockMvc
//            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
//            .andExpect(status().isOk())
//            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//            .andExpect(content().string("0"));
//    }
//
//    @Test
//    @Transactional
//    void getNonExistingVariantAttributeValue() throws Exception {
//        // Get the variantAttributeValue
//        restVariantAttributeValueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
//    }
//
//    @Test
//    @Transactional
//    void putExistingVariantAttributeValue() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//
//        // Update the variantAttributeValue
//        VariantAttributeValue updatedVariantAttributeValue = variantAttributeValueRepository
//            .findById(variantAttributeValue.getId())
//            .orElseThrow();
//        // Disconnect from session so that the updates on updatedVariantAttributeValue are not directly saved in db
//        em.detach(updatedVariantAttributeValue);
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(updatedVariantAttributeValue);
//
//        restVariantAttributeValueMockMvc
//            .perform(
//                put(ENTITY_API_URL_ID, variantAttributeValueDTO.getId())
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .content(om.writeValueAsBytes(variantAttributeValueDTO))
//            )
//            .andExpect(status().isOk());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//        assertPersistedVariantAttributeValueToMatchAllProperties(updatedVariantAttributeValue);
//    }
//
//    @Test
//    @Transactional
//    void putNonExistingVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//        variantAttributeValue.setId(longCount.incrementAndGet());
//
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        // If the entity doesn't have an ID, it will throw BadRequestAlertException
//        restVariantAttributeValueMockMvc
//            .perform(
//                put(ENTITY_API_URL_ID, variantAttributeValueDTO.getId())
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .content(om.writeValueAsBytes(variantAttributeValueDTO))
//            )
//            .andExpect(status().isBadRequest());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//    }
//
//    @Test
//    @Transactional
//    void putWithIdMismatchVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//        variantAttributeValue.setId(longCount.incrementAndGet());
//
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
//        restVariantAttributeValueMockMvc
//            .perform(
//                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .content(om.writeValueAsBytes(variantAttributeValueDTO))
//            )
//            .andExpect(status().isBadRequest());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//    }
//
//    @Test
//    @Transactional
//    void putWithMissingIdPathParamVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//        variantAttributeValue.setId(longCount.incrementAndGet());
//
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
//        restVariantAttributeValueMockMvc
//            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(variantAttributeValueDTO)))
//            .andExpect(status().isMethodNotAllowed());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//    }
//
//    @Test
//    @Transactional
//    void partialUpdateVariantAttributeValueWithPatch() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//
//        // Update the variantAttributeValue using partial update
//        VariantAttributeValue partialUpdatedVariantAttributeValue = new VariantAttributeValue();
//        partialUpdatedVariantAttributeValue.setId(variantAttributeValue.getId());
//
//        restVariantAttributeValueMockMvc
//            .perform(
//                patch(ENTITY_API_URL_ID, partialUpdatedVariantAttributeValue.getId())
//                    .contentType("application/merge-patch+json")
//                    .content(om.writeValueAsBytes(partialUpdatedVariantAttributeValue))
//            )
//            .andExpect(status().isOk());
//
//        // Validate the VariantAttributeValue in the database
//
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//        assertVariantAttributeValueUpdatableFieldsEquals(
//            createUpdateProxyForBean(partialUpdatedVariantAttributeValue, variantAttributeValue),
//            getPersistedVariantAttributeValue(variantAttributeValue)
//        );
//    }
//
//    @Test
//    @Transactional
//    void fullUpdateVariantAttributeValueWithPatch() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//
//        // Update the variantAttributeValue using partial update
//        VariantAttributeValue partialUpdatedVariantAttributeValue = new VariantAttributeValue();
//        partialUpdatedVariantAttributeValue.setId(variantAttributeValue.getId());
//
//        restVariantAttributeValueMockMvc
//            .perform(
//                patch(ENTITY_API_URL_ID, partialUpdatedVariantAttributeValue.getId())
//                    .contentType("application/merge-patch+json")
//                    .content(om.writeValueAsBytes(partialUpdatedVariantAttributeValue))
//            )
//            .andExpect(status().isOk());
//
//        // Validate the VariantAttributeValue in the database
//
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//        assertVariantAttributeValueUpdatableFieldsEquals(
//            partialUpdatedVariantAttributeValue,
//            getPersistedVariantAttributeValue(partialUpdatedVariantAttributeValue)
//        );
//    }
//
//    @Test
//    @Transactional
//    void patchNonExistingVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//        variantAttributeValue.setId(longCount.incrementAndGet());
//
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        // If the entity doesn't have an ID, it will throw BadRequestAlertException
//        restVariantAttributeValueMockMvc
//            .perform(
//                patch(ENTITY_API_URL_ID, variantAttributeValueDTO.getId())
//                    .contentType("application/merge-patch+json")
//                    .content(om.writeValueAsBytes(variantAttributeValueDTO))
//            )
//            .andExpect(status().isBadRequest());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//    }
//
//    @Test
//    @Transactional
//    void patchWithIdMismatchVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//        variantAttributeValue.setId(longCount.incrementAndGet());
//
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
//        restVariantAttributeValueMockMvc
//            .perform(
//                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
//                    .contentType("application/merge-patch+json")
//                    .content(om.writeValueAsBytes(variantAttributeValueDTO))
//            )
//            .andExpect(status().isBadRequest());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//    }
//
//    @Test
//    @Transactional
//    void patchWithMissingIdPathParamVariantAttributeValue() throws Exception {
//        long databaseSizeBeforeUpdate = getRepositoryCount();
//        variantAttributeValue.setId(longCount.incrementAndGet());
//
//        // Create the VariantAttributeValue
//        VariantAttributeValueDTO variantAttributeValueDTO = variantAttributeValueMapper.toDto(variantAttributeValue);
//
//        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
//        restVariantAttributeValueMockMvc
//            .perform(
//                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(variantAttributeValueDTO))
//            )
//            .andExpect(status().isMethodNotAllowed());
//
//        // Validate the VariantAttributeValue in the database
//        assertSameRepositoryCount(databaseSizeBeforeUpdate);
//    }
//
//    @Test
//    @Transactional
//    void deleteVariantAttributeValue() throws Exception {
//        // Initialize the database
//        insertedVariantAttributeValue = variantAttributeValueRepository.saveAndFlush(variantAttributeValue);
//
//        long databaseSizeBeforeDelete = getRepositoryCount();
//
//        // Delete the variantAttributeValue
//        restVariantAttributeValueMockMvc
//            .perform(delete(ENTITY_API_URL_ID, variantAttributeValue.getId()).accept(MediaType.APPLICATION_JSON))
//            .andExpect(status().isNoContent());
//
//        // Validate the database contains one less item
//        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
//    }
//
//    protected long getRepositoryCount() {
//        return variantAttributeValueRepository.count();
//    }
//
//    protected void assertIncrementedRepositoryCount(long countBefore) {
//        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
//    }
//
//    protected void assertDecrementedRepositoryCount(long countBefore) {
//        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
//    }
//
//    protected void assertSameRepositoryCount(long countBefore) {
//        assertThat(countBefore).isEqualTo(getRepositoryCount());
//    }
//
//    protected VariantAttributeValue getPersistedVariantAttributeValue(VariantAttributeValue variantAttributeValue) {
//        return variantAttributeValueRepository.findById(variantAttributeValue.getId()).orElseThrow();
//    }
//
//    protected void assertPersistedVariantAttributeValueToMatchAllProperties(VariantAttributeValue expectedVariantAttributeValue) {
//        assertVariantAttributeValueAllPropertiesEquals(
//            expectedVariantAttributeValue,
//            getPersistedVariantAttributeValue(expectedVariantAttributeValue)
//        );
//    }
//
//    protected void assertPersistedVariantAttributeValueToMatchUpdatableProperties(VariantAttributeValue expectedVariantAttributeValue) {
//        assertVariantAttributeValueAllUpdatablePropertiesEquals(
//            expectedVariantAttributeValue,
//            getPersistedVariantAttributeValue(expectedVariantAttributeValue)
//        );
//    }
//}
