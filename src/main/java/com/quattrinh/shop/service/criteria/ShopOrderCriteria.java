package com.quattrinh.shop.service.criteria;

import com.quattrinh.shop.domain.enumeration.OrderStatus;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.quattrinh.shop.domain.ShopOrder} entity. This class is used
 * in {@link com.quattrinh.shop.web.rest.ShopOrderResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /shop-orders?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ShopOrderCriteria implements Serializable, Criteria {

    /**
     * Class for filtering OrderStatus
     */
    public static class OrderStatusFilter extends Filter<OrderStatus> {

        public OrderStatusFilter() {}

        public OrderStatusFilter(OrderStatusFilter filter) {
            super(filter);
        }

        @Override
        public OrderStatusFilter copy() {
            return new OrderStatusFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private OrderStatusFilter status;

    private BigDecimalFilter total;

    private StringFilter shippingAddress;

    private InstantFilter createdAt;

    private InstantFilter updatedAt;

    private LongFilter userId;

    private LongFilter paymentId;

    private Boolean distinct;

    public ShopOrderCriteria() {}

    public ShopOrderCriteria(ShopOrderCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.status = other.optionalStatus().map(OrderStatusFilter::copy).orElse(null);
        this.total = other.optionalTotal().map(BigDecimalFilter::copy).orElse(null);
        this.shippingAddress = other.optionalShippingAddress().map(StringFilter::copy).orElse(null);
        this.createdAt = other.optionalCreatedAt().map(InstantFilter::copy).orElse(null);
        this.updatedAt = other.optionalUpdatedAt().map(InstantFilter::copy).orElse(null);
        this.userId = other.optionalUserId().map(LongFilter::copy).orElse(null);
        this.paymentId = other.optionalPaymentId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ShopOrderCriteria copy() {
        return new ShopOrderCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public OrderStatusFilter getStatus() {
        return status;
    }

    public Optional<OrderStatusFilter> optionalStatus() {
        return Optional.ofNullable(status);
    }

    public OrderStatusFilter status() {
        if (status == null) {
            setStatus(new OrderStatusFilter());
        }
        return status;
    }

    public void setStatus(OrderStatusFilter status) {
        this.status = status;
    }

    public BigDecimalFilter getTotal() {
        return total;
    }

    public Optional<BigDecimalFilter> optionalTotal() {
        return Optional.ofNullable(total);
    }

    public BigDecimalFilter total() {
        if (total == null) {
            setTotal(new BigDecimalFilter());
        }
        return total;
    }

    public void setTotal(BigDecimalFilter total) {
        this.total = total;
    }

    public StringFilter getShippingAddress() {
        return shippingAddress;
    }

    public Optional<StringFilter> optionalShippingAddress() {
        return Optional.ofNullable(shippingAddress);
    }

    public StringFilter shippingAddress() {
        if (shippingAddress == null) {
            setShippingAddress(new StringFilter());
        }
        return shippingAddress;
    }

    public void setShippingAddress(StringFilter shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public InstantFilter getCreatedAt() {
        return createdAt;
    }

    public Optional<InstantFilter> optionalCreatedAt() {
        return Optional.ofNullable(createdAt);
    }

    public InstantFilter createdAt() {
        if (createdAt == null) {
            setCreatedAt(new InstantFilter());
        }
        return createdAt;
    }

    public void setCreatedAt(InstantFilter createdAt) {
        this.createdAt = createdAt;
    }

    public InstantFilter getUpdatedAt() {
        return updatedAt;
    }

    public Optional<InstantFilter> optionalUpdatedAt() {
        return Optional.ofNullable(updatedAt);
    }

    public InstantFilter updatedAt() {
        if (updatedAt == null) {
            setUpdatedAt(new InstantFilter());
        }
        return updatedAt;
    }

    public void setUpdatedAt(InstantFilter updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public Optional<LongFilter> optionalUserId() {
        return Optional.ofNullable(userId);
    }

    public LongFilter userId() {
        if (userId == null) {
            setUserId(new LongFilter());
        }
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getPaymentId() {
        return paymentId;
    }

    public Optional<LongFilter> optionalPaymentId() {
        return Optional.ofNullable(paymentId);
    }

    public LongFilter paymentId() {
        if (paymentId == null) {
            setPaymentId(new LongFilter());
        }
        return paymentId;
    }

    public void setPaymentId(LongFilter paymentId) {
        this.paymentId = paymentId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ShopOrderCriteria that = (ShopOrderCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(status, that.status) &&
            Objects.equals(total, that.total) &&
            Objects.equals(shippingAddress, that.shippingAddress) &&
            Objects.equals(createdAt, that.createdAt) &&
            Objects.equals(updatedAt, that.updatedAt) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(paymentId, that.paymentId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status, total, shippingAddress, createdAt, updatedAt, userId, paymentId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShopOrderCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalStatus().map(f -> "status=" + f + ", ").orElse("") +
            optionalTotal().map(f -> "total=" + f + ", ").orElse("") +
            optionalShippingAddress().map(f -> "shippingAddress=" + f + ", ").orElse("") +
            optionalCreatedAt().map(f -> "createdAt=" + f + ", ").orElse("") +
            optionalUpdatedAt().map(f -> "updatedAt=" + f + ", ").orElse("") +
            optionalUserId().map(f -> "userId=" + f + ", ").orElse("") +
            optionalPaymentId().map(f -> "paymentId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
