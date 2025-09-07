package com.quattrinh.shop.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.ProductAttribute} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductAttributeDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String name;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductAttributeDTO)) {
            return false;
        }

        ProductAttributeDTO productAttributeDTO = (ProductAttributeDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, productAttributeDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductAttributeDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
