package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

/**
 * A simplified DTO for ProductAttribute with values in the format requested by frontend.
 */
public class AttributeWithValuesDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String name;

    private List<AttributeValueDTO> values;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<AttributeValueDTO> getValues() {
        return values;
    }

    public void setValues(List<AttributeValueDTO> values) {
        this.values = values;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AttributeWithValuesDTO)) {
            return false;
        }

        AttributeWithValuesDTO that = (AttributeWithValuesDTO) o;
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
        return "AttributeWithValuesDTO{" + "id=" + getId() + ", name='" + getName() + "'" + ", values=" + getValues() + "}";
    }
}
