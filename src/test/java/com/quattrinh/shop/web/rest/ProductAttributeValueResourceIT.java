package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.ProductAttributeValueAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.repository.ProductAttributeValueRepository;
import com.quattrinh.shop.service.ProductAttributeValueService;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import com.quattrinh.shop.service.mapper.ProductAttributeValueMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link ProductAttributeValueResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProductAttributeValueResourceIT {

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/product-attribute-values";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductAttributeValueRepository productAttributeValueRepository;

    @Mock
    private ProductAttributeValueRepository productAttributeValueRepositoryMock;

    @Autowired
    private ProductAttributeValueMapper productAttributeValueMapper;

    @Mock
    private ProductAttributeValueService productAttributeValueServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductAttributeValueMockMvc;

    private ProductAttributeValue productAttributeValue;

    private ProductAttributeValue insertedProductAttributeValue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductAttributeValue createEntity() {
        return new ProductAttributeValue().value(DEFAULT_VALUE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductAttributeValue createUpdatedEntity() {
        return new ProductAttributeValue().value(UPDATED_VALUE);
    }

    @BeforeEach
    public void initTest() {
        productAttributeValue = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProductAttributeValue != null) {
            productAttributeValueRepository.delete(insertedProductAttributeValue);
            insertedProductAttributeValue = null;
        }
    }

    @Test
    @Transactional
    void createProductAttributeValue() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);
        var returnedProductAttributeValueDTO = om.readValue(
            restProductAttributeValueMockMvc
                .perform(
                    post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeValueDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductAttributeValueDTO.class
        );

        // Validate the ProductAttributeValue in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProductAttributeValue = productAttributeValueMapper.toEntity(returnedProductAttributeValueDTO);
        assertProductAttributeValueUpdatableFieldsEquals(
            returnedProductAttributeValue,
            getPersistedProductAttributeValue(returnedProductAttributeValue)
        );

        insertedProductAttributeValue = returnedProductAttributeValue;
    }

    @Test
    @Transactional
    void createProductAttributeValueWithExistingId() throws Exception {
        // Create the ProductAttributeValue with an existing ID
        productAttributeValue.setId(1L);
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductAttributeValueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeValueDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productAttributeValue.setValue(null);

        // Create the ProductAttributeValue, which fails.
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        restProductAttributeValueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeValueDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductAttributeValues() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get all the productAttributeValueList
        restProductAttributeValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productAttributeValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProductAttributeValuesWithEagerRelationshipsIsEnabled() throws Exception {
        when(productAttributeValueServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProductAttributeValueMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(productAttributeValueServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProductAttributeValuesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(productAttributeValueServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProductAttributeValueMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(productAttributeValueRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProductAttributeValue() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get the productAttributeValue
        restProductAttributeValueMockMvc
            .perform(get(ENTITY_API_URL_ID, productAttributeValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productAttributeValue.getId().intValue()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getProductAttributeValuesByIdFiltering() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        Long id = productAttributeValue.getId();

        defaultProductAttributeValueFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultProductAttributeValueFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultProductAttributeValueFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllProductAttributeValuesByValueIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get all the productAttributeValueList where value equals to
        defaultProductAttributeValueFiltering("value.equals=" + DEFAULT_VALUE, "value.equals=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllProductAttributeValuesByValueIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get all the productAttributeValueList where value in
        defaultProductAttributeValueFiltering("value.in=" + DEFAULT_VALUE + "," + UPDATED_VALUE, "value.in=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllProductAttributeValuesByValueIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get all the productAttributeValueList where value is not null
        defaultProductAttributeValueFiltering("value.specified=true", "value.specified=false");
    }

    @Test
    @Transactional
    void getAllProductAttributeValuesByValueContainsSomething() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get all the productAttributeValueList where value contains
        defaultProductAttributeValueFiltering("value.contains=" + DEFAULT_VALUE, "value.contains=" + UPDATED_VALUE);
    }

    @Test
    @Transactional
    void getAllProductAttributeValuesByValueNotContainsSomething() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        // Get all the productAttributeValueList where value does not contain
        defaultProductAttributeValueFiltering("value.doesNotContain=" + UPDATED_VALUE, "value.doesNotContain=" + DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void getAllProductAttributeValuesByAttributeIsEqualToSomething() throws Exception {
        ProductAttribute attribute;
        if (TestUtil.findAll(em, ProductAttribute.class).isEmpty()) {
            productAttributeValueRepository.saveAndFlush(productAttributeValue);
            attribute = ProductAttributeResourceIT.createEntity();
        } else {
            attribute = TestUtil.findAll(em, ProductAttribute.class).get(0);
        }
        em.persist(attribute);
        em.flush();
        productAttributeValue.setAttribute(attribute);
        productAttributeValueRepository.saveAndFlush(productAttributeValue);
        Long attributeId = attribute.getId();
        // Get all the productAttributeValueList where attribute equals to attributeId
        defaultProductAttributeValueShouldBeFound("attributeId.equals=" + attributeId);

        // Get all the productAttributeValueList where attribute equals to (attributeId + 1)
        defaultProductAttributeValueShouldNotBeFound("attributeId.equals=" + (attributeId + 1));
    }

    private void defaultProductAttributeValueFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultProductAttributeValueShouldBeFound(shouldBeFound);
        defaultProductAttributeValueShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProductAttributeValueShouldBeFound(String filter) throws Exception {
        restProductAttributeValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productAttributeValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));

        // Check, that the count call also returns 1
        restProductAttributeValueMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProductAttributeValueShouldNotBeFound(String filter) throws Exception {
        restProductAttributeValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProductAttributeValueMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProductAttributeValue() throws Exception {
        // Get the productAttributeValue
        restProductAttributeValueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductAttributeValue() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productAttributeValue
        ProductAttributeValue updatedProductAttributeValue = productAttributeValueRepository
            .findById(productAttributeValue.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedProductAttributeValue are not directly saved in db
        em.detach(updatedProductAttributeValue);
        updatedProductAttributeValue.value(UPDATED_VALUE);
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(updatedProductAttributeValue);

        restProductAttributeValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productAttributeValueDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productAttributeValueDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductAttributeValueToMatchAllProperties(updatedProductAttributeValue);
    }

    @Test
    @Transactional
    void putNonExistingProductAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttributeValue.setId(longCount.incrementAndGet());

        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductAttributeValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productAttributeValueDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productAttributeValueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttributeValue.setId(longCount.incrementAndGet());

        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productAttributeValueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttributeValue.setId(longCount.incrementAndGet());

        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeValueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeValueDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductAttributeValueWithPatch() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productAttributeValue using partial update
        ProductAttributeValue partialUpdatedProductAttributeValue = new ProductAttributeValue();
        partialUpdatedProductAttributeValue.setId(productAttributeValue.getId());

        restProductAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductAttributeValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductAttributeValue))
            )
            .andExpect(status().isOk());

        // Validate the ProductAttributeValue in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductAttributeValueUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProductAttributeValue, productAttributeValue),
            getPersistedProductAttributeValue(productAttributeValue)
        );
    }

    @Test
    @Transactional
    void fullUpdateProductAttributeValueWithPatch() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productAttributeValue using partial update
        ProductAttributeValue partialUpdatedProductAttributeValue = new ProductAttributeValue();
        partialUpdatedProductAttributeValue.setId(productAttributeValue.getId());

        partialUpdatedProductAttributeValue.value(UPDATED_VALUE);

        restProductAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductAttributeValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductAttributeValue))
            )
            .andExpect(status().isOk());

        // Validate the ProductAttributeValue in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductAttributeValueUpdatableFieldsEquals(
            partialUpdatedProductAttributeValue,
            getPersistedProductAttributeValue(partialUpdatedProductAttributeValue)
        );
    }

    @Test
    @Transactional
    void patchNonExistingProductAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttributeValue.setId(longCount.incrementAndGet());

        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productAttributeValueDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productAttributeValueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttributeValue.setId(longCount.incrementAndGet());

        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productAttributeValueDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttributeValue.setId(longCount.incrementAndGet());

        // Create the ProductAttributeValue
        ProductAttributeValueDTO productAttributeValueDTO = productAttributeValueMapper.toDto(productAttributeValue);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productAttributeValueDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductAttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductAttributeValue() throws Exception {
        // Initialize the database
        insertedProductAttributeValue = productAttributeValueRepository.saveAndFlush(productAttributeValue);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productAttributeValue
        restProductAttributeValueMockMvc
            .perform(delete(ENTITY_API_URL_ID, productAttributeValue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return productAttributeValueRepository.count();
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

    protected ProductAttributeValue getPersistedProductAttributeValue(ProductAttributeValue productAttributeValue) {
        return productAttributeValueRepository.findById(productAttributeValue.getId()).orElseThrow();
    }

    protected void assertPersistedProductAttributeValueToMatchAllProperties(ProductAttributeValue expectedProductAttributeValue) {
        assertProductAttributeValueAllPropertiesEquals(
            expectedProductAttributeValue,
            getPersistedProductAttributeValue(expectedProductAttributeValue)
        );
    }

    protected void assertPersistedProductAttributeValueToMatchUpdatableProperties(ProductAttributeValue expectedProductAttributeValue) {
        assertProductAttributeValueAllUpdatablePropertiesEquals(
            expectedProductAttributeValue,
            getPersistedProductAttributeValue(expectedProductAttributeValue)
        );
    }
}
