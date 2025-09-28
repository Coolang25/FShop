package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.ProductVariant} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductVariantDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String sku;

    @NotNull
    private BigDecimal price;

    private Integer stock = 0;

    private String imageUrl;

    private Boolean isActive = true;

    private ProductDTO product;

    private Set<SimpleProductAttributeValueDTO> attributeValues = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }

    public Set<SimpleProductAttributeValueDTO> getAttributeValues() {
        return attributeValues;
    }

    public void setAttributeValues(Set<SimpleProductAttributeValueDTO> attributeValues) {
        this.attributeValues = attributeValues;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductVariantDTO)) {
            return false;
        }

        ProductVariantDTO productVariantDTO = (ProductVariantDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productVariantDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductVariantDTO{" +
            "id=" + getId() +
            ", sku='" + getSku() + "'" +
            ", price=" + getPrice() +
            ", stock=" + getStock() +
            ", imageUrl='" + getImageUrl() + "'" +
            ", isActive=" + getIsActive() +
            ", product=" + getProduct() +
            "}";
    }
}
