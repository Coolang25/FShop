package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Cart;
import com.quattrinh.shop.domain.CartItem;
import com.quattrinh.shop.domain.OrderItem;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.domain.enumeration.OrderStatus;
import com.quattrinh.shop.repository.CartItemRepository;
import com.quattrinh.shop.repository.CartRepository;
import com.quattrinh.shop.repository.ProductVariantRepository;
import com.quattrinh.shop.repository.ShopOrderRepository;
import com.quattrinh.shop.repository.UserRepository;
import com.quattrinh.shop.service.dto.OrderItemDTO;
import com.quattrinh.shop.service.dto.PaymentDTO;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import com.quattrinh.shop.service.mapper.OrderItemMapper;
import com.quattrinh.shop.service.mapper.ShopOrderMapper;
import java.math.BigDecimal;
import java.time.Instant;
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
 * Service Implementation for managing {@link ShopOrder}.
 */
@Service
@Transactional
public class ShopOrderService {

    private final Logger log = LoggerFactory.getLogger(ShopOrderService.class);

    private final ShopOrderRepository shopOrderRepository;
    private final UserRepository userRepository;
    private final ShopOrderMapper shopOrderMapper;
    private final OrderItemMapper orderItemMapper;
    private final PaymentService paymentService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    public ShopOrderService(
        ShopOrderRepository shopOrderRepository,
        UserRepository userRepository,
        ShopOrderMapper shopOrderMapper,
        OrderItemMapper orderItemMapper,
        PaymentService paymentService,
        CartRepository cartRepository,
        CartItemRepository cartItemRepository,
        ProductVariantRepository productVariantRepository
    ) {
        this.shopOrderRepository = shopOrderRepository;
        this.userRepository = userRepository;
        this.shopOrderMapper = shopOrderMapper;
        this.orderItemMapper = orderItemMapper;
        this.paymentService = paymentService;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
    }

    /**
     * Save a shopOrder.
     *
     * @param shopOrderDTO the entity to save.
     * @return the persisted entity.
     */
    public ShopOrderDTO save(ShopOrderDTO shopOrderDTO) {
        log.debug("Request to save ShopOrder : {}", shopOrderDTO);
        ShopOrder shopOrder = shopOrderMapper.toEntity(shopOrderDTO);
        shopOrder = shopOrderRepository.save(shopOrder);
        return shopOrderMapper.toDto(shopOrder);
    }

    /**
     * Update a shopOrder.
     *
     * @param shopOrderDTO the entity to save.
     * @return the persisted entity.
     */
    public ShopOrderDTO update(ShopOrderDTO shopOrderDTO) {
        log.debug("Request to update ShopOrder : {}", shopOrderDTO);
        OrderStatus previousStatus = null;
        if (shopOrderDTO.getId() != null) {
            previousStatus = shopOrderRepository.findById(shopOrderDTO.getId()).map(ShopOrder::getStatus).orElse(null);
        }
        ShopOrder shopOrder = shopOrderMapper.toEntity(shopOrderDTO);
        shopOrder = shopOrderRepository.save(shopOrder);
        handleOrderCompletionTransition(previousStatus, shopOrder);
        return shopOrderMapper.toDto(shopOrder);
    }

    /**
     * Partially update a shopOrder.
     *
     * @param shopOrderDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ShopOrderDTO> partialUpdate(ShopOrderDTO shopOrderDTO) {
        log.debug("Request to partially update ShopOrder : {}", shopOrderDTO);

        return shopOrderRepository
            .findById(shopOrderDTO.getId())
            .map(existingShopOrder -> {
                OrderStatus previousStatus = existingShopOrder.getStatus();
                shopOrderMapper.partialUpdate(existingShopOrder, shopOrderDTO);
                ShopOrder saved = shopOrderRepository.save(existingShopOrder);
                handleOrderCompletionTransition(previousStatus, saved);
                return shopOrderMapper.toDto(saved);
            });
    }

    public ShopOrderDTO updateStatus(Long id, OrderStatus status) {
        ShopOrder order = shopOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        ShopOrder saved = shopOrderRepository.save(order);
        handleOrderCompletionTransition(previousStatus, saved);
        return shopOrderMapper.toDto(saved);
    }

    /**
     * Get all the shopOrders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShopOrderDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ShopOrders");
        return shopOrderRepository.findAll(pageable).map(shopOrderMapper::toDto);
    }

    /**
     * Get all the shopOrders with eager relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShopOrderDTO> findAllWithEagerRelationships(Pageable pageable) {
        log.debug("Request to get all ShopOrders with eager relationships");
        return shopOrderRepository.findAllWithEagerRelationships(pageable).map(this::toDtoWithOrderItems);
    }

    /**
     * Get all shopOrders for admin with eager relationships.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ShopOrderDTO> findAllForAdmin() {
        log.debug("Request to get all ShopOrders for admin");
        return shopOrderRepository.findAllWithEagerRelationships().stream().map(this::toDtoWithOrderItems).collect(Collectors.toList());
    }

    /**
     * Get one shopOrder by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ShopOrderDTO> findOne(Long id) {
        log.debug("Request to get ShopOrder : {}", id);
        return shopOrderRepository.findById(id).map(shopOrderMapper::toDto);
    }

    /**
     * Delete the shopOrder by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ShopOrder : {}", id);
        shopOrderRepository.deleteById(id);
    }

    /**
     * Create a new order from checkout data.
     *
     * @param userId the user ID.
     * @param totalAmount the total amount.
     * @param shippingAddress the shipping address.
     * @return the created order.
     */
    public ShopOrderDTO createOrder(Long userId, BigDecimal totalAmount, String shippingAddress) {
        log.debug("Request to create order for user: {}, total: {}", userId, totalAmount);

        // Get user
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Create new order
        ShopOrder order = new ShopOrder();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotal(totalAmount);
        order.setShippingAddress(shippingAddress);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        // Save order
        ShopOrder savedOrder = shopOrderRepository.save(order);
        log.debug("Created order with ID: {}", savedOrder.getId());

        return shopOrderMapper.toDto(savedOrder);
    }

    /**
     * Get orders by user ID.
     *
     * @param userId the user ID.
     * @param pageable the pagination information.
     * @return the list of orders.
     */
    @Transactional(readOnly = true)
    public Page<ShopOrderDTO> findByUserId(Long userId, Pageable pageable) {
        log.debug("Request to get orders for user: {}", userId);
        return shopOrderRepository.findByUserIdWithEagerRelationshipsOrderByCreatedAtDesc(userId, pageable).map(this::toDtoWithOrderItems);
    }

    /**
     * Get orders by user ID (without pagination).
     *
     * @param userId the user ID.
     * @return the list of orders.
     */
    @Transactional(readOnly = true)
    public List<ShopOrderDTO> findByUserId(Long userId) {
        log.debug("Request to get orders for user: {}", userId);
        return shopOrderRepository
            .findByUserIdWithEagerRelationshipsOrderByCreatedAtDesc(userId, Pageable.unpaged())
            .getContent()
            .stream()
            .map(this::toDtoWithOrderItems)
            .collect(Collectors.toList());
    }

    /**
     * Get one shopOrder by id with order items.
     *
     * @param id the id of the entity.
     * @return the entity with order items.
     */
    @Transactional(readOnly = true)
    public Optional<ShopOrderDTO> findOneWithOrderItems(Long id) {
        log.debug("Request to get ShopOrder with items: {}", id);
        return shopOrderRepository.findOneWithEagerRelationships(id).map(this::toDtoWithOrderItems);
    }

    /**
     * Create order from checkout request.
     *
     * @param checkoutRequest the checkout request.
     * @return the created order.
     */
    @Transactional
    public ShopOrderDTO createOrderFromCheckout(com.quattrinh.shop.web.rest.ShopOrderResource.CheckoutRequest checkoutRequest) {
        log.debug("Request to create order from checkout: {}", checkoutRequest);

        // Get user
        User user = userRepository.findById(checkoutRequest.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        // Create new order
        ShopOrder order = new ShopOrder();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotal(checkoutRequest.getTotal());
        order.setShippingAddress(checkoutRequest.getShippingAddress());
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        // Save order
        ShopOrder savedOrder = shopOrderRepository.save(order);
        log.debug("Created order from checkout with ID: {}", savedOrder.getId());

        // Get user's cart and selected cart items only
        Optional<Cart> cart = cartRepository.findByUserId(checkoutRequest.getUserId());
        if (cart.isPresent() && checkoutRequest.getSelectedItemIds() != null && !checkoutRequest.getSelectedItemIds().isEmpty()) {
            List<CartItem> allCartItems = cartItemRepository.findByCartId(cart.get().getId());

            // Filter only selected items
            List<CartItem> selectedCartItems = allCartItems
                .stream()
                .filter(cartItem -> checkoutRequest.getSelectedItemIds().contains(cartItem.getId()))
                .collect(java.util.stream.Collectors.toList());

            log.debug(
                "Found {} selected cart items out of {} total for user: {}",
                selectedCartItems.size(),
                allCartItems.size(),
                checkoutRequest.getUserId()
            );

            // Create order items from selected cart items only
            for (CartItem cartItem : selectedCartItems) {
                ProductVariant variant = productVariantRepository
                    .findById(cartItem.getVariant().getId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));

                int available = getAvailableQuantity(variant);
                if (available < cartItem.getQuantity()) {
                    throw new RuntimeException("Not enough available stock for variant: " + variant.getId());
                }

                reserveVariant(variant, cartItem.getQuantity());

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setVariant(variant);
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(cartItem.getPrice());

                // Add to order
                savedOrder.addOrderItem(orderItem);
            }

            // Save order with items
            savedOrder = shopOrderRepository.save(savedOrder);
            log.debug("Created {} order items for order: {}", selectedCartItems.size(), savedOrder.getId());

            // Delete only selected cart items
            cartItemRepository.deleteAll(selectedCartItems);
            log.debug("Deleted {} selected cart items for user: {}", selectedCartItems.size(), checkoutRequest.getUserId());
        }

        // Create payment record
        PaymentDTO payment = paymentService.createPaymentForOrder(
            savedOrder.getId(),
            checkoutRequest.getPaymentMethod(),
            checkoutRequest.getTotal()
        );
        log.debug("Created payment with ID: {} for order: {}", payment.getId(), savedOrder.getId());

        return shopOrderMapper.toDto(savedOrder);
    }

    private int getAvailableQuantity(ProductVariant variant) {
        if (variant == null) {
            return 0;
        }
        int stock = variant.getStock() != null ? variant.getStock() : 0;
        int reserved = variant.getReserved() != null ? variant.getReserved() : 0;
        return Math.max(0, stock - reserved);
    }

    private void reserveVariant(ProductVariant variant, int quantity) {
        if (variant == null || quantity <= 0) {
            return;
        }
        int reserved = variant.getReserved() != null ? variant.getReserved() : 0;
        variant.setReserved(reserved + quantity);
        productVariantRepository.save(variant);
    }

    private void handleOrderCompletionTransition(OrderStatus previousStatus, ShopOrder updatedOrder) {
        if (updatedOrder == null) {
            return;
        }
        OrderStatus newStatus = updatedOrder.getStatus();
        if (newStatus == OrderStatus.COMPLETED && previousStatus != OrderStatus.COMPLETED) {
            ShopOrder orderWithItems = shopOrderRepository.findOneWithEagerRelationships(updatedOrder.getId()).orElse(updatedOrder);
            finalizeOrderItemsStock(orderWithItems);
        }
    }

    private void finalizeOrderItemsStock(ShopOrder order) {
        if (order == null || order.getOrderItems() == null) {
            return;
        }

        for (OrderItem orderItem : order.getOrderItems()) {
            ProductVariant variant = orderItem.getVariant();
            if (variant == null) {
                continue;
            }

            ProductVariant managedVariant = productVariantRepository
                .findById(variant.getId())
                .orElseThrow(() -> new RuntimeException("Product variant not found during finalization"));

            int stock = managedVariant.getStock() != null ? managedVariant.getStock() : 0;
            int reserved = managedVariant.getReserved() != null ? managedVariant.getReserved() : 0;
            int quantity = orderItem.getQuantity() != null ? orderItem.getQuantity() : 0;

            managedVariant.setStock(Math.max(0, stock - quantity));
            managedVariant.setReserved(Math.max(0, reserved - quantity));
            productVariantRepository.save(managedVariant);
        }
    }

    /**
     * Convert ShopOrder to DTO with order items and payment.
     *
     * @param shopOrder the shop order entity.
     * @return the DTO with order items and payment.
     */
    private ShopOrderDTO toDtoWithOrderItems(ShopOrder shopOrder) {
        ShopOrderDTO dto = shopOrderMapper.toDto(shopOrder);

        // Manually map order items to avoid circular dependency
        if (shopOrder.getOrderItems() != null) {
            List<OrderItemDTO> orderItemDTOs = shopOrder.getOrderItems().stream().map(orderItemMapper::toDto).collect(Collectors.toList());
            dto.setOrderItems(orderItemDTOs);
        }

        // Get payment for this order
        Optional<PaymentDTO> payment = paymentService.findByOrderId(shopOrder.getId());
        payment.ifPresent(dto::setPayment);

        return dto;
    }
}
