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
    ShopOrderDTO toDtoShopOrderId(ShopOrder shopOrder);
}
