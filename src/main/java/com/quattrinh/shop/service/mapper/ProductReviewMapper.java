package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductReview;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.dto.ProductReviewDTO;
import com.quattrinh.shop.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductReview} and its DTO {@link ProductReviewDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductReviewMapper extends EntityMapper<ProductReviewDTO, ProductReview> {
    @Mapping(target = "product", source = "product", qualifiedByName = "productName")
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    ProductReviewDTO toDto(ProductReview s);

    @Named("productName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductDTO toDtoProductName(Product product);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
