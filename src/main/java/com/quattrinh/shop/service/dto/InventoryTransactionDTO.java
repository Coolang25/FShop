package com.quattrinh.shop.service.dto;

import com.quattrinh.shop.domain.enumeration.TransactionType;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.InventoryTransaction} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InventoryTransactionDTO implements Serializable {

    private Long id;

    private TransactionType type;

    private Integer quantity;

    private String note;

    private Instant createdAt;

    private ProductVariantDTO variant;

    private ShopOrderDTO order;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InventoryTransactionDTO id(Long id) {
        this.id = id;
        return this;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public InventoryTransactionDTO type(TransactionType type) {
        this.type = type;
        return this;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public InventoryTransactionDTO quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public InventoryTransactionDTO note(String note) {
        this.note = note;
        return this;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public InventoryTransactionDTO createdAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public ProductVariantDTO getVariant() {
        return variant;
    }

    public void setVariant(ProductVariantDTO variant) {
        this.variant = variant;
    }

    public InventoryTransactionDTO variant(ProductVariantDTO variant) {
        this.variant = variant;
        return this;
    }

    public ShopOrderDTO getOrder() {
        return order;
    }

    public void setOrder(ShopOrderDTO order) {
        this.order = order;
    }

    public InventoryTransactionDTO order(ShopOrderDTO order) {
        this.order = order;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InventoryTransactionDTO)) {
            return false;
        }

        InventoryTransactionDTO inventoryTransactionDTO = (InventoryTransactionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, inventoryTransactionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InventoryTransactionDTO{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", quantity=" + getQuantity() +
            ", note='" + getNote() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", variant=" + getVariant() +
            ", order=" + getOrder() +
            "}";
    }
}
