package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductImage;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.dto.ProductImageDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductImage} and its DTO {@link ProductImageDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductImageMapper extends EntityMapper<ProductImageDTO, ProductImage> {
    @Mapping(target = "product", source = "product", qualifiedByName = "productName")
    ProductImageDTO toDto(ProductImage s);

    @Named("productName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductDTO toDtoProductName(Product product);
}
