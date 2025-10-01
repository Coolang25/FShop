package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.Cart;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Cart entity.
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long>, JpaSpecificationExecutor<Cart> {
    default List<Cart> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Cart> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select cart from Cart cart left join fetch cart.user", countQuery = "select count(cart) from Cart cart")
    Page<Cart> findAllWithToOneRelationships(Pageable pageable);

    @Query("select cart from Cart cart left join fetch cart.user")
    List<Cart> findAllWithToOneRelationships();

    @Query("select cart from Cart cart left join fetch cart.user where cart.id =:id")
    Optional<Cart> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(
        "select cart from Cart cart left join fetch cart.user left join fetch cart.items left join fetch cart.items.variant left join fetch cart.items.variant.product where cart.id =:id"
    )
    Optional<Cart> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select cart from Cart cart left join fetch cart.user where cart.user.id =:userId")
    Optional<Cart> findByUserId(@Param("userId") Long userId);
}
