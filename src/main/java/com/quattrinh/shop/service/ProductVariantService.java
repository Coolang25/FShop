package com.quattrinh.shop.service;

import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.repository.ProductAttributeValueRepository;
import com.quattrinh.shop.repository.ProductVariantRepository;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.dto.SimpleProductAttributeValueDTO;
import com.quattrinh.shop.service.mapper.ProductVariantMapper;
import com.quattrinh.shop.service.mapper.SimpleProductAttributeValueMapper;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.quattrinh.shop.domain.ProductVariant}.
 */
@Service
@Transactional
public class ProductVariantService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductVariantService.class);

    private final ProductVariantRepository productVariantRepository;

    private final ProductAttributeValueRepository productAttributeValueRepository;

    private final ProductVariantMapper productVariantMapper;

    private final SimpleProductAttributeValueMapper simpleProductAttributeValueMapper;

    public ProductVariantService(
        ProductVariantRepository productVariantRepository,
        ProductAttributeValueRepository productAttributeValueRepository,
        ProductVariantMapper productVariantMapper,
        SimpleProductAttributeValueMapper simpleProductAttributeValueMapper
    ) {
        this.productVariantRepository = productVariantRepository;
        this.productAttributeValueRepository = productAttributeValueRepository;
        this.productVariantMapper = productVariantMapper;
        this.simpleProductAttributeValueMapper = simpleProductAttributeValueMapper;
    }

    /**
     * Save a productVariant.
     *
     * @param productVariantDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductVariantDTO save(ProductVariantDTO productVariantDTO) {
        LOG.debug("Request to save ProductVariant : {}", productVariantDTO);
        ProductVariant productVariant = productVariantMapper.toEntity(productVariantDTO);

        // Handle product relationship
        if (productVariantDTO.getProduct() != null && productVariantDTO.getProduct().getId() != null) {
            // Create a minimal Product entity with just the ID
            Product product = new Product();
            product.setId(productVariantDTO.getProduct().getId());
            productVariant.setProduct(product);
        }

        // Handle attribute values
        if (productVariantDTO.getAttributeValues() != null) {
            Set<ProductAttributeValue> attributeValues = new HashSet<>();

            for (var attributeValueDTO : productVariantDTO.getAttributeValues()) {
                if (attributeValueDTO.getId() != null) {
                    Optional<ProductAttributeValue> productAttributeValue = productAttributeValueRepository.findById(
                        attributeValueDTO.getId()
                    );
                    if (productAttributeValue.isPresent()) {
                        attributeValues.add(productAttributeValue.get());
                    }
                }
            }
            productVariant.setAttributeValues(attributeValues);
        }

        productVariant = productVariantRepository.save(productVariant);
        ProductVariantDTO result = productVariantMapper.toDto(productVariant);

        // Manually map product
        if (productVariant.getProduct() != null) {
            result.getProduct().setId(productVariant.getProduct().getId());
        }

        // Manually map attribute values
        Set<SimpleProductAttributeValueDTO> attributeValueDTOs = new HashSet<>();
        for (ProductAttributeValue attrValue : productVariant.getAttributeValues()) {
            attributeValueDTOs.add(simpleProductAttributeValueMapper.toDto(attrValue));
        }
        result.setAttributeValues(attributeValueDTOs);

        return result;
    }

    /**
     * Update a productVariant.
     *
     * @param productVariantDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductVariantDTO update(ProductVariantDTO productVariantDTO) {
        LOG.debug("Request to update ProductVariant : {}", productVariantDTO);

        // Get existing variant to preserve relationships
        ProductVariant existingVariant = productVariantRepository
            .findById(productVariantDTO.getId())
            .orElseThrow(() -> new RuntimeException("ProductVariant not found with id: " + productVariantDTO.getId()));

        // Update basic fields
        existingVariant.setSku(productVariantDTO.getSku());
        existingVariant.setPrice(productVariantDTO.getPrice());
        existingVariant.setStock(productVariantDTO.getStock());
        existingVariant.setImageUrl(productVariantDTO.getImageUrl());
        existingVariant.setIsActive(productVariantDTO.getIsActive());

        // Handle product relationship
        if (productVariantDTO.getProduct() != null && productVariantDTO.getProduct().getId() != null) {
            // Create a minimal Product entity with just the ID
            Product product = new Product();
            product.setId(productVariantDTO.getProduct().getId());
            existingVariant.setProduct(product);
        }

        // Handle attribute values
        if (productVariantDTO.getAttributeValues() != null) {
            Set<ProductAttributeValue> attributeValues = new HashSet<>();

            for (var attributeValueDTO : productVariantDTO.getAttributeValues()) {
                if (attributeValueDTO.getId() != null) {
                    Optional<ProductAttributeValue> productAttributeValue = productAttributeValueRepository.findById(
                        attributeValueDTO.getId()
                    );
                    if (productAttributeValue.isPresent()) {
                        attributeValues.add(productAttributeValue.get());
                    }
                }
            }
            existingVariant.setAttributeValues(attributeValues);
        }

        ProductVariant savedVariant = productVariantRepository.save(existingVariant);
        ProductVariantDTO result = productVariantMapper.toDto(savedVariant);

        // Manually map product
        if (savedVariant.getProduct() != null) {
            result.getProduct().setId(savedVariant.getProduct().getId());
            result.getProduct().setName(savedVariant.getProduct().getName());
        }

        // Manually map attribute values
        Set<SimpleProductAttributeValueDTO> attributeValueDTOs = new HashSet<>();
        for (ProductAttributeValue attrValue : savedVariant.getAttributeValues()) {
            attributeValueDTOs.add(simpleProductAttributeValueMapper.toDto(attrValue));
        }
        result.setAttributeValues(attributeValueDTOs);

        return result;
    }

    /**
     * Partially update a productVariant.
     *
     * @param productVariantDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductVariantDTO> partialUpdate(ProductVariantDTO productVariantDTO) {
        LOG.debug("Request to partially update ProductVariant : {}", productVariantDTO);

        return productVariantRepository
            .findById(productVariantDTO.getId())
            .map(existingProductVariant -> {
                // Update only non-null fields
                if (productVariantDTO.getSku() != null) {
                    existingProductVariant.setSku(productVariantDTO.getSku());
                }
                if (productVariantDTO.getPrice() != null) {
                    existingProductVariant.setPrice(productVariantDTO.getPrice());
                }
                if (productVariantDTO.getStock() != null) {
                    existingProductVariant.setStock(productVariantDTO.getStock());
                }
                if (productVariantDTO.getImageUrl() != null) {
                    existingProductVariant.setImageUrl(productVariantDTO.getImageUrl());
                }
                if (productVariantDTO.getIsActive() != null) {
                    existingProductVariant.setIsActive(productVariantDTO.getIsActive());
                }
                if (productVariantDTO.getProduct() != null && productVariantDTO.getProduct().getId() != null) {
                    // Create a minimal Product entity with just the ID
                    Product product = new Product();
                    product.setId(productVariantDTO.getProduct().getId());
                    existingProductVariant.setProduct(product);
                }

                return existingProductVariant;
            })
            .map(productVariantRepository::save)
            .map(variant -> {
                ProductVariantDTO result = productVariantMapper.toDto(variant);

                // Manually map product
                if (variant.getProduct() != null) {
                    result.getProduct().setId(variant.getProduct().getId());
                    result.getProduct().setName(variant.getProduct().getName());
                }

                // Manually map attribute values
                Set<SimpleProductAttributeValueDTO> attributeValueDTOs = new HashSet<>();
                for (ProductAttributeValue attrValue : variant.getAttributeValues()) {
                    attributeValueDTOs.add(simpleProductAttributeValueMapper.toDto(attrValue));
                }
                result.setAttributeValues(attributeValueDTOs);

                return result;
            });
    }

    /**
     * Get all the productVariants with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProductVariantDTO> findAllWithEagerRelationships(Pageable pageable) {
        return productVariantRepository.findAllWithEagerRelationships(pageable).map(productVariantMapper::toDto);
    }

    /**
     * Get one productVariant by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductVariantDTO> findOne(Long id) {
        LOG.debug("Request to get ProductVariant : {}", id);
        return productVariantRepository
            .findOneWithEagerRelationships(id)
            .map(variant -> {
                ProductVariantDTO dto = productVariantMapper.toDto(variant);

                // Manually map product
                if (variant.getProduct() != null) {
                    dto.getProduct().setId(variant.getProduct().getId());
                    dto.getProduct().setName(variant.getProduct().getName());
                }

                // Manually map attribute values
                Set<SimpleProductAttributeValueDTO> attributeValueDTOs = new HashSet<>();
                for (ProductAttributeValue attrValue : variant.getAttributeValues()) {
                    attributeValueDTOs.add(simpleProductAttributeValueMapper.toDto(attrValue));
                }
                dto.setAttributeValues(attributeValueDTOs);

                return dto;
            });
    }

    /**
     * Delete the productVariant by id (soft delete).
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to soft delete ProductVariant : {}", id);
        productVariantRepository
            .findById(id)
            .ifPresent(variant -> {
                variant.setIsActive(false);
                productVariantRepository.save(variant);
            });
    }
}
