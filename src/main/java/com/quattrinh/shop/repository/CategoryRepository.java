package com.quattrinh.shop.repository;

import com.quattrinh.shop.domain.Category;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    /**
     * Find all categories that have no parent category (root categories).
     *
     * @return list of parent categories
     */
    List<Category> findByParentCategoryIsNull();
}
