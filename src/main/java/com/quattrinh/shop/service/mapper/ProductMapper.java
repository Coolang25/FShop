package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Category;
import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.service.dto.CategoryDTO;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Product} and its DTO {@link ProductDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper extends EntityMapper<ProductDTO, Product> {
    @Mapping(target = "categories", source = "categories", qualifiedByName = "categoryNameSet")
    @Mapping(target = "variants", source = "variants", qualifiedByName = "variantSet")
    ProductDTO toDto(Product s);

    @Mapping(target = "removeCategories", ignore = true)
    @Mapping(target = "removeVariants", ignore = true)
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

    @Named("variant")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "stock", source = "stock")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "product", ignore = true)
    ProductVariantDTO toDtoVariant(ProductVariant variant);

    @Named("variantSet")
    default Set<ProductVariantDTO> toDtoVariantSet(Set<ProductVariant> variants) {
        return variants.stream().map(this::toDtoVariant).collect(Collectors.toSet());
    }
}
