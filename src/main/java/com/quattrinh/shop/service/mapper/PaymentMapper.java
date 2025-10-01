package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Payment;
import com.quattrinh.shop.domain.ShopOrder;
import com.quattrinh.shop.service.dto.PaymentDTO;
import com.quattrinh.shop.service.dto.ShopOrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Payment} and its DTO {@link PaymentDTO}.
 */
@Mapper(componentModel = "spring")
public interface PaymentMapper extends EntityMapper<PaymentDTO, Payment> {
    @Mapping(target = "order", source = "order", qualifiedByName = "shopOrderId")
    PaymentDTO toDto(Payment s);

    @Named("shopOrderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "total", source = "total")
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    ShopOrderDTO toDtoShopOrderId(ShopOrder shopOrder);
}
