package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import com.quattrinh.shop.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ShopOrder} and its DTO {@link ShopOrderDTO}.
 */
@Mapper(componentModel = "spring")
public interface ShopOrderMapper extends EntityMapper<ShopOrderDTO, ShopOrder> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    ShopOrderDTO toDto(ShopOrder s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
