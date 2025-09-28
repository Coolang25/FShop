package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.service.dto.AttributeValueDTO;
import com.quattrinh.shop.service.dto.AttributeWithValuesDTO;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting ProductAttributeDTO to simplified AttributeWithValuesDTO.
 */
@Component
public class AttributeWithValuesMapper {

    /**
     * Convert ProductAttributeValueDTO to AttributeValueDTO.
     *
     * @param productAttributeValueDTO the ProductAttributeValueDTO to convert.
     * @return the converted AttributeValueDTO.
     */
    public AttributeValueDTO toAttributeValueDTO(ProductAttributeValueDTO productAttributeValueDTO) {
        if (productAttributeValueDTO == null) {
            return null;
        }

        AttributeValueDTO dto = new AttributeValueDTO();
        dto.setId(productAttributeValueDTO.getId());
        dto.setValue(productAttributeValueDTO.getValue());

        return dto;
    }
}
