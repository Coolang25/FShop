package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.OrderItem;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.service.dto.OrderItemDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {
    @Mapping(target = "order", source = "order", qualifiedByName = "shopOrderId")
    @Mapping(target = "variant", source = "variant", qualifiedByName = "productVariantSku")
    OrderItemDTO toDto(OrderItem s);

    @Named("shopOrderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ShopOrderDTO toDtoShopOrderId(ShopOrder shopOrder);

    @Named("productVariantSku")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "sku", source = "sku")
    ProductVariantDTO toDtoProductVariantSku(ProductVariant productVariant);
}
