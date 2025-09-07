package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.ProductVariantAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static com.quattrinh.shop.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.repository.ProductVariantRepository;
import com.quattrinh.shop.service.ProductVariantService;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.mapper.ProductVariantMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link ProductVariantResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProductVariantResourceIT {

    private static final String DEFAULT_SKU = "AAAAAAAAAA";
    private static final String UPDATED_SKU = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);
    private static final BigDecimal SMALLER_PRICE = new BigDecimal(1 - 1);

    private static final Integer DEFAULT_STOCK = 0;
    private static final Integer UPDATED_STOCK = 1;
    private static final Integer SMALLER_STOCK = 0 - 1;

    private static final String ENTITY_API_URL = "/api/product-variants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductVariantRepository productVariantRepositoryMock;

    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Mock
    private ProductVariantService productVariantServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductVariantMockMvc;

    private ProductVariant productVariant;

    private ProductVariant insertedProductVariant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductVariant createEntity() {
        return new ProductVariant().sku(DEFAULT_SKU).price(DEFAULT_PRICE).stock(DEFAULT_STOCK);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductVariant createUpdatedEntity() {
        return new ProductVariant().sku(UPDATED_SKU).price(UPDATED_PRICE).stock(UPDATED_STOCK);
    }

    @BeforeEach
    public void initTest() {
        productVariant = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProductVariant != null) {
            productVariantRepository.delete(insertedProductVariant);
            insertedProductVariant = null;
        }
    }

    @Test
    @Transactional
    void createProductVariant() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);
        var returnedProductVariantDTO = om.readValue(
            restProductVariantMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productVariantDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductVariantDTO.class
        );

        // Validate the ProductVariant in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProductVariant = productVariantMapper.toEntity(returnedProductVariantDTO);
        assertProductVariantUpdatableFieldsEquals(returnedProductVariant, getPersistedProductVariant(returnedProductVariant));

        insertedProductVariant = returnedProductVariant;
    }

    @Test
    @Transactional
    void createProductVariantWithExistingId() throws Exception {
        // Create the ProductVariant with an existing ID
        productVariant.setId(1L);
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductVariantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productVariantDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSkuIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productVariant.setSku(null);

        // Create the ProductVariant, which fails.
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        restProductVariantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productVariantDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productVariant.setPrice(null);

        // Create the ProductVariant, which fails.
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        restProductVariantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productVariantDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStockIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productVariant.setStock(null);

        // Create the ProductVariant, which fails.
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        restProductVariantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productVariantDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductVariants() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList
        restProductVariantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productVariant.getId().intValue())))
            .andExpect(jsonPath("$.[*].sku").value(hasItem(DEFAULT_SKU)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProductVariantsWithEagerRelationshipsIsEnabled() throws Exception {
        when(productVariantServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProductVariantMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(productVariantServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProductVariantsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(productVariantServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProductVariantMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(productVariantRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProductVariant() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get the productVariant
        restProductVariantMockMvc
            .perform(get(ENTITY_API_URL_ID, productVariant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productVariant.getId().intValue()))
            .andExpect(jsonPath("$.sku").value(DEFAULT_SKU))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK));
    }

    @Test
    @Transactional
    void getProductVariantsByIdFiltering() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        Long id = productVariant.getId();

        defaultProductVariantFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultProductVariantFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultProductVariantFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllProductVariantsBySkuIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where sku equals to
        defaultProductVariantFiltering("sku.equals=" + DEFAULT_SKU, "sku.equals=" + UPDATED_SKU);
    }

    @Test
    @Transactional
    void getAllProductVariantsBySkuIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where sku in
        defaultProductVariantFiltering("sku.in=" + DEFAULT_SKU + "," + UPDATED_SKU, "sku.in=" + UPDATED_SKU);
    }

    @Test
    @Transactional
    void getAllProductVariantsBySkuIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where sku is not null
        defaultProductVariantFiltering("sku.specified=true", "sku.specified=false");
    }

    @Test
    @Transactional
    void getAllProductVariantsBySkuContainsSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where sku contains
        defaultProductVariantFiltering("sku.contains=" + DEFAULT_SKU, "sku.contains=" + UPDATED_SKU);
    }

    @Test
    @Transactional
    void getAllProductVariantsBySkuNotContainsSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where sku does not contain
        defaultProductVariantFiltering("sku.doesNotContain=" + UPDATED_SKU, "sku.doesNotContain=" + DEFAULT_SKU);
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price equals to
        defaultProductVariantFiltering("price.equals=" + DEFAULT_PRICE, "price.equals=" + UPDATED_PRICE);
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price in
        defaultProductVariantFiltering("price.in=" + DEFAULT_PRICE + "," + UPDATED_PRICE, "price.in=" + UPDATED_PRICE);
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price is not null
        defaultProductVariantFiltering("price.specified=true", "price.specified=false");
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price is greater than or equal to
        defaultProductVariantFiltering("price.greaterThanOrEqual=" + DEFAULT_PRICE, "price.greaterThanOrEqual=" + UPDATED_PRICE);
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price is less than or equal to
        defaultProductVariantFiltering("price.lessThanOrEqual=" + DEFAULT_PRICE, "price.lessThanOrEqual=" + SMALLER_PRICE);
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price is less than
        defaultProductVariantFiltering("price.lessThan=" + UPDATED_PRICE, "price.lessThan=" + DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void getAllProductVariantsByPriceIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where price is greater than
        defaultProductVariantFiltering("price.greaterThan=" + SMALLER_PRICE, "price.greaterThan=" + DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock equals to
        defaultProductVariantFiltering("stock.equals=" + DEFAULT_STOCK, "stock.equals=" + UPDATED_STOCK);
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock in
        defaultProductVariantFiltering("stock.in=" + DEFAULT_STOCK + "," + UPDATED_STOCK, "stock.in=" + UPDATED_STOCK);
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock is not null
        defaultProductVariantFiltering("stock.specified=true", "stock.specified=false");
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock is greater than or equal to
        defaultProductVariantFiltering("stock.greaterThanOrEqual=" + DEFAULT_STOCK, "stock.greaterThanOrEqual=" + UPDATED_STOCK);
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock is less than or equal to
        defaultProductVariantFiltering("stock.lessThanOrEqual=" + DEFAULT_STOCK, "stock.lessThanOrEqual=" + SMALLER_STOCK);
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock is less than
        defaultProductVariantFiltering("stock.lessThan=" + UPDATED_STOCK, "stock.lessThan=" + DEFAULT_STOCK);
    }

    @Test
    @Transactional
    void getAllProductVariantsByStockIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        // Get all the productVariantList where stock is greater than
        defaultProductVariantFiltering("stock.greaterThan=" + SMALLER_STOCK, "stock.greaterThan=" + DEFAULT_STOCK);
    }

    @Test
    @Transactional
    void getAllProductVariantsByProductIsEqualToSomething() throws Exception {
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            productVariantRepository.saveAndFlush(productVariant);
            product = ProductResourceIT.createEntity();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        em.persist(product);
        em.flush();
        productVariant.setProduct(product);
        productVariantRepository.saveAndFlush(productVariant);
        Long productId = product.getId();
        // Get all the productVariantList where product equals to productId
        defaultProductVariantShouldBeFound("productId.equals=" + productId);

        // Get all the productVariantList where product equals to (productId + 1)
        defaultProductVariantShouldNotBeFound("productId.equals=" + (productId + 1));
    }

    private void defaultProductVariantFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultProductVariantShouldBeFound(shouldBeFound);
        defaultProductVariantShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProductVariantShouldBeFound(String filter) throws Exception {
        restProductVariantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productVariant.getId().intValue())))
            .andExpect(jsonPath("$.[*].sku").value(hasItem(DEFAULT_SKU)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK)));

        // Check, that the count call also returns 1
        restProductVariantMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProductVariantShouldNotBeFound(String filter) throws Exception {
        restProductVariantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProductVariantMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProductVariant() throws Exception {
        // Get the productVariant
        restProductVariantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductVariant() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productVariant
        ProductVariant updatedProductVariant = productVariantRepository.findById(productVariant.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProductVariant are not directly saved in db
        em.detach(updatedProductVariant);
        updatedProductVariant.sku(UPDATED_SKU).price(UPDATED_PRICE).stock(UPDATED_STOCK);
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(updatedProductVariant);

        restProductVariantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productVariantDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productVariantDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductVariantToMatchAllProperties(updatedProductVariant);
    }

    @Test
    @Transactional
    void putNonExistingProductVariant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productVariant.setId(longCount.incrementAndGet());

        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductVariantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productVariantDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productVariantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductVariant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productVariant.setId(longCount.incrementAndGet());

        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductVariantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productVariantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductVariant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productVariant.setId(longCount.incrementAndGet());

        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductVariantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productVariantDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductVariantWithPatch() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productVariant using partial update
        ProductVariant partialUpdatedProductVariant = new ProductVariant();
        partialUpdatedProductVariant.setId(productVariant.getId());

        partialUpdatedProductVariant.price(UPDATED_PRICE).stock(UPDATED_STOCK);

        restProductVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductVariant.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductVariant))
            )
            .andExpect(status().isOk());

        // Validate the ProductVariant in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductVariantUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProductVariant, productVariant),
            getPersistedProductVariant(productVariant)
        );
    }

    @Test
    @Transactional
    void fullUpdateProductVariantWithPatch() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productVariant using partial update
        ProductVariant partialUpdatedProductVariant = new ProductVariant();
        partialUpdatedProductVariant.setId(productVariant.getId());

        partialUpdatedProductVariant.sku(UPDATED_SKU).price(UPDATED_PRICE).stock(UPDATED_STOCK);

        restProductVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductVariant.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductVariant))
            )
            .andExpect(status().isOk());

        // Validate the ProductVariant in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductVariantUpdatableFieldsEquals(partialUpdatedProductVariant, getPersistedProductVariant(partialUpdatedProductVariant));
    }

    @Test
    @Transactional
    void patchNonExistingProductVariant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productVariant.setId(longCount.incrementAndGet());

        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productVariantDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productVariantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductVariant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productVariant.setId(longCount.incrementAndGet());

        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductVariantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productVariantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductVariant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productVariant.setId(longCount.incrementAndGet());

        // Create the ProductVariant
        ProductVariantDTO productVariantDTO = productVariantMapper.toDto(productVariant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductVariantMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productVariantDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductVariant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductVariant() throws Exception {
        // Initialize the database
        insertedProductVariant = productVariantRepository.saveAndFlush(productVariant);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productVariant
        restProductVariantMockMvc
            .perform(delete(ENTITY_API_URL_ID, productVariant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return productVariantRepository.count();
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

    protected ProductVariant getPersistedProductVariant(ProductVariant productVariant) {
        return productVariantRepository.findById(productVariant.getId()).orElseThrow();
    }

    protected void assertPersistedProductVariantToMatchAllProperties(ProductVariant expectedProductVariant) {
        assertProductVariantAllPropertiesEquals(expectedProductVariant, getPersistedProductVariant(expectedProductVariant));
    }

    protected void assertPersistedProductVariantToMatchUpdatableProperties(ProductVariant expectedProductVariant) {
        assertProductVariantAllUpdatablePropertiesEquals(expectedProductVariant, getPersistedProductVariant(expectedProductVariant));
    }
}
