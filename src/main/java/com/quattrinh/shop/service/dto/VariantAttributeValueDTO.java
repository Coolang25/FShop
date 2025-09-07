package com.quattrinh.shop.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.VariantAttributeValue} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VariantAttributeValueDTO implements Serializable {

    private Long id;

    private ProductVariantDTO variant;

    private ProductAttributeValueDTO attributeValue;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductVariantDTO getVariant() {
        return variant;
    }

    public void setVariant(ProductVariantDTO variant) {
        this.variant = variant;
    }

    public ProductAttributeValueDTO getAttributeValue() {
        return attributeValue;
    }

    public void setAttributeValue(ProductAttributeValueDTO attributeValue) {
        this.attributeValue = attributeValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VariantAttributeValueDTO)) {
            return false;
        }

        VariantAttributeValueDTO variantAttributeValueDTO = (VariantAttributeValueDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, variantAttributeValueDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VariantAttributeValueDTO{" +
            "id=" + getId() +
            ", variant=" + getVariant() +
            ", attributeValue=" + getAttributeValue() +
            "}";
    }
}
