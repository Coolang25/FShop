package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Cart;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.service.dto.CartDTO;
import com.quattrinh.shop.service.dto.CartItemDTO;
import com.quattrinh.shop.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Cart} and its DTO {@link CartDTO}.
 */
@Mapper(componentModel = "spring")
public interface CartMapper extends EntityMapper<CartDTO, Cart> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    @Mapping(target = "items", ignore = true) // Manually mapped in service to avoid circular dependency
    CartDTO toDto(Cart s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
