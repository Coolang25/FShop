package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Category;
import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.service.dto.CategoryDTO;
import com.quattrinh.shop.service.dto.ProductDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Product} and its DTO {@link ProductDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper extends EntityMapper<ProductDTO, Product> {
    @Mapping(target = "categories", source = "categories", qualifiedByName = "categoryNameSet")
    ProductDTO toDto(Product s);

    @Mapping(target = "removeCategories", ignore = true)
    Product toEntity(ProductDTO productDTO);

    @Named("categoryName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    CategoryDTO toDtoCategoryName(Category category);

    @Named("categoryNameSet")
    default Set<CategoryDTO> toDtoCategoryNameSet(Set<Category> category) {
        return category.stream().map(this::toDtoCategoryName).collect(Collectors.toSet());
    }
}
