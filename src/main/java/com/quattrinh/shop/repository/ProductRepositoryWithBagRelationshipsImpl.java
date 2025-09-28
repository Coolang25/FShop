package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProductRepositoryWithBagRelationshipsImpl implements ProductRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String PRODUCTS_PARAMETER = "products";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Product> fetchBagRelationships(Optional<Product> product) {
        return product.map(this::fetchCategories).map(this::fetchVariants);
    }

    @Override
    public Page<Product> fetchBagRelationships(Page<Product> products) {
        return new PageImpl<>(fetchBagRelationships(products.getContent()), products.getPageable(), products.getTotalElements());
    }

    @Override
    public List<Product> fetchBagRelationships(List<Product> products) {
        return Optional.of(products).map(this::fetchCategories).map(this::fetchVariants).orElse(Collections.emptyList());
    }

    Product fetchCategories(Product result) {
        return entityManager
            .createQuery("select product from Product product left join fetch product.categories where product.id = :id", Product.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Product> fetchCategories(List<Product> products) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, products.size()).forEach(index -> order.put(products.get(index).getId(), index));
        List<Product> result = entityManager
            .createQuery("select product from Product product left join fetch product.categories where product in :products", Product.class)
            .setParameter(PRODUCTS_PARAMETER, products)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Product fetchVariants(Product result) {
        return entityManager
            .createQuery(
                "select product from Product product left join fetch product.variants variant left join fetch variant.attributeValues attrVal left join fetch attrVal.attribute where product.id = :id",
                Product.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Product> fetchVariants(List<Product> products) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, products.size()).forEach(index -> order.put(products.get(index).getId(), index));
        List<Product> result = entityManager
            .createQuery(
                "select product from Product product left join fetch product.variants variant left join fetch variant.attributeValues attrVal left join fetch attrVal.attribute where product in :products",
                Product.class
            )
            .setParameter(PRODUCTS_PARAMETER, products)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    @Override
    public Page<Product> findAllWithEagerRelationshipsAndSearch(Pageable pageable, String search) {
        // First get the products with search
        List<Product> products = entityManager
            .createQuery(
                "select product from Product product where product.isActive = true and (lower(product.name) like lower(concat('%', :search, '%')) or lower(product.description) like lower(concat('%', :search, '%')))",
                Product.class
            )
            .setParameter("search", search)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        // Get total count
        Long totalCount = entityManager
            .createQuery(
                "select count(product) from Product product where product.isActive = true and (lower(product.name) like lower(concat('%', :search, '%')) or lower(product.description) like lower(concat('%', :search, '%')))",
                Long.class
            )
            .setParameter("search", search)
            .getSingleResult();

        // Fetch bag relationships
        List<Product> productsWithRelationships = fetchBagRelationships(products);

        return new PageImpl<>(productsWithRelationships, pageable, totalCount);
    }
}
