package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ProductAttribute;
import com.quattrinh.shop.service.dto.SimpleProductAttributeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductAttribute} and its simple DTO {@link SimpleProductAttributeDTO}.
 */
@Mapper(componentModel = "spring")
public interface SimpleProductAttributeMapper extends EntityMapper<SimpleProductAttributeDTO, ProductAttribute> {}
