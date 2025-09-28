package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.service.dto.SimpleProductAttributeValueDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductAttributeValue} and its simple DTO {@link SimpleProductAttributeValueDTO}.
 */
@Mapper(componentModel = "spring")
public interface SimpleProductAttributeValueMapper extends EntityMapper<SimpleProductAttributeValueDTO, ProductAttributeValue> {
    @Mapping(target = "attributeId", source = "attribute.id")
    @Mapping(target = "attribute", source = "attribute")
    SimpleProductAttributeValueDTO toDto(ProductAttributeValue s);
}
