package com.quattrinh.shop.web.rest;

import static com.quattrinh.shop.domain.ShopOrderAsserts.*;
import static com.quattrinh.shop.web.rest.TestUtil.createUpdateProxyForBean;
import static com.quattrinh.shop.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quattrinh.shop.IntegrationTest;
import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.domain.enumeration.OrderStatus;
import com.quattrinh.shop.repository.ShopOrderRepository;
import com.quattrinh.shop.repository.UserRepository;
import com.quattrinh.shop.service.ShopOrderService;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import com.quattrinh.shop.service.mapper.ShopOrderMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link ShopOrderResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ShopOrderResourceIT {

    private static final OrderStatus DEFAULT_STATUS = OrderStatus.PENDING;
    private static final OrderStatus UPDATED_STATUS = OrderStatus.PAID;

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);
    private static final BigDecimal SMALLER_TOTAL = new BigDecimal(1 - 1);

    private static final String DEFAULT_SHIPPING_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_SHIPPING_ADDRESS = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/shop-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ShopOrderRepository shopOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private ShopOrderRepository shopOrderRepositoryMock;

    @Autowired
    private ShopOrderMapper shopOrderMapper;

    @Mock
    private ShopOrderService shopOrderServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShopOrderMockMvc;

    private ShopOrder shopOrder;

    private ShopOrder insertedShopOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopOrder createEntity() {
        return new ShopOrder()
            .status(DEFAULT_STATUS)
            .total(DEFAULT_TOTAL)
            .shippingAddress(DEFAULT_SHIPPING_ADDRESS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShopOrder createUpdatedEntity() {
        return new ShopOrder()
            .status(UPDATED_STATUS)
            .total(UPDATED_TOTAL)
            .shippingAddress(UPDATED_SHIPPING_ADDRESS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
    }

    @BeforeEach
    public void initTest() {
        shopOrder = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedShopOrder != null) {
            shopOrderRepository.delete(insertedShopOrder);
            insertedShopOrder = null;
        }
    }

    @Test
    @Transactional
    void createShopOrder() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);
        var returnedShopOrderDTO = om.readValue(
            restShopOrderMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(shopOrderDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ShopOrderDTO.class
        );

        // Validate the ShopOrder in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedShopOrder = shopOrderMapper.toEntity(returnedShopOrderDTO);
        assertShopOrderUpdatableFieldsEquals(returnedShopOrder, getPersistedShopOrder(returnedShopOrder));

        insertedShopOrder = returnedShopOrder;
    }

    @Test
    @Transactional
    void createShopOrderWithExistingId() throws Exception {
        // Create the ShopOrder with an existing ID
        shopOrder.setId(1L);
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShopOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(shopOrderDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        shopOrder.setStatus(null);

        // Create the ShopOrder, which fails.
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        restShopOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(shopOrderDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTotalIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        shopOrder.setTotal(null);

        // Create the ShopOrder, which fails.
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        restShopOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(shopOrderDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkShippingAddressIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        shopOrder.setShippingAddress(null);

        // Create the ShopOrder, which fails.
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        restShopOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(shopOrderDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllShopOrders() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList
        restShopOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(sameNumber(DEFAULT_TOTAL))))
            .andExpect(jsonPath("$.[*].shippingAddress").value(hasItem(DEFAULT_SHIPPING_ADDRESS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllShopOrdersWithEagerRelationshipsIsEnabled() throws Exception {
        when(shopOrderServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restShopOrderMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(shopOrderServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllShopOrdersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(shopOrderServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restShopOrderMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(shopOrderRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getShopOrder() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get the shopOrder
        restShopOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, shopOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shopOrder.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.total").value(sameNumber(DEFAULT_TOTAL)))
            .andExpect(jsonPath("$.shippingAddress").value(DEFAULT_SHIPPING_ADDRESS))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getShopOrdersByIdFiltering() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        Long id = shopOrder.getId();

        defaultShopOrderFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultShopOrderFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultShopOrderFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllShopOrdersByStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where status equals to
        defaultShopOrderFiltering("status.equals=" + DEFAULT_STATUS, "status.equals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllShopOrdersByStatusIsInShouldWork() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where status in
        defaultShopOrderFiltering("status.in=" + DEFAULT_STATUS + "," + UPDATED_STATUS, "status.in=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllShopOrdersByStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where status is not null
        defaultShopOrderFiltering("status.specified=true", "status.specified=false");
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total equals to
        defaultShopOrderFiltering("total.equals=" + DEFAULT_TOTAL, "total.equals=" + UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsInShouldWork() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total in
        defaultShopOrderFiltering("total.in=" + DEFAULT_TOTAL + "," + UPDATED_TOTAL, "total.in=" + UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total is not null
        defaultShopOrderFiltering("total.specified=true", "total.specified=false");
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total is greater than or equal to
        defaultShopOrderFiltering("total.greaterThanOrEqual=" + DEFAULT_TOTAL, "total.greaterThanOrEqual=" + UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total is less than or equal to
        defaultShopOrderFiltering("total.lessThanOrEqual=" + DEFAULT_TOTAL, "total.lessThanOrEqual=" + SMALLER_TOTAL);
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total is less than
        defaultShopOrderFiltering("total.lessThan=" + UPDATED_TOTAL, "total.lessThan=" + DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void getAllShopOrdersByTotalIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where total is greater than
        defaultShopOrderFiltering("total.greaterThan=" + SMALLER_TOTAL, "total.greaterThan=" + DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void getAllShopOrdersByShippingAddressIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where shippingAddress equals to
        defaultShopOrderFiltering(
            "shippingAddress.equals=" + DEFAULT_SHIPPING_ADDRESS,
            "shippingAddress.equals=" + UPDATED_SHIPPING_ADDRESS
        );
    }

    @Test
    @Transactional
    void getAllShopOrdersByShippingAddressIsInShouldWork() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where shippingAddress in
        defaultShopOrderFiltering(
            "shippingAddress.in=" + DEFAULT_SHIPPING_ADDRESS + "," + UPDATED_SHIPPING_ADDRESS,
            "shippingAddress.in=" + UPDATED_SHIPPING_ADDRESS
        );
    }

    @Test
    @Transactional
    void getAllShopOrdersByShippingAddressIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where shippingAddress is not null
        defaultShopOrderFiltering("shippingAddress.specified=true", "shippingAddress.specified=false");
    }

    @Test
    @Transactional
    void getAllShopOrdersByShippingAddressContainsSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where shippingAddress contains
        defaultShopOrderFiltering(
            "shippingAddress.contains=" + DEFAULT_SHIPPING_ADDRESS,
            "shippingAddress.contains=" + UPDATED_SHIPPING_ADDRESS
        );
    }

    @Test
    @Transactional
    void getAllShopOrdersByShippingAddressNotContainsSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where shippingAddress does not contain
        defaultShopOrderFiltering(
            "shippingAddress.doesNotContain=" + UPDATED_SHIPPING_ADDRESS,
            "shippingAddress.doesNotContain=" + DEFAULT_SHIPPING_ADDRESS
        );
    }

    @Test
    @Transactional
    void getAllShopOrdersByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where createdAt equals to
        defaultShopOrderFiltering("createdAt.equals=" + DEFAULT_CREATED_AT, "createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllShopOrdersByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where createdAt in
        defaultShopOrderFiltering("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT, "createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllShopOrdersByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where createdAt is not null
        defaultShopOrderFiltering("createdAt.specified=true", "createdAt.specified=false");
    }

    @Test
    @Transactional
    void getAllShopOrdersByUpdatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where updatedAt equals to
        defaultShopOrderFiltering("updatedAt.equals=" + DEFAULT_UPDATED_AT, "updatedAt.equals=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllShopOrdersByUpdatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where updatedAt in
        defaultShopOrderFiltering("updatedAt.in=" + DEFAULT_UPDATED_AT + "," + UPDATED_UPDATED_AT, "updatedAt.in=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllShopOrdersByUpdatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        // Get all the shopOrderList where updatedAt is not null
        defaultShopOrderFiltering("updatedAt.specified=true", "updatedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllShopOrdersByUserIsEqualToSomething() throws Exception {
        User user;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            shopOrderRepository.saveAndFlush(shopOrder);
            user = UserResourceIT.createEntity();
        } else {
            user = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(user);
        em.flush();
        shopOrder.setUser(user);
        shopOrderRepository.saveAndFlush(shopOrder);
        Long userId = user.getId();
        // Get all the shopOrderList where user equals to userId
        defaultShopOrderShouldBeFound("userId.equals=" + userId);

        // Get all the shopOrderList where user equals to (userId + 1)
        defaultShopOrderShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    private void defaultShopOrderFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultShopOrderShouldBeFound(shouldBeFound);
        defaultShopOrderShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultShopOrderShouldBeFound(String filter) throws Exception {
        restShopOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(sameNumber(DEFAULT_TOTAL))))
            .andExpect(jsonPath("$.[*].shippingAddress").value(hasItem(DEFAULT_SHIPPING_ADDRESS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));

        // Check, that the count call also returns 1
        restShopOrderMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultShopOrderShouldNotBeFound(String filter) throws Exception {
        restShopOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restShopOrderMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingShopOrder() throws Exception {
        // Get the shopOrder
        restShopOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShopOrder() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the shopOrder
        ShopOrder updatedShopOrder = shopOrderRepository.findById(shopOrder.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedShopOrder are not directly saved in db
        em.detach(updatedShopOrder);
        updatedShopOrder
            .status(UPDATED_STATUS)
            .total(UPDATED_TOTAL)
            .shippingAddress(UPDATED_SHIPPING_ADDRESS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(updatedShopOrder);

        restShopOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shopOrderDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(shopOrderDTO))
            )
            .andExpect(status().isOk());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedShopOrderToMatchAllProperties(updatedShopOrder);
    }

    @Test
    @Transactional
    void putNonExistingShopOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        shopOrder.setId(longCount.incrementAndGet());

        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shopOrderDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(shopOrderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShopOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        shopOrder.setId(longCount.incrementAndGet());

        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(shopOrderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShopOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        shopOrder.setId(longCount.incrementAndGet());

        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(shopOrderDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShopOrderWithPatch() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the shopOrder using partial update
        ShopOrder partialUpdatedShopOrder = new ShopOrder();
        partialUpdatedShopOrder.setId(shopOrder.getId());

        partialUpdatedShopOrder.status(UPDATED_STATUS).total(UPDATED_TOTAL).updatedAt(UPDATED_UPDATED_AT);

        restShopOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedShopOrder))
            )
            .andExpect(status().isOk());

        // Validate the ShopOrder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertShopOrderUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedShopOrder, shopOrder),
            getPersistedShopOrder(shopOrder)
        );
    }

    @Test
    @Transactional
    void fullUpdateShopOrderWithPatch() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the shopOrder using partial update
        ShopOrder partialUpdatedShopOrder = new ShopOrder();
        partialUpdatedShopOrder.setId(shopOrder.getId());

        partialUpdatedShopOrder
            .status(UPDATED_STATUS)
            .total(UPDATED_TOTAL)
            .shippingAddress(UPDATED_SHIPPING_ADDRESS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restShopOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShopOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedShopOrder))
            )
            .andExpect(status().isOk());

        // Validate the ShopOrder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertShopOrderUpdatableFieldsEquals(partialUpdatedShopOrder, getPersistedShopOrder(partialUpdatedShopOrder));
    }

    @Test
    @Transactional
    void patchNonExistingShopOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        shopOrder.setId(longCount.incrementAndGet());

        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shopOrderDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(shopOrderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShopOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        shopOrder.setId(longCount.incrementAndGet());

        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(shopOrderDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShopOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        shopOrder.setId(longCount.incrementAndGet());

        // Create the ShopOrder
        ShopOrderDTO shopOrderDTO = shopOrderMapper.toDto(shopOrder);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopOrderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(shopOrderDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ShopOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShopOrder() throws Exception {
        // Initialize the database
        insertedShopOrder = shopOrderRepository.saveAndFlush(shopOrder);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the shopOrder
        restShopOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, shopOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return shopOrderRepository.count();
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

    protected ShopOrder getPersistedShopOrder(ShopOrder shopOrder) {
        return shopOrderRepository.findById(shopOrder.getId()).orElseThrow();
    }

    protected void assertPersistedShopOrderToMatchAllProperties(ShopOrder expectedShopOrder) {
        assertShopOrderAllPropertiesEquals(expectedShopOrder, getPersistedShopOrder(expectedShopOrder));
    }

    protected void assertPersistedShopOrderToMatchUpdatableProperties(ShopOrder expectedShopOrder) {
        assertShopOrderAllUpdatablePropertiesEquals(expectedShopOrder, getPersistedShopOrder(expectedShopOrder));
    }
}
