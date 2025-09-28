package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A simple DTO for the {@link com.quattrinh.shop.domain.ProductAttributeValue} entity.
 * Used in product variants to avoid circular dependency.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SimpleProductAttributeValueDTO implements Serializable {

    private Long id;

    @Size(max = 255)
    private String value;

    private Long attributeId;

    private SimpleProductAttributeDTO attribute;

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

    public Long getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(Long attributeId) {
        this.attributeId = attributeId;
    }

    public SimpleProductAttributeDTO getAttribute() {
        return attribute;
    }

    public void setAttribute(SimpleProductAttributeDTO attribute) {
        this.attribute = attribute;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SimpleProductAttributeValueDTO)) {
            return false;
        }

        SimpleProductAttributeValueDTO simpleProductAttributeValueDTO = (SimpleProductAttributeValueDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, simpleProductAttributeValueDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SimpleProductAttributeValueDTO{" +
            "id=" + getId() +
            ", value='" + getValue() + "'" +
            ", attributeId=" + getAttributeId() +
            ", attribute=" + getAttribute() +
            "}";
    }
}
