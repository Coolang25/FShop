package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.ProductAttribute;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductAttribute entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Long>, JpaSpecificationExecutor<ProductAttribute> {
    @EntityGraph(attributePaths = "values")
    Page<ProductAttribute> findAll(@Nullable Specification<ProductAttribute> spec, Pageable pageable);

    @Query("SELECT pa FROM ProductAttribute pa LEFT JOIN FETCH pa.values WHERE pa.id = :id")
    ProductAttribute findByIdWithValues(Long id);

    @Query("SELECT pa FROM ProductAttribute pa LEFT JOIN FETCH pa.values")
    List<ProductAttribute> findAllWithValues();
}
