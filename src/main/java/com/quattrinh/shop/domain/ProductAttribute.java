package com.quattrinh.shop.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductAttribute.
 */
@Entity
@Table(name = "product_attributes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductAttribute extends AbstractAuditingEntity<Long> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "attribute", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ProductAttributeValue> values = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductAttribute id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ProductAttribute name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ProductAttributeValue> getValues() {
        return this.values;
    }

    public void setValues(Set<ProductAttributeValue> productAttributeValues) {
        if (this.values != null) {
            this.values.forEach(i -> i.setAttribute(null));
        }
        if (productAttributeValues != null) {
            productAttributeValues.forEach(i -> i.setAttribute(this));
        }
        this.values = productAttributeValues;
    }

    public ProductAttribute values(Set<ProductAttributeValue> productAttributeValues) {
        this.setValues(productAttributeValues);
        return this;
    }

    public ProductAttribute addValues(ProductAttributeValue productAttributeValue) {
        this.values.add(productAttributeValue);
        productAttributeValue.setAttribute(this);
        return this;
    }

    public ProductAttribute removeValues(ProductAttributeValue productAttributeValue) {
        this.values.remove(productAttributeValue);
        productAttributeValue.setAttribute(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductAttribute)) {
            return false;
        }
        return getId() != null && getId().equals(((ProductAttribute) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductAttribute{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
