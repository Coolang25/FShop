package com.quattrinh.shop.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VariantAttributeValue.
 */
@Entity
@Table(name = "variant_attribute_value")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VariantAttributeValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "product" }, allowSetters = true)
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "attribute" }, allowSetters = true)
    private ProductAttributeValue attributeValue;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VariantAttributeValue id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductVariant getVariant() {
        return this.variant;
    }

    public void setVariant(ProductVariant productVariant) {
        this.variant = productVariant;
    }

    public VariantAttributeValue variant(ProductVariant productVariant) {
        this.setVariant(productVariant);
        return this;
    }

    public ProductAttributeValue getAttributeValue() {
        return this.attributeValue;
    }

    public void setAttributeValue(ProductAttributeValue productAttributeValue) {
        this.attributeValue = productAttributeValue;
    }

    public VariantAttributeValue attributeValue(ProductAttributeValue productAttributeValue) {
        this.setAttributeValue(productAttributeValue);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VariantAttributeValue)) {
            return false;
        }
        return getId() != null && getId().equals(((VariantAttributeValue) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VariantAttributeValue{" +
            "id=" + getId() +
            "}";
    }
}
