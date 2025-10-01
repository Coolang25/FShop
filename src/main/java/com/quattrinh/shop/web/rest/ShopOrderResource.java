package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.ShopOrderRepository;
import com.quattrinh.shop.service.ShopOrderService;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
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
 * REST controller for managing {@link com.quattrinh.shop.domain.ShopOrder}.
 */
@RestController
@RequestMapping("/api/shop-orders")
public class ShopOrderResource {

    private final Logger log = LoggerFactory.getLogger(ShopOrderResource.class);

    private static final String ENTITY_NAME = "shopOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopOrderService shopOrderService;

    private final ShopOrderRepository shopOrderRepository;

    public ShopOrderResource(ShopOrderService shopOrderService, ShopOrderRepository shopOrderRepository) {
        this.shopOrderService = shopOrderService;
        this.shopOrderRepository = shopOrderRepository;
    }

    /**
     * {@code POST  /shop-orders} : Create a new shopOrder.
     *
     * @param shopOrderDTO the shopOrderDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shopOrderDTO, or with status {@code 400 (Bad Request)} if the shopOrder has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ShopOrderDTO> createShopOrder(@Valid @RequestBody ShopOrderDTO shopOrderDTO) throws URISyntaxException {
        log.debug("REST request to save ShopOrder : {}", shopOrderDTO);
        if (shopOrderDTO.getId() != null) {
            throw new BadRequestAlertException("A new shopOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShopOrderDTO result = shopOrderService.save(shopOrderDTO);
        return ResponseEntity.created(new URI("/api/shop-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shop-orders/:id} : Updates an existing shopOrder.
     *
     * @param id the id of the shopOrderDTO to save.
     * @param shopOrderDTO the shopOrderDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopOrderDTO,
     * or with status {@code 400 (Bad Request)} if the shopOrderDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shopOrderDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ShopOrderDTO> updateShopOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ShopOrderDTO shopOrderDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ShopOrder : {}, {}", id, shopOrderDTO);
        if (shopOrderDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopOrderDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ShopOrderDTO result = shopOrderService.update(shopOrderDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopOrderDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shop-orders/:id} : Partial updates given fields of an existing shopOrder, field will ignore if it is null
     *
     * @param id the id of the shopOrderDTO to save.
     * @param shopOrderDTO the shopOrderDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopOrderDTO,
     * or with status {@code 400 (Bad Request)} if the shopOrderDTO is not valid,
     * or with status {@code 404 (Not Found)} if the shopOrderDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the shopOrderDTO couldn't be updated.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ShopOrderDTO> partialUpdateShopOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ShopOrderDTO shopOrderDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ShopOrder partially : {}, {}", id, shopOrderDTO);
        if (shopOrderDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shopOrderDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shopOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ShopOrderDTO> result = shopOrderService.partialUpdate(shopOrderDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopOrderDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /shop-orders} : get all the shopOrders.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopOrders in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ShopOrderDTO>> getAllShopOrders(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of ShopOrders");
        Page<ShopOrderDTO> page;
        if (eagerload) {
            page = shopOrderService.findAllWithEagerRelationships(pageable);
        } else {
            page = shopOrderService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shop-orders/admin} : get all shopOrders for admin with eager relationships.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopOrders in body.
     */
    @GetMapping("/admin")
    public ResponseEntity<List<ShopOrderDTO>> getAllShopOrdersForAdmin() {
        log.debug("REST request to get all ShopOrders for admin");
        List<ShopOrderDTO> orders = shopOrderService.findAllForAdmin();
        return ResponseEntity.ok().body(orders);
    }

    /**
     * {@code GET  /shop-orders/:id} : get the "id" shopOrder.
     *
     * @param id the id of the shopOrderDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shopOrderDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ShopOrderDTO> getShopOrder(@PathVariable Long id) {
        log.debug("REST request to get ShopOrder : {}", id);
        Optional<ShopOrderDTO> shopOrderDTO = shopOrderService.findOneWithOrderItems(id);
        return ResponseUtil.wrapOrNotFound(shopOrderDTO);
    }

    /**
     * {@code DELETE  /shop-orders/:id} : delete the "id" shopOrder.
     *
     * @param id the id of the shopOrderDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (No Content)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShopOrder(@PathVariable Long id) {
        log.debug("REST request to delete ShopOrder : {}", id);
        shopOrderService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /shop-orders/user/{userId} : get all orders for a specific user.
     *
     * @param userId the user ID to get orders for.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopOrders in body.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShopOrderDTO>> getShopOrdersByUser(@PathVariable Long userId) {
        log.debug("REST request to get ShopOrders for user : {}", userId);
        List<ShopOrderDTO> orders = shopOrderService.findByUserId(userId);
        return ResponseEntity.ok().body(orders);
    }

    /**
     * {@code POST  /shop-orders/checkout} : Create a new order from checkout.
     *
     * @param checkoutRequest the checkout request data.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shopOrderDTO.
     */
    @PostMapping("/checkout")
    public ResponseEntity<ShopOrderDTO> checkout(@RequestBody CheckoutRequest checkoutRequest) {
        log.debug("REST request to checkout : {}", checkoutRequest);
        try {
            ShopOrderDTO result = shopOrderService.createOrderFromCheckout(checkoutRequest);
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            log.error("Error during checkout", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Checkout request DTO
     */
    public static class CheckoutRequest {

        private Long userId;
        private java.math.BigDecimal total;
        private String shippingAddress;
        private String paymentMethod;
        private String paymentStatus;
        private java.util.List<Long> selectedItemIds;

        // Getters and setters
        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public java.math.BigDecimal getTotal() {
            return total;
        }

        public void setTotal(java.math.BigDecimal total) {
            this.total = total;
        }

        public String getShippingAddress() {
            return shippingAddress;
        }

        public void setShippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public java.util.List<Long> getSelectedItemIds() {
            return selectedItemIds;
        }

        public void setSelectedItemIds(java.util.List<Long> selectedItemIds) {
            this.selectedItemIds = selectedItemIds;
        }
    }
}
