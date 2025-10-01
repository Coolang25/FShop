package com.quattrinh.shop.web.rest;

import com.quattrinh.shop.repository.CartRepository;
import com.quattrinh.shop.service.CartQueryService;
import com.quattrinh.shop.service.CartService;
import com.quattrinh.shop.service.criteria.CartCriteria;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.quattrinh.shop.domain.Cart}.
 */
@RestController
@RequestMapping("/api/carts")
public class CartResource {

    private static final Logger LOG = LoggerFactory.getLogger(CartResource.class);

    private static final String ENTITY_NAME = "cart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CartService cartService;

    private final CartRepository cartRepository;

    private final CartQueryService cartQueryService;

    public CartResource(CartService cartService, CartRepository cartRepository, CartQueryService cartQueryService) {
        this.cartService = cartService;
        this.cartRepository = cartRepository;
        this.cartQueryService = cartQueryService;
    }

    /**
     * {@code POST  /carts} : Create a new cart.
     *
     * @param cartDTO the cartDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cartDTO, or with status {@code 400 (Bad Request)} if the cart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CartDTO> createCart(@RequestBody CartDTO cartDTO) throws URISyntaxException {
        LOG.debug("REST request to save Cart : {}", cartDTO);
        if (cartDTO.getId() != null) {
            throw new BadRequestAlertException("A new cart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        cartDTO = cartService.save(cartDTO);
        return ResponseEntity.created(new URI("/api/carts/" + cartDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, cartDTO.getId().toString()))
            .body(cartDTO);
    }

    /**
     * {@code PUT  /carts/:id} : Updates an existing cart.
     *
     * @param id the id of the cartDTO to save.
     * @param cartDTO the cartDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cartDTO,
     * or with status {@code 400 (Bad Request)} if the cartDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cartDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CartDTO> updateCart(@PathVariable(value = "id", required = false) final Long id, @RequestBody CartDTO cartDTO)
        throws URISyntaxException {
        LOG.debug("REST request to update Cart : {}, {}", id, cartDTO);
        if (cartDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cartDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        cartDTO = cartService.update(cartDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cartDTO.getId().toString()))
            .body(cartDTO);
    }

    /**
     * {@code PATCH  /carts/:id} : Partial updates given fields of an existing cart, field will ignore if it is null
     *
     * @param id the id of the cartDTO to save.
     * @param cartDTO the cartDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cartDTO,
     * or with status {@code 400 (Bad Request)} if the cartDTO is not valid,
     * or with status {@code 404 (Not Found)} if the cartDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the cartDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CartDTO> partialUpdateCart(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CartDTO cartDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Cart partially : {}, {}", id, cartDTO);
        if (cartDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cartDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CartDTO> result = cartService.partialUpdate(cartDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cartDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /carts} : get all the carts.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of carts in body.
     */
    @GetMapping("")
    public ResponseEntity<List<CartDTO>> getAllCarts(CartCriteria criteria) {
        LOG.debug("REST request to get Carts by criteria: {}", criteria);

        List<CartDTO> entityList = cartQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
     * {@code GET  /carts/count} : count all the carts.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countCarts(CartCriteria criteria) {
        LOG.debug("REST request to count Carts by criteria: {}", criteria);
        return ResponseEntity.ok().body(cartQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /carts/:id} : get the "id" cart.
     *
     * @param id the id of the cartDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cartDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CartDTO> getCart(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Cart : {}", id);
        Optional<CartDTO> cartDTO = cartService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cartDTO);
    }

    /**
     * {@code GET  /carts/user/{userId} : get cart by user ID.
     *
     * @param userId the user ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cartDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDTO> getCartByUserId(@PathVariable Long userId) {
        LOG.debug("REST request to get Cart by user ID: {}", userId);

        Optional<CartDTO> cartDTO = cartService.findByUserId(userId);
        return cartDTO.map(cart -> ResponseEntity.ok().body(cart)).orElse(ResponseEntity.notFound().build());
    }

    /**
     * {@code POST  /carts/add-item} : Add item to user's cart.
     *
     * @param userId the user ID.
     * @param variantId the product variant ID.
     * @param quantity the quantity to add.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cartDTO.
     */
    @PostMapping("/add-item")
    public ResponseEntity<CartDTO> addItemToCart(@RequestParam Long userId, @RequestParam Long variantId, @RequestParam Integer quantity) {
        LOG.debug("REST request to add item to cart: userId={}, variantId={}, quantity={}", userId, variantId, quantity);

        try {
            CartDTO cartDTO = cartService.addItemToCart(userId, variantId, quantity);
            return ResponseEntity.ok().body(cartDTO);
        } catch (Exception e) {
            LOG.error("Error adding item to cart", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * {@code GET  /carts/count/user/{userId}} : Get cart item count for user.
     *
     * @param userId the user ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the count.
     */
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Integer> getCartItemCount(@PathVariable Long userId) {
        LOG.debug("REST request to get cart item count for user: {}", userId);

        try {
            Integer count = cartService.getCartItemCount(userId);
            return ResponseEntity.ok().body(count);
        } catch (Exception e) {
            LOG.error("Error getting cart item count", e);
            return ResponseEntity.ok().body(0);
        }
    }

    /**
     * {@code GET  /carts/test/user/{userId}} : Test endpoint to check if user exists.
     *
     * @param userId the user ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the test response.
     */
    @GetMapping("/test/user/{userId}")
    public ResponseEntity<Map<String, Object>> testCartEndpoint(@PathVariable Long userId) {
        LOG.debug("REST request to test cart endpoint for user: {}", userId);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("message", "Cart API is working");
        response.put("timestamp", java.time.Instant.now());

        // Test if cart exists
        try {
            Optional<CartDTO> cart = cartService.getCartWithItems(userId);
            response.put("cartExists", cart.isPresent());
            if (cart.isPresent()) {
                response.put("cartId", cart.get().getId());
                response.put("itemsCount", cart.get().getItems() != null ? cart.get().getItems().size() : 0);
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }

        return ResponseEntity.ok().body(response);
    }

    /**
     * {@code GET  /carts/with-items/user/{userId}} : Get cart with items for user.
     *
     * @param userId the user ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cart with items.
     */
    @GetMapping("/with-items/user/{userId}")
    public ResponseEntity<CartDTO> getCartWithItems(@PathVariable Long userId) {
        LOG.debug("REST request to get cart with items for user: {}", userId);

        try {
            Optional<CartDTO> cartDTO = cartService.getCartWithItems(userId);
            if (cartDTO.isPresent()) {
                LOG.debug("Found cart with {} items", cartDTO.get().getItems() != null ? cartDTO.get().getItems().size() : 0);
                return ResponseEntity.ok().body(cartDTO.get());
            } else {
                LOG.debug("No cart found for user: {}", userId);
                // Return empty cart instead of 404
                CartDTO emptyCart = new CartDTO();
                emptyCart.setId(null); // Set to null when no cart exists
                emptyCart.setItems(new java.util.ArrayList<>());
                return ResponseEntity.ok().body(emptyCart);
            }
        } catch (Exception e) {
            LOG.error("Error getting cart with items", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * {@code DELETE  /carts/:id} : delete the "id" cart.
     *
     * @param id the id of the cartDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Cart : {}", id);
        cartService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
