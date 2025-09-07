package com.quattrinh.shop.service.dto;

import com.quattrinh.shop.domain.enumeration.OrderStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.ShopOrder} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ShopOrderDTO implements Serializable {

    private Long id;

    @NotNull
    private OrderStatus status;

    @NotNull
    private BigDecimal total;

    @NotNull
    @Size(max = 1000)
    private String shippingAddress;

    private Instant createdAt;

    private Instant updatedAt;

    private UserDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ShopOrderDTO)) {
            return false;
        }

        ShopOrderDTO shopOrderDTO = (ShopOrderDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, shopOrderDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShopOrderDTO{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", total=" + getTotal() +
            ", shippingAddress='" + getShippingAddress() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
