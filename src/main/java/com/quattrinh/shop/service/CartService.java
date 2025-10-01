package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Cart;
import com.quattrinh.shop.domain.CartItem;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.repository.CartItemRepository;
import com.quattrinh.shop.repository.CartRepository;
import com.quattrinh.shop.repository.ProductVariantRepository;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.service.dto.CartItemDTO;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.mapper.CartMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.Cart}.
 */
@Service
@Transactional
public class CartService {

    private static final Logger LOG = LoggerFactory.getLogger(CartService.class);

    private final CartRepository cartRepository;

    private final CartMapper cartMapper;

    private final CartItemRepository cartItemRepository;

    private final ProductVariantRepository productVariantRepository;

    public CartService(
        CartRepository cartRepository,
        CartMapper cartMapper,
        CartItemRepository cartItemRepository,
        ProductVariantRepository productVariantRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartMapper = cartMapper;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
    }

    /**
     * Save a cart.
     *
     * @param cartDTO the entity to save.
     * @return the persisted entity.
     */
    public CartDTO save(CartDTO cartDTO) {
        LOG.debug("Request to save Cart : {}", cartDTO);
        Cart cart = cartMapper.toEntity(cartDTO);
        cart = cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    /**
     * Update a cart.
     *
     * @param cartDTO the entity to save.
     * @return the persisted entity.
     */
    public CartDTO update(CartDTO cartDTO) {
        LOG.debug("Request to update Cart : {}", cartDTO);
        Cart cart = cartMapper.toEntity(cartDTO);
        cart = cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    /**
     * Partially update a cart.
     *
     * @param cartDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CartDTO> partialUpdate(CartDTO cartDTO) {
        LOG.debug("Request to partially update Cart : {}", cartDTO);

        return cartRepository
            .findById(cartDTO.getId())
            .map(existingCart -> {
                cartMapper.partialUpdate(existingCart, cartDTO);

                return existingCart;
            })
            .map(cartRepository::save)
            .map(cartMapper::toDto);
    }

    /**
     * Get all the carts with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<CartDTO> findAllWithEagerRelationships(Pageable pageable) {
        return cartRepository.findAllWithEagerRelationships(pageable).map(cartMapper::toDto);
    }

    /**
     * Get one cart by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CartDTO> findOne(Long id) {
        LOG.debug("Request to get Cart : {}", id);
        return cartRepository.findOneWithEagerRelationships(id).map(cartMapper::toDto);
    }

    /**
     * Get cart by user ID.
     *
     * @param userId the user ID.
     * @return the cart DTO.
     */
    @Transactional(readOnly = true)
    public Optional<CartDTO> findByUserId(Long userId) {
        LOG.debug("Request to get Cart by user ID: {}", userId);
        return cartRepository.findByUserId(userId).map(cartMapper::toDto);
    }

    /**
     * Add item to user's cart.
     *
     * @param userId the user ID.
     * @param variantId the product variant ID.
     * @param quantity the quantity to add.
     * @return the updated cart DTO.
     */
    @Transactional
    public CartDTO addItemToCart(Long userId, Long variantId, Integer quantity) {
        LOG.debug("Request to add item to cart: userId={}, variantId={}, quantity={}", userId, variantId, quantity);

        // Get or create cart for user
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            // Create new cart
            cart = new Cart();
            User user = new User();
            user.setId(userId);
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variantId);

        if (existingItem.isPresent()) {
            // Update existing item quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setQuantity(quantity);

            // Get variant details
            ProductVariant variant = productVariantRepository
                .findById(variantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));
            newItem.setVariant(variant);
            newItem.setPrice(variant.getPrice());

            cartItemRepository.save(newItem);
        }

        return cartMapper.toDto(cart);
    }

    /**
     * Get cart item count for user (number of unique items, not total quantity).
     *
     * @param userId the user ID.
     * @return the number of unique items in cart.
     */
    @Transactional(readOnly = true)
    public Integer getCartItemCount(Long userId) {
        LOG.debug("Request to get cart item count for user: {}", userId);

        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            // Return count of unique items, not total quantity
            return cartItemRepository.findByCartId(cart.get().getId()).size();
        }
        return 0;
    }

    /**
     * Get cart with items for user.
     *
     * @param userId the user ID.
     * @return the cart DTO with items.
     */
    @Transactional(readOnly = true)
    public Optional<CartDTO> getCartWithItems(Long userId) {
        LOG.debug("Request to get cart with items for user: {}", userId);

        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            LOG.debug("Found cart for user: {}", userId);
            // Fetch cart with items using eager loading
            Cart cartWithItems = cartRepository.findOneWithEagerRelationships(cart.get().getId()).orElse(cart.get());
            LOG.debug(
                "Cart with items - ID: {}, Items count: {}",
                cartWithItems.getId(),
                cartWithItems.getItems() != null ? cartWithItems.getItems().size() : 0
            );

            CartDTO cartDTO = cartMapper.toDto(cartWithItems);

            // Manually map items to avoid circular dependency
            if (cartWithItems.getItems() != null) {
                List<CartItemDTO> itemDTOs = cartWithItems
                    .getItems()
                    .stream()
                    .map(item -> {
                        CartItemDTO itemDTO = new CartItemDTO();
                        itemDTO.setId(item.getId());
                        itemDTO.setQuantity(item.getQuantity());
                        itemDTO.setPrice(item.getPrice());

                        // Map variant
                        if (item.getVariant() != null) {
                            ProductVariantDTO variantDTO = new ProductVariantDTO();
                            variantDTO.setId(item.getVariant().getId());
                            variantDTO.setSku(item.getVariant().getSku());
                            variantDTO.setPrice(item.getVariant().getPrice());
                            variantDTO.setStock(item.getVariant().getStock());
                            variantDTO.setImageUrl(item.getVariant().getImageUrl());
                            variantDTO.setIsActive(item.getVariant().getIsActive());

                            // Map product
                            if (item.getVariant().getProduct() != null) {
                                ProductDTO productDTO = new ProductDTO();
                                productDTO.setId(item.getVariant().getProduct().getId());
                                productDTO.setName(item.getVariant().getProduct().getName());
                                variantDTO.setProduct(productDTO);
                            }

                            itemDTO.setVariant(variantDTO);
                        }

                        return itemDTO;
                    })
                    .collect(Collectors.toList());
                cartDTO.setItems(itemDTOs);
            }

            LOG.debug(
                "Mapped CartDTO - ID: {}, Items count: {}",
                cartDTO.getId(),
                cartDTO.getItems() != null ? cartDTO.getItems().size() : 0
            );

            return Optional.of(cartDTO);
        }
        LOG.debug("No cart found for user: {}", userId);
        return Optional.empty();
    }

    /**
     * Delete the cart by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Cart : {}", id);
        cartRepository.deleteById(id);
    }
}
