package com.quattrinh.shop.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.quattrinh.shop.domain.ProductImage} entity. This class is used
 * in {@link com.quattrinh.shop.web.rest.ProductImageResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /product-images?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductImageCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter url;

    private BooleanFilter isMain;

    private LongFilter productId;

    private Boolean distinct;

    public ProductImageCriteria() {}

    public ProductImageCriteria(ProductImageCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.url = other.optionalUrl().map(StringFilter::copy).orElse(null);
        this.isMain = other.optionalIsMain().map(BooleanFilter::copy).orElse(null);
        this.productId = other.optionalProductId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ProductImageCriteria copy() {
        return new ProductImageCriteria(this);
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

    public StringFilter getUrl() {
        return url;
    }

    public Optional<StringFilter> optionalUrl() {
        return Optional.ofNullable(url);
    }

    public StringFilter url() {
        if (url == null) {
            setUrl(new StringFilter());
        }
        return url;
    }

    public void setUrl(StringFilter url) {
        this.url = url;
    }

    public BooleanFilter getIsMain() {
        return isMain;
    }

    public Optional<BooleanFilter> optionalIsMain() {
        return Optional.ofNullable(isMain);
    }

    public BooleanFilter isMain() {
        if (isMain == null) {
            setIsMain(new BooleanFilter());
        }
        return isMain;
    }

    public void setIsMain(BooleanFilter isMain) {
        this.isMain = isMain;
    }

    public LongFilter getProductId() {
        return productId;
    }

    public Optional<LongFilter> optionalProductId() {
        return Optional.ofNullable(productId);
    }

    public LongFilter productId() {
        if (productId == null) {
            setProductId(new LongFilter());
        }
        return productId;
    }

    public void setProductId(LongFilter productId) {
        this.productId = productId;
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
        final ProductImageCriteria that = (ProductImageCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(url, that.url) &&
            Objects.equals(isMain, that.isMain) &&
            Objects.equals(productId, that.productId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, url, isMain, productId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductImageCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalUrl().map(f -> "url=" + f + ", ").orElse("") +
            optionalIsMain().map(f -> "isMain=" + f + ", ").orElse("") +
            optionalProductId().map(f -> "productId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
