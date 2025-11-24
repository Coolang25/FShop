package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.InventoryTransaction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InventoryTransaction entity.
 */
@Repository
public interface InventoryTransactionRepository
    extends JpaRepository<InventoryTransaction, Long>, JpaSpecificationExecutor<InventoryTransaction> {
    default Optional<InventoryTransaction> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<InventoryTransaction> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<InventoryTransaction> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select inventoryTransaction from InventoryTransaction inventoryTransaction left join fetch inventoryTransaction.variant left join fetch inventoryTransaction.variant.product left join fetch inventoryTransaction.order",
        countQuery = "select count(inventoryTransaction) from InventoryTransaction inventoryTransaction"
    )
    Page<InventoryTransaction> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select inventoryTransaction from InventoryTransaction inventoryTransaction left join fetch inventoryTransaction.variant left join fetch inventoryTransaction.variant.product left join fetch inventoryTransaction.order"
    )
    List<InventoryTransaction> findAllWithToOneRelationships();

    @Query(
        "select inventoryTransaction from InventoryTransaction inventoryTransaction left join fetch inventoryTransaction.variant left join fetch inventoryTransaction.variant.product left join fetch inventoryTransaction.order where inventoryTransaction.id =:id"
    )
    Optional<InventoryTransaction> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.variant.id = :variantId ORDER BY it.createdDate DESC")
    List<InventoryTransaction> findByVariantId(@Param("variantId") Long variantId);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.variant.id = :variantId ORDER BY it.createdDate DESC")
    Page<InventoryTransaction> findByVariantId(@Param("variantId") Long variantId, Pageable pageable);
}
