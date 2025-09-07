package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.ProductImage} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductImageDTO implements Serializable {

    private Long id;

    @NotNull
    private String url;

    private Boolean isMain;

    private ProductDTO product;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getIsMain() {
        return isMain;
    }

    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductImageDTO)) {
            return false;
        }

        ProductImageDTO productImageDTO = (ProductImageDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productImageDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductImageDTO{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            ", isMain='" + getIsMain() + "'" +
            ", product=" + getProduct() +
            "}";
    }
}
