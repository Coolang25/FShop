package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ProductAttributeValue;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.domain.VariantAttributeValue;
import com.quattrinh.shop.service.dto.ProductAttributeValueDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.dto.VariantAttributeValueDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link VariantAttributeValue} and its DTO {@link VariantAttributeValueDTO}.
 */
@Mapper(componentModel = "spring")
public interface VariantAttributeValueMapper extends EntityMapper<VariantAttributeValueDTO, VariantAttributeValue> {
    @Mapping(target = "variant", source = "variant", qualifiedByName = "productVariantSku")
    @Mapping(target = "attributeValue", source = "attributeValue", qualifiedByName = "productAttributeValueValue")
    VariantAttributeValueDTO toDto(VariantAttributeValue s);

    @Named("productVariantSku")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "sku", source = "sku")
    ProductVariantDTO toDtoProductVariantSku(ProductVariant productVariant);

    @Named("productAttributeValueValue")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "value", source = "value")
    ProductAttributeValueDTO toDtoProductAttributeValueValue(ProductAttributeValue productAttributeValue);
}
