package com.quattrinh.shop.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.quattrinh.shop.domain.VariantAttributeValue} entity. This class is used
 * in {@link com.quattrinh.shop.web.rest.VariantAttributeValueResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /variant-attribute-values?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VariantAttributeValueCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LongFilter variantId;

    private LongFilter attributeValueId;

    private Boolean distinct;

    public VariantAttributeValueCriteria() {}

    public VariantAttributeValueCriteria(VariantAttributeValueCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.variantId = other.optionalVariantId().map(LongFilter::copy).orElse(null);
        this.attributeValueId = other.optionalAttributeValueId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public VariantAttributeValueCriteria copy() {
        return new VariantAttributeValueCriteria(this);
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

    public LongFilter getVariantId() {
        return variantId;
    }

    public Optional<LongFilter> optionalVariantId() {
        return Optional.ofNullable(variantId);
    }

    public LongFilter variantId() {
        if (variantId == null) {
            setVariantId(new LongFilter());
        }
        return variantId;
    }

    public void setVariantId(LongFilter variantId) {
        this.variantId = variantId;
    }

    public LongFilter getAttributeValueId() {
        return attributeValueId;
    }

    public Optional<LongFilter> optionalAttributeValueId() {
        return Optional.ofNullable(attributeValueId);
    }

    public LongFilter attributeValueId() {
        if (attributeValueId == null) {
            setAttributeValueId(new LongFilter());
        }
        return attributeValueId;
    }

    public void setAttributeValueId(LongFilter attributeValueId) {
        this.attributeValueId = attributeValueId;
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
        final VariantAttributeValueCriteria that = (VariantAttributeValueCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(variantId, that.variantId) &&
            Objects.equals(attributeValueId, that.attributeValueId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, variantId, attributeValueId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VariantAttributeValueCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalVariantId().map(f -> "variantId=" + f + ", ").orElse("") +
            optionalAttributeValueId().map(f -> "attributeValueId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
