package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.VariantAttributeValue;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VariantAttributeValue entity.
 */
@Repository
public interface VariantAttributeValueRepository
    extends JpaRepository<VariantAttributeValue, Long>, JpaSpecificationExecutor<VariantAttributeValue> {
    default Optional<VariantAttributeValue> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<VariantAttributeValue> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<VariantAttributeValue> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select variantAttributeValue from VariantAttributeValue variantAttributeValue left join fetch variantAttributeValue.variant left join fetch variantAttributeValue.attributeValue",
        countQuery = "select count(variantAttributeValue) from VariantAttributeValue variantAttributeValue"
    )
    Page<VariantAttributeValue> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select variantAttributeValue from VariantAttributeValue variantAttributeValue left join fetch variantAttributeValue.variant left join fetch variantAttributeValue.attributeValue"
    )
    List<VariantAttributeValue> findAllWithToOneRelationships();

    @Query(
        "select variantAttributeValue from VariantAttributeValue variantAttributeValue left join fetch variantAttributeValue.variant left join fetch variantAttributeValue.attributeValue where variantAttributeValue.id =:id"
    )
    Optional<VariantAttributeValue> findOneWithToOneRelationships(@Param("id") Long id);
}
