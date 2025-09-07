package com.quattrinh.shop.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductAttributeValue.
 */
@Entity
@Table(name = "product_attribute_values")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductAttributeValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "value", length = 100, nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    private ProductAttribute attribute;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductAttributeValue id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValue() {
        return this.value;
    }

    public ProductAttributeValue value(String value) {
        this.setValue(value);
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ProductAttribute getAttribute() {
        return this.attribute;
    }

    public void setAttribute(ProductAttribute productAttribute) {
        this.attribute = productAttribute;
    }

    public ProductAttributeValue attribute(ProductAttribute productAttribute) {
        this.setAttribute(productAttribute);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductAttributeValue)) {
            return false;
        }
        return getId() != null && getId().equals(((ProductAttributeValue) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductAttributeValue{" +
            "id=" + getId() +
            ", value='" + getValue() + "'" +
            "}";
    }
}
