package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.CartAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.Cart;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.repository.CartRepository;
import com.quattrinh.shop.repository.UserRepository;
import com.quattrinh.shop.service.CartService;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.service.mapper.CartMapper;
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
 * Integration tests for the {@link CartResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CartResourceIT {

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/carts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private CartRepository cartRepositoryMock;

    @Autowired
    private CartMapper cartMapper;

    @Mock
    private CartService cartServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCartMockMvc;

    private Cart cart;

    private Cart insertedCart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cart createEntity() {
        return new Cart().createdAt(DEFAULT_CREATED_AT).updatedAt(DEFAULT_UPDATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cart createUpdatedEntity() {
        return new Cart().createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);
    }

    @BeforeEach
    public void initTest() {
        cart = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedCart != null) {
            cartRepository.delete(insertedCart);
            insertedCart = null;
        }
    }

    @Test
    @Transactional
    void createCart() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);
        var returnedCartDTO = om.readValue(
            restCartMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cartDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CartDTO.class
        );

        // Validate the Cart in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedCart = cartMapper.toEntity(returnedCartDTO);
        assertCartUpdatableFieldsEquals(returnedCart, getPersistedCart(returnedCart));

        insertedCart = returnedCart;
    }

    @Test
    @Transactional
    void createCartWithExistingId() throws Exception {
        // Create the Cart with an existing ID
        cart.setId(1L);
        CartDTO cartDTO = cartMapper.toDto(cart);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cartDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCarts() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList
        restCartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cart.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCartsWithEagerRelationshipsIsEnabled() throws Exception {
        when(cartServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCartMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(cartServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCartsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(cartServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCartMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(cartRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCart() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get the cart
        restCartMockMvc
            .perform(get(ENTITY_API_URL_ID, cart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cart.getId().intValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getCartsByIdFiltering() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        Long id = cart.getId();

        defaultCartFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultCartFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultCartFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllCartsByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList where createdAt equals to
        defaultCartFiltering("createdAt.equals=" + DEFAULT_CREATED_AT, "createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllCartsByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList where createdAt in
        defaultCartFiltering("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT, "createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllCartsByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList where createdAt is not null
        defaultCartFiltering("createdAt.specified=true", "createdAt.specified=false");
    }

    @Test
    @Transactional
    void getAllCartsByUpdatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList where updatedAt equals to
        defaultCartFiltering("updatedAt.equals=" + DEFAULT_UPDATED_AT, "updatedAt.equals=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllCartsByUpdatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList where updatedAt in
        defaultCartFiltering("updatedAt.in=" + DEFAULT_UPDATED_AT + "," + UPDATED_UPDATED_AT, "updatedAt.in=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllCartsByUpdatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        // Get all the cartList where updatedAt is not null
        defaultCartFiltering("updatedAt.specified=true", "updatedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllCartsByUserIsEqualToSomething() throws Exception {
        User user;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            cartRepository.saveAndFlush(cart);
            user = UserResourceIT.createEntity();
        } else {
            user = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(user);
        em.flush();
        cart.setUser(user);
        cartRepository.saveAndFlush(cart);
        Long userId = user.getId();
        // Get all the cartList where user equals to userId
        defaultCartShouldBeFound("userId.equals=" + userId);

        // Get all the cartList where user equals to (userId + 1)
        defaultCartShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    private void defaultCartFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultCartShouldBeFound(shouldBeFound);
        defaultCartShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultCartShouldBeFound(String filter) throws Exception {
        restCartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cart.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));

        // Check, that the count call also returns 1
        restCartMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultCartShouldNotBeFound(String filter) throws Exception {
        restCartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restCartMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingCart() throws Exception {
        // Get the cart
        restCartMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCart() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cart
        Cart updatedCart = cartRepository.findById(cart.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCart are not directly saved in db
        em.detach(updatedCart);
        updatedCart.createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);
        CartDTO cartDTO = cartMapper.toDto(updatedCart);

        restCartMockMvc
            .perform(put(ENTITY_API_URL_ID, cartDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cartDTO)))
            .andExpect(status().isOk());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCartToMatchAllProperties(updatedCart);
    }

    @Test
    @Transactional
    void putNonExistingCart() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cart.setId(longCount.incrementAndGet());

        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCartMockMvc
            .perform(put(ENTITY_API_URL_ID, cartDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cartDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCart() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cart.setId(longCount.incrementAndGet());

        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cartDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCart() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cart.setId(longCount.incrementAndGet());

        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCartMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cartDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCartWithPatch() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cart using partial update
        Cart partialUpdatedCart = new Cart();
        partialUpdatedCart.setId(cart.getId());

        restCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCart.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCart))
            )
            .andExpect(status().isOk());

        // Validate the Cart in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCartUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCart, cart), getPersistedCart(cart));
    }

    @Test
    @Transactional
    void fullUpdateCartWithPatch() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cart using partial update
        Cart partialUpdatedCart = new Cart();
        partialUpdatedCart.setId(cart.getId());

        partialUpdatedCart.createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCart.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCart))
            )
            .andExpect(status().isOk());

        // Validate the Cart in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCartUpdatableFieldsEquals(partialUpdatedCart, getPersistedCart(partialUpdatedCart));
    }

    @Test
    @Transactional
    void patchNonExistingCart() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cart.setId(longCount.incrementAndGet());

        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cartDTO.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cartDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCart() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cart.setId(longCount.incrementAndGet());

        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cartDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCart() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cart.setId(longCount.incrementAndGet());

        // Create the Cart
        CartDTO cartDTO = cartMapper.toDto(cart);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCartMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cartDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cart in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCart() throws Exception {
        // Initialize the database
        insertedCart = cartRepository.saveAndFlush(cart);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the cart
        restCartMockMvc
            .perform(delete(ENTITY_API_URL_ID, cart.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return cartRepository.count();
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

    protected Cart getPersistedCart(Cart cart) {
        return cartRepository.findById(cart.getId()).orElseThrow();
    }

    protected void assertPersistedCartToMatchAllProperties(Cart expectedCart) {
        assertCartAllPropertiesEquals(expectedCart, getPersistedCart(expectedCart));
    }

    protected void assertPersistedCartToMatchUpdatableProperties(Cart expectedCart) {
        assertCartAllUpdatablePropertiesEquals(expectedCart, getPersistedCart(expectedCart));
    }
}
