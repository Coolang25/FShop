package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A DTO for creating/updating ProductAttributeValue with simplified structure.
 */
public class ProductAttributeValueRequestDTO implements Serializable {

    @NotNull
    @Size(max = 100)
    private String value;

    @NotNull
    private Long attributeId;

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

    @Override
    public String toString() {
        return ("ProductAttributeValueRequestDTO{" + ", value='" + getValue() + "'" + ", attributeId=" + getAttributeId() + "}");
    }
}
