package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Payment;
import com.quattrinh.shop.repository.PaymentRepository;
import com.quattrinh.shop.repository.ShopOrderRepository;
import com.quattrinh.shop.service.dto.PaymentDTO;
import com.quattrinh.shop.service.mapper.PaymentMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Payment}.
 */
@Service
@Transactional
public class PaymentService {

    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final ShopOrderRepository shopOrderRepository;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper, ShopOrderRepository shopOrderRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.shopOrderRepository = shopOrderRepository;
    }

    /**
     * Save a payment.
     *
     * @param paymentDTO the entity to save.
     * @return the persisted entity.
     */
    public PaymentDTO save(PaymentDTO paymentDTO) {
        log.debug("Request to save Payment : {}", paymentDTO);
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment = paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    /**
     * Update a payment.
     *
     * @param paymentDTO the entity to save.
     * @return the persisted entity.
     */
    public PaymentDTO update(PaymentDTO paymentDTO) {
        log.debug("Request to update Payment : {}", paymentDTO);
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment = paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    /**
     * Partially update a payment.
     *
     * @param paymentDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PaymentDTO> partialUpdate(PaymentDTO paymentDTO) {
        log.debug("Request to partially update Payment : {}", paymentDTO);

        return paymentRepository
            .findById(paymentDTO.getId())
            .map(existingPayment -> {
                paymentMapper.partialUpdate(existingPayment, paymentDTO);

                return existingPayment;
            })
            .map(paymentRepository::save)
            .map(paymentMapper::toDto);
    }

    /**
     * Get one payment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PaymentDTO> findOne(Long id) {
        log.debug("Request to get Payment : {}", id);
        return paymentRepository.findById(id).map(paymentMapper::toDto);
    }

    /**
     * Delete the payment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Payment : {}", id);
        paymentRepository.deleteById(id);
    }

    /**
     * Create payment for an order.
     *
     * @param orderId the order ID.
     * @param paymentMethod the payment method.
     * @param amount the payment amount.
     * @return the created payment.
     */
    public PaymentDTO createPaymentForOrder(Long orderId, String paymentMethod, java.math.BigDecimal amount) {
        log.debug("Request to create payment for order: {}, method: {}, amount: {}", orderId, paymentMethod, amount);

        // Get order
        com.quattrinh.shop.domain.ShopOrder order = shopOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        // Create payment
        com.quattrinh.shop.domain.Payment payment = new com.quattrinh.shop.domain.Payment();
        payment.setOrder(order);
        payment.setAmount(amount);
        payment.setMethod(com.quattrinh.shop.domain.enumeration.PaymentMethod.CASH_ON_DELIVERY);
        payment.setStatus(com.quattrinh.shop.domain.enumeration.PaymentStatus.PENDING);

        // Save payment
        com.quattrinh.shop.domain.Payment savedPayment = paymentRepository.save(payment);
        log.debug("Created payment with ID: {}", savedPayment.getId());

        return paymentMapper.toDto(savedPayment);
    }

    /**
     * Get payment by order ID.
     *
     * @param orderId the order ID.
     * @return the payment if found.
     */
    @Transactional(readOnly = true)
    public Optional<PaymentDTO> findByOrderId(Long orderId) {
        log.debug("Request to get payment for order: {}", orderId);
        return paymentRepository.findByOrderId(orderId).map(paymentMapper::toDto);
    }
}
