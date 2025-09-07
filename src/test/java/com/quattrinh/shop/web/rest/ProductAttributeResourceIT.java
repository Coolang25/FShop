package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.ProductAttributeAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.repository.ProductAttributeRepository;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.service.mapper.ProductAttributeMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductAttributeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductAttributeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/product-attributes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductAttributeRepository productAttributeRepository;

    @Autowired
    private ProductAttributeMapper productAttributeMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductAttributeMockMvc;

    private ProductAttribute productAttribute;

    private ProductAttribute insertedProductAttribute;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductAttribute createEntity() {
        return new ProductAttribute().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductAttribute createUpdatedEntity() {
        return new ProductAttribute().name(UPDATED_NAME);
    }

    @BeforeEach
    public void initTest() {
        productAttribute = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProductAttribute != null) {
            productAttributeRepository.delete(insertedProductAttribute);
            insertedProductAttribute = null;
        }
    }

    @Test
    @Transactional
    void createProductAttribute() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);
        var returnedProductAttributeDTO = om.readValue(
            restProductAttributeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductAttributeDTO.class
        );

        // Validate the ProductAttribute in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProductAttribute = productAttributeMapper.toEntity(returnedProductAttributeDTO);
        assertProductAttributeUpdatableFieldsEquals(returnedProductAttribute, getPersistedProductAttribute(returnedProductAttribute));

        insertedProductAttribute = returnedProductAttribute;
    }

    @Test
    @Transactional
    void createProductAttributeWithExistingId() throws Exception {
        // Create the ProductAttribute with an existing ID
        productAttribute.setId(1L);
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productAttribute.setName(null);

        // Create the ProductAttribute, which fails.
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        restProductAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductAttributes() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get all the productAttributeList
        restProductAttributeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productAttribute.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getProductAttribute() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get the productAttribute
        restProductAttributeMockMvc
            .perform(get(ENTITY_API_URL_ID, productAttribute.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productAttribute.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getProductAttributesByIdFiltering() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        Long id = productAttribute.getId();

        defaultProductAttributeFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultProductAttributeFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultProductAttributeFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllProductAttributesByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get all the productAttributeList where name equals to
        defaultProductAttributeFiltering("name.equals=" + DEFAULT_NAME, "name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProductAttributesByNameIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get all the productAttributeList where name in
        defaultProductAttributeFiltering("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME, "name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProductAttributesByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get all the productAttributeList where name is not null
        defaultProductAttributeFiltering("name.specified=true", "name.specified=false");
    }

    @Test
    @Transactional
    void getAllProductAttributesByNameContainsSomething() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get all the productAttributeList where name contains
        defaultProductAttributeFiltering("name.contains=" + DEFAULT_NAME, "name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllProductAttributesByNameNotContainsSomething() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        // Get all the productAttributeList where name does not contain
        defaultProductAttributeFiltering("name.doesNotContain=" + UPDATED_NAME, "name.doesNotContain=" + DEFAULT_NAME);
    }

    private void defaultProductAttributeFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultProductAttributeShouldBeFound(shouldBeFound);
        defaultProductAttributeShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProductAttributeShouldBeFound(String filter) throws Exception {
        restProductAttributeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productAttribute.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));

        // Check, that the count call also returns 1
        restProductAttributeMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProductAttributeShouldNotBeFound(String filter) throws Exception {
        restProductAttributeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProductAttributeMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProductAttribute() throws Exception {
        // Get the productAttribute
        restProductAttributeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductAttribute() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productAttribute
        ProductAttribute updatedProductAttribute = productAttributeRepository.findById(productAttribute.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProductAttribute are not directly saved in db
        em.detach(updatedProductAttribute);
        updatedProductAttribute.name(UPDATED_NAME);
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(updatedProductAttribute);

        restProductAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productAttributeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productAttributeDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductAttributeToMatchAllProperties(updatedProductAttribute);
    }

    @Test
    @Transactional
    void putNonExistingProductAttribute() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttribute.setId(longCount.incrementAndGet());

        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productAttributeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productAttributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductAttribute() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttribute.setId(longCount.incrementAndGet());

        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productAttributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductAttribute() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttribute.setId(longCount.incrementAndGet());

        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productAttributeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductAttributeWithPatch() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productAttribute using partial update
        ProductAttribute partialUpdatedProductAttribute = new ProductAttribute();
        partialUpdatedProductAttribute.setId(productAttribute.getId());

        partialUpdatedProductAttribute.name(UPDATED_NAME);

        restProductAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductAttribute))
            )
            .andExpect(status().isOk());

        // Validate the ProductAttribute in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductAttributeUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProductAttribute, productAttribute),
            getPersistedProductAttribute(productAttribute)
        );
    }

    @Test
    @Transactional
    void fullUpdateProductAttributeWithPatch() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productAttribute using partial update
        ProductAttribute partialUpdatedProductAttribute = new ProductAttribute();
        partialUpdatedProductAttribute.setId(productAttribute.getId());

        partialUpdatedProductAttribute.name(UPDATED_NAME);

        restProductAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductAttribute))
            )
            .andExpect(status().isOk());

        // Validate the ProductAttribute in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductAttributeUpdatableFieldsEquals(
            partialUpdatedProductAttribute,
            getPersistedProductAttribute(partialUpdatedProductAttribute)
        );
    }

    @Test
    @Transactional
    void patchNonExistingProductAttribute() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttribute.setId(longCount.incrementAndGet());

        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productAttributeDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productAttributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductAttribute() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttribute.setId(longCount.incrementAndGet());

        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productAttributeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductAttribute() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productAttribute.setId(longCount.incrementAndGet());

        // Create the ProductAttribute
        ProductAttributeDTO productAttributeDTO = productAttributeMapper.toDto(productAttribute);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductAttributeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productAttributeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductAttribute in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductAttribute() throws Exception {
        // Initialize the database
        insertedProductAttribute = productAttributeRepository.saveAndFlush(productAttribute);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productAttribute
        restProductAttributeMockMvc
            .perform(delete(ENTITY_API_URL_ID, productAttribute.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return productAttributeRepository.count();
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

    protected ProductAttribute getPersistedProductAttribute(ProductAttribute productAttribute) {
        return productAttributeRepository.findById(productAttribute.getId()).orElseThrow();
    }

    protected void assertPersistedProductAttributeToMatchAllProperties(ProductAttribute expectedProductAttribute) {
        assertProductAttributeAllPropertiesEquals(expectedProductAttribute, getPersistedProductAttribute(expectedProductAttribute));
    }

    protected void assertPersistedProductAttributeToMatchUpdatableProperties(ProductAttribute expectedProductAttribute) {
        assertProductAttributeAllUpdatablePropertiesEquals(
            expectedProductAttribute,
            getPersistedProductAttribute(expectedProductAttribute)
        );
    }
}
