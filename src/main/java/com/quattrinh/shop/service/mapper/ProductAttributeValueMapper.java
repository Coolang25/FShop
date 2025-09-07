package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductAttributeValue} and its DTO {@link ProductAttributeValueDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductAttributeValueMapper extends EntityMapper<ProductAttributeValueDTO, ProductAttributeValue> {
    @Mapping(target = "attribute", source = "attribute", qualifiedByName = "productAttributeName")
    ProductAttributeValueDTO toDto(ProductAttributeValue s);

    @Named("productAttributeName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductAttributeDTO toDtoProductAttributeName(ProductAttribute productAttribute);
}
