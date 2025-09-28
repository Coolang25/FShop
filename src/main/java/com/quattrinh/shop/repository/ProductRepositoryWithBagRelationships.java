package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepositoryWithBagRelationships {
    Optional<Product> fetchBagRelationships(Optional<Product> product);

    List<Product> fetchBagRelationships(List<Product> products);

    Page<Product> fetchBagRelationships(Page<Product> products);

    Page<Product> findAllWithEagerRelationshipsAndSearch(Pageable pageable, String search);
}
