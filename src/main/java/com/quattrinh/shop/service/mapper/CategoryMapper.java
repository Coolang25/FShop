package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Category;
import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.service.dto.CategoryDTO;
import com.quattrinh.shop.service.dto.ProductDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Category} and its DTO {@link CategoryDTO}.
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper extends EntityMapper<CategoryDTO, Category> {
    @Mapping(target = "products", source = "products", qualifiedByName = "productIdSet")
    CategoryDTO toDto(Category s);

    @Mapping(target = "products", ignore = true)
    @Mapping(target = "removeProducts", ignore = true)
    Category toEntity(CategoryDTO categoryDTO);

    @Named("productId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProductDTO toDtoProductId(Product product);

    @Named("productIdSet")
    default Set<ProductDTO> toDtoProductIdSet(Set<Product> product) {
        return product.stream().map(this::toDtoProductId).collect(Collectors.toSet());
    }
}
