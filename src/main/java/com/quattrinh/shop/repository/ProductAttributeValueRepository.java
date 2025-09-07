package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.ProductAttributeValue;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductAttributeValue entity.
 */
@Repository
public interface ProductAttributeValueRepository
    extends JpaRepository<ProductAttributeValue, Long>, JpaSpecificationExecutor<ProductAttributeValue> {
    default Optional<ProductAttributeValue> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProductAttributeValue> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProductAttributeValue> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select productAttributeValue from ProductAttributeValue productAttributeValue left join fetch productAttributeValue.attribute",
        countQuery = "select count(productAttributeValue) from ProductAttributeValue productAttributeValue"
    )
    Page<ProductAttributeValue> findAllWithToOneRelationships(Pageable pageable);

    @Query("select productAttributeValue from ProductAttributeValue productAttributeValue left join fetch productAttributeValue.attribute")
    List<ProductAttributeValue> findAllWithToOneRelationships();

    @Query(
        "select productAttributeValue from ProductAttributeValue productAttributeValue left join fetch productAttributeValue.attribute where productAttributeValue.id =:id"
    )
    Optional<ProductAttributeValue> findOneWithToOneRelationships(@Param("id") Long id);
}
