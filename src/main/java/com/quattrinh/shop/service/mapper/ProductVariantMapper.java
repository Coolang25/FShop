package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.dto.SimpleProductAttributeValueDTO;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link ProductVariant} and its DTO {@link ProductVariantDTO}.
 */
@Component
public class ProductVariantMapper {

    @Autowired
    private SimpleProductAttributeValueMapper simpleProductAttributeValueMapper;

    public ProductVariantDTO toDto(ProductVariant entity) {
        if (entity == null) {
            return null;
        }

        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(entity.getId());
        dto.setSku(entity.getSku());
        dto.setPrice(entity.getPrice());
        dto.setCostPrice(entity.getCostPrice());
        dto.setStock(entity.getStock());
        dto.setImageUrl(entity.getImageUrl());
        dto.setIsActive(entity.getIsActive());

        // Map attribute values
        Set<SimpleProductAttributeValueDTO> attributeValueDTOs = new HashSet<>();
        if (entity.getAttributeValues() != null) {
            for (var attrValue : entity.getAttributeValues()) {
                attributeValueDTOs.add(simpleProductAttributeValueMapper.toDto(attrValue));
            }
        }
        dto.setAttributeValues(attributeValueDTOs);

        if (entity.getProduct() != null) {
            dto.setProduct(new ProductDTO().id(entity.getProduct().getId()).name(entity.getProduct().getName()));
        } else {
            dto.setProduct(null);
        }

        return dto;
    }

    public ProductVariantDTO toDtoVariant(ProductVariant entity) {
        if (entity == null) {
            return null;
        }

        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(entity.getId());
        dto.setSku(entity.getSku());
        dto.setPrice(entity.getPrice());
        dto.setCostPrice(entity.getCostPrice());
        dto.setStock(entity.getStock());
        dto.setImageUrl(entity.getImageUrl());
        dto.setIsActive(entity.getIsActive());

        // Map attribute values
        Set<SimpleProductAttributeValueDTO> attributeValueDTOs = new HashSet<>();
        if (entity.getAttributeValues() != null) {
            for (var attrValue : entity.getAttributeValues()) {
                attributeValueDTOs.add(simpleProductAttributeValueMapper.toDto(attrValue));
            }
        }
        dto.setAttributeValues(attributeValueDTOs);

        if (entity.getProduct() != null) {
            dto.setProduct(new ProductDTO().id(entity.getProduct().getId()).name(entity.getProduct().getName()));
        } else {
            dto.setProduct(null);
        }

        return dto;
    }

    public ProductVariant toEntity(ProductVariantDTO dto) {
        if (dto == null) {
            return null;
        }

        ProductVariant entity = new ProductVariant();
        entity.setId(dto.getId());
        entity.setSku(dto.getSku());
        entity.setPrice(dto.getPrice());
        entity.setCostPrice(dto.getCostPrice());
        entity.setStock(dto.getStock());
        entity.setImageUrl(dto.getImageUrl());
        entity.setIsActive(dto.getIsActive());

        return entity;
    }
}
