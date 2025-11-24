package com.quattrinh.shop.service.criteria;

import com.quattrinh.shop.domain.enumeration.TransactionType;
import java.io.Serializable;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.quattrinh.shop.domain.InventoryTransaction} entity. This class is used
 * in {@link com.quattrinh.shop.web.rest.InventoryTransactionResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /inventory-transactions?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InventoryTransactionCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private TransactionTypeFilter type;

    private IntegerFilter quantity;

    private StringFilter note;

    private InstantFilter createdAt;

    private LongFilter variantId;

    private LongFilter orderId;

    private Boolean distinct;

    public InventoryTransactionCriteria() {}

    public InventoryTransactionCriteria(InventoryTransactionCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.type = other.type == null ? null : other.type.copy();
        this.quantity = other.quantity == null ? null : other.quantity.copy();
        this.note = other.note == null ? null : other.note.copy();
        this.createdAt = other.createdAt == null ? null : other.createdAt.copy();
        this.variantId = other.variantId == null ? null : other.variantId.copy();
        this.orderId = other.orderId == null ? null : other.orderId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public InventoryTransactionCriteria copy() {
        return new InventoryTransactionCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public TransactionTypeFilter getType() {
        return type;
    }

    public TransactionTypeFilter type() {
        if (type == null) {
            type = new TransactionTypeFilter();
        }
        return type;
    }

    public void setType(TransactionTypeFilter type) {
        this.type = type;
    }

    public IntegerFilter getQuantity() {
        return quantity;
    }

    public IntegerFilter quantity() {
        if (quantity == null) {
            quantity = new IntegerFilter();
        }
        return quantity;
    }

    public void setQuantity(IntegerFilter quantity) {
        this.quantity = quantity;
    }

    public StringFilter getNote() {
        return note;
    }

    public StringFilter note() {
        if (note == null) {
            note = new StringFilter();
        }
        return note;
    }

    public void setNote(StringFilter note) {
        this.note = note;
    }

    public InstantFilter getCreatedAt() {
        return createdAt;
    }

    public InstantFilter createdAt() {
        if (createdAt == null) {
            createdAt = new InstantFilter();
        }
        return createdAt;
    }

    public void setCreatedAt(InstantFilter createdAt) {
        this.createdAt = createdAt;
    }

    public LongFilter getVariantId() {
        return variantId;
    }

    public LongFilter variantId() {
        if (variantId == null) {
            variantId = new LongFilter();
        }
        return variantId;
    }

    public void setVariantId(LongFilter variantId) {
        this.variantId = variantId;
    }

    public LongFilter getOrderId() {
        return orderId;
    }

    public LongFilter orderId() {
        if (orderId == null) {
            orderId = new LongFilter();
        }
        return orderId;
    }

    public void setOrderId(LongFilter orderId) {
        this.orderId = orderId;
    }

    public Boolean getDistinct() {
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
        final InventoryTransactionCriteria that = (InventoryTransactionCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(type, that.type) &&
            Objects.equals(quantity, that.quantity) &&
            Objects.equals(note, that.note) &&
            Objects.equals(createdAt, that.createdAt) &&
            Objects.equals(variantId, that.variantId) &&
            Objects.equals(orderId, that.orderId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, type, quantity, note, createdAt, variantId, orderId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InventoryTransactionCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (type != null ? "type=" + type + ", " : "") +
            (quantity != null ? "quantity=" + quantity + ", " : "") +
            (note != null ? "note=" + note + ", " : "") +
            (createdAt != null ? "createdAt=" + createdAt + ", " : "") +
            (variantId != null ? "variantId=" + variantId + ", " : "") +
            (orderId != null ? "orderId=" + orderId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
