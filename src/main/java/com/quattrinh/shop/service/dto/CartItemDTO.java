package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.CartItem} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CartItemDTO implements Serializable {

    private Long id;

    @NotNull
    @Min(value = 1)
    private Integer quantity;

    @NotNull
    private BigDecimal price;

    private CartDTO cart;

    private ProductVariantDTO variant;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CartDTO getCart() {
        return cart;
    }

    public void setCart(CartDTO cart) {
        this.cart = cart;
    }

    public ProductVariantDTO getVariant() {
        return variant;
    }

    public void setVariant(ProductVariantDTO variant) {
        this.variant = variant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CartItemDTO)) {
            return false;
        }

        CartItemDTO cartItemDTO = (CartItemDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, cartItemDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CartItemDTO{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", price=" + getPrice() +
            ", cart=" + getCart() +
            ", variant=" + getVariant() +
            "}";
    }
}
