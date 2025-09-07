package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Cart;
import com.quattrinh.shop.domain.CartItem;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.service.dto.CartItemDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CartItem} and its DTO {@link CartItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface CartItemMapper extends EntityMapper<CartItemDTO, CartItem> {
    @Mapping(target = "cart", source = "cart", qualifiedByName = "cartId")
    @Mapping(target = "variant", source = "variant", qualifiedByName = "productVariantSku")
    CartItemDTO toDto(CartItem s);

    @Named("cartId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CartDTO toDtoCartId(Cart cart);

    @Named("productVariantSku")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "sku", source = "sku")
    ProductVariantDTO toDtoProductVariantSku(ProductVariant productVariant);
}
