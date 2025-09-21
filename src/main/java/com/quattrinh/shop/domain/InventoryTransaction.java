package com.quattrinh.shop.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.quattrinh.shop.domain.enumeration.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @NotNull
    @Min(1)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Size(max = 1000)
    @Column(name = "note", length = 1000)
    private String note;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    @JsonIgnoreProperties(value = { "product" }, allowSetters = true)
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = true)
    @JsonIgnoreProperties(value = { "orderItems", "payment" }, allowSetters = true)
    private ShopOrder order;

    public Long getId() {
        return id;
    }

    public InventoryTransaction id(Long id) {
        this.id = id;
        return this;
    }

    public TransactionType getType() {
        return type;
    }

    public InventoryTransaction type(TransactionType type) {
        this.type = type;
        return this;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public InventoryTransaction quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public String getNote() {
        return note;
    }

    public InventoryTransaction note(String note) {
        this.note = note;
        return this;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public InventoryTransaction createdAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public ProductVariant getVariant() {
        return variant;
    }

    public InventoryTransaction variant(ProductVariant variant) {
        this.variant = variant;
        return this;
    }

    public ShopOrder getOrder() {
        return order;
    }

    public InventoryTransaction order(ShopOrder order) {
        this.order = order;
        return this;
    }
}
