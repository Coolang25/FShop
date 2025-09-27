package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Product entity.
 *
 * When extending this class, extend ProductRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface ProductRepository
    extends ProductRepositoryWithBagRelationships, JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    default Optional<Product> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Product> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Product> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    List<Product> findAllActive();

    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    Page<Product> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isActive = true")
    Optional<Product> findOneActive(Long id);
}
