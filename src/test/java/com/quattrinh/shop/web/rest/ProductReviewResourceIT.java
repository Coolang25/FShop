package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.ProductReviewAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductReview;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.repository.ProductReviewRepository;
import com.quattrinh.shop.repository.UserRepository;
import com.quattrinh.shop.service.ProductReviewService;
import com.quattrinh.shop.service.dto.ProductReviewDTO;
import com.quattrinh.shop.service.mapper.ProductReviewMapper;
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
 * Integration tests for the {@link ProductReviewResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProductReviewResourceIT {

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;
    private static final Integer SMALLER_RATING = 1 - 1;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/product-reviews";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private ProductReviewRepository productReviewRepositoryMock;

    @Autowired
    private ProductReviewMapper productReviewMapper;

    @Mock
    private ProductReviewService productReviewServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductReviewMockMvc;

    private ProductReview productReview;

    private ProductReview insertedProductReview;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductReview createEntity() {
        return new ProductReview()
            .rating(DEFAULT_RATING)
            .comment(DEFAULT_COMMENT)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductReview createUpdatedEntity() {
        return new ProductReview()
            .rating(UPDATED_RATING)
            .comment(UPDATED_COMMENT)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
    }

    @BeforeEach
    public void initTest() {
        productReview = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProductReview != null) {
            productReviewRepository.delete(insertedProductReview);
            insertedProductReview = null;
        }
    }

    @Test
    @Transactional
    void createProductReview() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);
        var returnedProductReviewDTO = om.readValue(
            restProductReviewMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productReviewDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductReviewDTO.class
        );

        // Validate the ProductReview in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedProductReview = productReviewMapper.toEntity(returnedProductReviewDTO);
        assertProductReviewUpdatableFieldsEquals(returnedProductReview, getPersistedProductReview(returnedProductReview));

        insertedProductReview = returnedProductReview;
    }

    @Test
    @Transactional
    void createProductReviewWithExistingId() throws Exception {
        // Create the ProductReview with an existing ID
        productReview.setId(1L);
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductReviewMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productReviewDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRatingIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productReview.setRating(null);

        // Create the ProductReview, which fails.
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        restProductReviewMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productReviewDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductReviews() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList
        restProductReviewMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productReview.getId().intValue())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProductReviewsWithEagerRelationshipsIsEnabled() throws Exception {
        when(productReviewServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProductReviewMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(productReviewServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProductReviewsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(productReviewServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProductReviewMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(productReviewRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProductReview() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get the productReview
        restProductReviewMockMvc
            .perform(get(ENTITY_API_URL_ID, productReview.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productReview.getId().intValue()))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getProductReviewsByIdFiltering() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        Long id = productReview.getId();

        defaultProductReviewFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultProductReviewFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultProductReviewFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating equals to
        defaultProductReviewFiltering("rating.equals=" + DEFAULT_RATING, "rating.equals=" + UPDATED_RATING);
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating in
        defaultProductReviewFiltering("rating.in=" + DEFAULT_RATING + "," + UPDATED_RATING, "rating.in=" + UPDATED_RATING);
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating is not null
        defaultProductReviewFiltering("rating.specified=true", "rating.specified=false");
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating is greater than or equal to
        defaultProductReviewFiltering("rating.greaterThanOrEqual=" + DEFAULT_RATING, "rating.greaterThanOrEqual=" + (DEFAULT_RATING + 1));
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating is less than or equal to
        defaultProductReviewFiltering("rating.lessThanOrEqual=" + DEFAULT_RATING, "rating.lessThanOrEqual=" + SMALLER_RATING);
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating is less than
        defaultProductReviewFiltering("rating.lessThan=" + (DEFAULT_RATING + 1), "rating.lessThan=" + DEFAULT_RATING);
    }

    @Test
    @Transactional
    void getAllProductReviewsByRatingIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where rating is greater than
        defaultProductReviewFiltering("rating.greaterThan=" + SMALLER_RATING, "rating.greaterThan=" + DEFAULT_RATING);
    }

    @Test
    @Transactional
    void getAllProductReviewsByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where createdAt equals to
        defaultProductReviewFiltering("createdAt.equals=" + DEFAULT_CREATED_AT, "createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllProductReviewsByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where createdAt in
        defaultProductReviewFiltering(
            "createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT,
            "createdAt.in=" + UPDATED_CREATED_AT
        );
    }

    @Test
    @Transactional
    void getAllProductReviewsByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where createdAt is not null
        defaultProductReviewFiltering("createdAt.specified=true", "createdAt.specified=false");
    }

    @Test
    @Transactional
    void getAllProductReviewsByUpdatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where updatedAt equals to
        defaultProductReviewFiltering("updatedAt.equals=" + DEFAULT_UPDATED_AT, "updatedAt.equals=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllProductReviewsByUpdatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where updatedAt in
        defaultProductReviewFiltering(
            "updatedAt.in=" + DEFAULT_UPDATED_AT + "," + UPDATED_UPDATED_AT,
            "updatedAt.in=" + UPDATED_UPDATED_AT
        );
    }

    @Test
    @Transactional
    void getAllProductReviewsByUpdatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        // Get all the productReviewList where updatedAt is not null
        defaultProductReviewFiltering("updatedAt.specified=true", "updatedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllProductReviewsByProductIsEqualToSomething() throws Exception {
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            productReviewRepository.saveAndFlush(productReview);
            product = ProductResourceIT.createEntity();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        em.persist(product);
        em.flush();
        productReview.setProduct(product);
        productReviewRepository.saveAndFlush(productReview);
        Long productId = product.getId();
        // Get all the productReviewList where product equals to productId
        defaultProductReviewShouldBeFound("productId.equals=" + productId);

        // Get all the productReviewList where product equals to (productId + 1)
        defaultProductReviewShouldNotBeFound("productId.equals=" + (productId + 1));
    }

    @Test
    @Transactional
    void getAllProductReviewsByUserIsEqualToSomething() throws Exception {
        User user;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            productReviewRepository.saveAndFlush(productReview);
            user = UserResourceIT.createEntity();
        } else {
            user = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(user);
        em.flush();
        productReview.setUser(user);
        productReviewRepository.saveAndFlush(productReview);
        Long userId = user.getId();
        // Get all the productReviewList where user equals to userId
        defaultProductReviewShouldBeFound("userId.equals=" + userId);

        // Get all the productReviewList where user equals to (userId + 1)
        defaultProductReviewShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    private void defaultProductReviewFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultProductReviewShouldBeFound(shouldBeFound);
        defaultProductReviewShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultProductReviewShouldBeFound(String filter) throws Exception {
        restProductReviewMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productReview.getId().intValue())))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));

        // Check, that the count call also returns 1
        restProductReviewMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultProductReviewShouldNotBeFound(String filter) throws Exception {
        restProductReviewMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restProductReviewMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingProductReview() throws Exception {
        // Get the productReview
        restProductReviewMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductReview() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productReview
        ProductReview updatedProductReview = productReviewRepository.findById(productReview.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProductReview are not directly saved in db
        em.detach(updatedProductReview);
        updatedProductReview.rating(UPDATED_RATING).comment(UPDATED_COMMENT).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(updatedProductReview);

        restProductReviewMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productReviewDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productReviewDTO))
            )
            .andExpect(status().isOk());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductReviewToMatchAllProperties(updatedProductReview);
    }

    @Test
    @Transactional
    void putNonExistingProductReview() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productReview.setId(longCount.incrementAndGet());

        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductReviewMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productReviewDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productReviewDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductReview() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productReview.setId(longCount.incrementAndGet());

        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductReviewMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productReviewDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductReview() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productReview.setId(longCount.incrementAndGet());

        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductReviewMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productReviewDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductReviewWithPatch() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productReview using partial update
        ProductReview partialUpdatedProductReview = new ProductReview();
        partialUpdatedProductReview.setId(productReview.getId());

        partialUpdatedProductReview.rating(UPDATED_RATING);

        restProductReviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductReview.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductReview))
            )
            .andExpect(status().isOk());

        // Validate the ProductReview in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductReviewUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProductReview, productReview),
            getPersistedProductReview(productReview)
        );
    }

    @Test
    @Transactional
    void fullUpdateProductReviewWithPatch() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productReview using partial update
        ProductReview partialUpdatedProductReview = new ProductReview();
        partialUpdatedProductReview.setId(productReview.getId());

        partialUpdatedProductReview
            .rating(UPDATED_RATING)
            .comment(UPDATED_COMMENT)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restProductReviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductReview.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductReview))
            )
            .andExpect(status().isOk());

        // Validate the ProductReview in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductReviewUpdatableFieldsEquals(partialUpdatedProductReview, getPersistedProductReview(partialUpdatedProductReview));
    }

    @Test
    @Transactional
    void patchNonExistingProductReview() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productReview.setId(longCount.incrementAndGet());

        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductReviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productReviewDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productReviewDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductReview() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productReview.setId(longCount.incrementAndGet());

        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductReviewMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productReviewDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductReview() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productReview.setId(longCount.incrementAndGet());

        // Create the ProductReview
        ProductReviewDTO productReviewDTO = productReviewMapper.toDto(productReview);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductReviewMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productReviewDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductReview in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductReview() throws Exception {
        // Initialize the database
        insertedProductReview = productReviewRepository.saveAndFlush(productReview);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productReview
        restProductReviewMockMvc
            .perform(delete(ENTITY_API_URL_ID, productReview.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return productReviewRepository.count();
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

    protected ProductReview getPersistedProductReview(ProductReview productReview) {
        return productReviewRepository.findById(productReview.getId()).orElseThrow();
    }

    protected void assertPersistedProductReviewToMatchAllProperties(ProductReview expectedProductReview) {
        assertProductReviewAllPropertiesEquals(expectedProductReview, getPersistedProductReview(expectedProductReview));
    }

    protected void assertPersistedProductReviewToMatchUpdatableProperties(ProductReview expectedProductReview) {
        assertProductReviewAllUpdatablePropertiesEquals(expectedProductReview, getPersistedProductReview(expectedProductReview));
    }
}
