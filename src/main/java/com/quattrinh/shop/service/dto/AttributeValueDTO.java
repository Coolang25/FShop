package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A simplified DTO for ProductAttributeValue.
 */
public class AttributeValueDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String value;

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
        if (!(o instanceof AttributeValueDTO)) {
            return false;
        }

        AttributeValueDTO that = (AttributeValueDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return "AttributeValueDTO{" + "id=" + getId() + ", value='" + getValue() + "'" + "}";
    }
}
