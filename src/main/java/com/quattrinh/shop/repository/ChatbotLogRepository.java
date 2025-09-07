package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.ChatbotLog;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ChatbotLog entity.
 */
@Repository
public interface ChatbotLogRepository extends JpaRepository<ChatbotLog, Long>, JpaSpecificationExecutor<ChatbotLog> {
    @Query("select chatbotLog from ChatbotLog chatbotLog where chatbotLog.user.login = ?#{authentication.name}")
    List<ChatbotLog> findByUserIsCurrentUser();

    default Optional<ChatbotLog> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ChatbotLog> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ChatbotLog> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select chatbotLog from ChatbotLog chatbotLog left join fetch chatbotLog.user",
        countQuery = "select count(chatbotLog) from ChatbotLog chatbotLog"
    )
    Page<ChatbotLog> findAllWithToOneRelationships(Pageable pageable);

    @Query("select chatbotLog from ChatbotLog chatbotLog left join fetch chatbotLog.user")
    List<ChatbotLog> findAllWithToOneRelationships();

    @Query("select chatbotLog from ChatbotLog chatbotLog left join fetch chatbotLog.user where chatbotLog.id =:id")
    Optional<ChatbotLog> findOneWithToOneRelationships(@Param("id") Long id);
}
