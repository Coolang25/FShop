package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.OrderItem;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.service.dto.OrderItemDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import java.util.List;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OrderItem} and its DTO {@link OrderItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrderItemMapper {
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

    OrderItem toEntity(OrderItemDTO dto);

    List<OrderItem> toEntity(List<OrderItemDTO> dtoList);

    List<OrderItemDTO> toDto(List<OrderItem> entityList);

    @Named("partialUpdate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget OrderItem entity, OrderItemDTO dto);
}
