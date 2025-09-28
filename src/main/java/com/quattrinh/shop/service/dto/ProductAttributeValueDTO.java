package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.ProductAttributeValue} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductAttributeValueDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String value;

    private Long attributeId;

    private ProductAttributeDTO attribute;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductAttributeValueDTO)) {
            return false;
        }

        ProductAttributeValueDTO productAttributeValueDTO = (ProductAttributeValueDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productAttributeValueDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductAttributeValueDTO{" +
            "id=" + getId() +
            ", value='" + getValue() + "'" +
            ", attributeId=" + getAttributeId() +
            ", attribute=" + getAttribute() +
            "}";
    }

    public Long getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(Long attributeId) {
        this.attributeId = attributeId;
    }

    public ProductAttributeDTO getAttribute() {
        return attribute;
    }

    public void setAttribute(ProductAttributeDTO attribute) {
        this.attribute = attribute;
    }
}
