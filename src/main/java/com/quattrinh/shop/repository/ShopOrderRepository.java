package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.ShopOrder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ShopOrder entity.
 */
@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Long>, JpaSpecificationExecutor<ShopOrder> {
    @Query("select shopOrder from ShopOrder shopOrder where shopOrder.user.login = ?#{authentication.name}")
    List<ShopOrder> findByUserIsCurrentUser();

    default Optional<ShopOrder> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ShopOrder> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ShopOrder> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select shopOrder from ShopOrder shopOrder left join fetch shopOrder.user left join fetch shopOrder.orderItems left join fetch shopOrder.orderItems.variant left join fetch shopOrder.orderItems.variant.product",
        countQuery = "select count(shopOrder) from ShopOrder shopOrder"
    )
    Page<ShopOrder> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select shopOrder from ShopOrder shopOrder left join fetch shopOrder.user left join fetch shopOrder.orderItems left join fetch shopOrder.orderItems.variant left join fetch shopOrder.orderItems.variant.product"
    )
    List<ShopOrder> findAllWithToOneRelationships();

    @Query(
        "select shopOrder from ShopOrder shopOrder left join fetch shopOrder.user left join fetch shopOrder.orderItems left join fetch shopOrder.orderItems.variant left join fetch shopOrder.orderItems.variant.product where shopOrder.id =:id"
    )
    Optional<ShopOrder> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select shopOrder from ShopOrder shopOrder where shopOrder.user.id = :userId order by shopOrder.createdAt desc")
    Page<ShopOrder> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @Query(
        value = "select shopOrder from ShopOrder shopOrder left join fetch shopOrder.user left join fetch shopOrder.orderItems left join fetch shopOrder.orderItems.variant left join fetch shopOrder.orderItems.variant.product where shopOrder.user.id = :userId order by shopOrder.createdAt desc",
        countQuery = "select count(shopOrder) from ShopOrder shopOrder where shopOrder.user.id = :userId"
    )
    Page<ShopOrder> findByUserIdWithEagerRelationshipsOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);
}
