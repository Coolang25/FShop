package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.CartItem;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.service.dto.CartItemDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CartItem} and its DTO {@link CartItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface CartItemMapper extends EntityMapper<CartItemDTO, CartItem> {
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "variant", ignore = true)
    CartItemDTO toDto(CartItem s);
}
