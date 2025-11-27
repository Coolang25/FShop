package com.quattrinh.shop.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductVariant.
 */
@Entity
@Table(name = "product_variants")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductVariant extends AbstractAuditingEntity<Long> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "sku", length = 100, nullable = false, unique = true)
    private String sku;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @NotNull
    @Column(name = "cost_price", precision = 21, scale = 2, nullable = false)
    private BigDecimal costPrice;

    @NotNull
    @Min(value = 0)
    @Column(name = "stock", nullable = false, columnDefinition = "integer default 0")
    private Integer stock = 0;

    @NotNull
    @Min(value = 0)
    @Column(name = "reserved", nullable = false, columnDefinition = "integer default 0")
    private Integer reserved = 0;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "categories" }, allowSetters = true)
    private Product product;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_variants__product_attribute_values",
        joinColumns = @JoinColumn(name = "variant_id"),
        inverseJoinColumns = @JoinColumn(name = "attribute_value_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "attribute" }, allowSetters = true)
    private Set<ProductAttributeValue> attributeValues = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductVariant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return this.sku;
    }

    public ProductVariant sku(String sku) {
        this.setSku(sku);
        return this;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public ProductVariant price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getCostPrice() {
        return this.costPrice;
    }

    public ProductVariant costPrice(BigDecimal costPrice) {
        this.setCostPrice(costPrice);
        return this;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public Integer getStock() {
        return this.stock;
    }

    public ProductVariant stock(Integer stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getReserved() {
        return this.reserved;
    }

    public ProductVariant reserved(Integer reserved) {
        this.setReserved(reserved);
        return this;
    }

    public void setReserved(Integer reserved) {
        this.reserved = reserved;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public ProductVariant imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public ProductVariant isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductVariant product(Product product) {
        this.setProduct(product);
        return this;
    }

    public Set<ProductAttributeValue> getAttributeValues() {
        return this.attributeValues;
    }

    public void setAttributeValues(Set<ProductAttributeValue> attributeValues) {
        this.attributeValues = attributeValues;
    }

    public ProductVariant attributeValues(Set<ProductAttributeValue> attributeValues) {
        this.setAttributeValues(attributeValues);
        return this;
    }

    public ProductVariant addAttributeValue(ProductAttributeValue attributeValue) {
        this.attributeValues.add(attributeValue);
        return this;
    }

    public ProductVariant removeAttributeValue(ProductAttributeValue attributeValue) {
        this.attributeValues.remove(attributeValue);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductVariant)) {
            return false;
        }
        return getId() != null && getId().equals(((ProductVariant) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductVariant{" +
            "id=" + getId() +
            ", sku='" + getSku() + "'" +
            ", price=" + getPrice() +
            ", costPrice=" + getCostPrice() +
            ", stock=" + getStock() +
            ", reserved=" + getReserved() +
            ", imageUrl='" + getImageUrl() + "'" +
            ", isActive=" + getIsActive() +
            "}";
    }
}
