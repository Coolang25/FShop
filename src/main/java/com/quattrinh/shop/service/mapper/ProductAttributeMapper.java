package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.service.dto.ProductAttributeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductAttribute} and its DTO {@link ProductAttributeDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductAttributeMapper extends EntityMapper<ProductAttributeDTO, ProductAttribute> {}
