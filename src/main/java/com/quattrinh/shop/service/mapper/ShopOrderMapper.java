package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ShopOrder} and its DTO {@link ShopOrderDTO}.
 */
@Mapper(componentModel = "spring")
public interface ShopOrderMapper extends EntityMapper<ShopOrderDTO, ShopOrder> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    @Mapping(target = "payment", source = "payment", qualifiedByName = "paymentId")
    @Mapping(target = "orderItems", ignore = true)
    ShopOrderDTO toDto(ShopOrder s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    com.quattrinh.shop.service.dto.UserDTO toDtoUserLogin(com.quattrinh.shop.domain.User user);

    @Named("paymentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "method", source = "method")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "transactionId", source = "transactionId")
    @Mapping(target = "order", ignore = true)
    com.quattrinh.shop.service.dto.PaymentDTO toDtoPaymentId(com.quattrinh.shop.domain.Payment payment);
}
