package com.quattrinh.shop.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.quattrinh.shop.domain.ProductAttributeValue} entity. This class is used
 * in {@link com.quattrinh.shop.web.rest.ProductAttributeValueResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /product-attribute-values?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductAttributeValueCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter value;

    private LongFilter attributeId;

    private Boolean distinct;

    public ProductAttributeValueCriteria() {}

    public ProductAttributeValueCriteria(ProductAttributeValueCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.value = other.optionalValue().map(StringFilter::copy).orElse(null);
        this.attributeId = other.optionalAttributeId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ProductAttributeValueCriteria copy() {
        return new ProductAttributeValueCriteria(this);
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

    public StringFilter getValue() {
        return value;
    }

    public Optional<StringFilter> optionalValue() {
        return Optional.ofNullable(value);
    }

    public StringFilter value() {
        if (value == null) {
            setValue(new StringFilter());
        }
        return value;
    }

    public void setValue(StringFilter value) {
        this.value = value;
    }

    public LongFilter getAttributeId() {
        return attributeId;
    }

    public Optional<LongFilter> optionalAttributeId() {
        return Optional.ofNullable(attributeId);
    }

    public LongFilter attributeId() {
        if (attributeId == null) {
            setAttributeId(new LongFilter());
        }
        return attributeId;
    }

    public void setAttributeId(LongFilter attributeId) {
        this.attributeId = attributeId;
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
        final ProductAttributeValueCriteria that = (ProductAttributeValueCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(value, that.value) &&
            Objects.equals(attributeId, that.attributeId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, value, attributeId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductAttributeValueCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalValue().map(f -> "value=" + f + ", ").orElse("") +
            optionalAttributeId().map(f -> "attributeId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
