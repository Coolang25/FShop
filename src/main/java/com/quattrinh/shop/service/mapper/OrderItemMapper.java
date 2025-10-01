package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.OrderItem;
import com.quattrinh.shop.service.dto.OrderItemDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {
    @Mapping(target = "order", source = "order", qualifiedByName = "orderId")
    @Mapping(target = "variant", source = "variant", qualifiedByName = "variantId")
    OrderItemDTO toDto(OrderItem s);

    @Named("orderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ShopOrderDTO toDtoOrderId(com.quattrinh.shop.domain.ShopOrder shopOrder);

    @Named("variantId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "stock", source = "stock")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "product", source = "product", qualifiedByName = "productId")
    @Mapping(target = "attributeValues", ignore = true)
    ProductVariantDTO toDtoVariantId(com.quattrinh.shop.domain.ProductVariant productVariant);

    @Named("productId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "basePrice", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    com.quattrinh.shop.service.dto.ProductDTO toDtoProductId(com.quattrinh.shop.domain.Product product);
}
