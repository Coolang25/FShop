package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.ProductReview;
import com.quattrinh.shop.repository.ProductReviewRepository;
import com.quattrinh.shop.service.dto.ProductReviewDTO;
import com.quattrinh.shop.service.mapper.ProductReviewMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ProductReview}.
 */
@Service
@Transactional
public class ProductReviewService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductReviewService.class);

    private final ProductReviewRepository productReviewRepository;

    private final ProductReviewMapper productReviewMapper;

    public ProductReviewService(ProductReviewRepository productReviewRepository, ProductReviewMapper productReviewMapper) {
        this.productReviewRepository = productReviewRepository;
        this.productReviewMapper = productReviewMapper;
    }

    /**
     * Save a productReview.
     *
     * @param productReviewDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductReviewDTO save(ProductReviewDTO productReviewDTO) {
        LOG.debug("Request to save ProductReview : {}", productReviewDTO);
        ProductReview productReview = productReviewMapper.toEntity(productReviewDTO);
        productReview = productReviewRepository.save(productReview);
        return productReviewMapper.toDto(productReview);
    }

    /**
     * Update a productReview.
     *
     * @param productReviewDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductReviewDTO update(ProductReviewDTO productReviewDTO) {
        LOG.debug("Request to update ProductReview : {}", productReviewDTO);
        ProductReview productReview = productReviewMapper.toEntity(productReviewDTO);
        productReview = productReviewRepository.save(productReview);
        return productReviewMapper.toDto(productReview);
    }

    /**
     * Partially update a productReview.
     *
     * @param productReviewDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductReviewDTO> partialUpdate(ProductReviewDTO productReviewDTO) {
        LOG.debug("Request to partially update ProductReview : {}", productReviewDTO);

        return productReviewRepository
            .findById(productReviewDTO.getId())
            .map(existingProductReview -> {
                productReviewMapper.partialUpdate(existingProductReview, productReviewDTO);

                return existingProductReview;
            })
            .map(productReviewRepository::save)
            .map(productReviewMapper::toDto);
    }

    /**
     * Get all the productReviews with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProductReviewDTO> findAllWithEagerRelationships(Pageable pageable) {
        return productReviewRepository.findAllWithEagerRelationships(pageable).map(productReviewMapper::toDto);
    }

    /**
     * Get one productReview by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductReviewDTO> findOne(Long id) {
        LOG.debug("Request to get ProductReview : {}", id);
        return productReviewRepository.findOneWithEagerRelationships(id).map(productReviewMapper::toDto);
    }

    /**
     * Delete the productReview by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ProductReview : {}", id);
        productReviewRepository.deleteById(id);
    }
}
