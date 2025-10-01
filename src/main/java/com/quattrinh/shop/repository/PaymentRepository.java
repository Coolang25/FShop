package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.Payment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Payment entity.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {
    @Query("select payment from Payment payment where payment.order.id = :orderId")
    Optional<Payment> findByOrderId(@Param("orderId") Long orderId);

    @Query("select payment from Payment payment left join fetch payment.order")
    List<Payment> findAllWithToOneRelationships();

    @Query("select payment from Payment payment left join fetch payment.order where payment.id =:id")
    Optional<Payment> findOneWithToOneRelationships(@Param("id") Long id);
}
