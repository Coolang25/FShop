package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Category;
import com.quattrinh.shop.service.dto.CategoryDTO;
import java.util.List;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Category} and its DTO {@link CategoryDTO}.
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "parentId", source = "parentCategory.id")
    CategoryDTO toDto(Category s);

    @Mapping(target = "products", ignore = true)
    @Mapping(target = "removeProducts", ignore = true)
    @Mapping(target = "parentCategory", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    Category toEntity(CategoryDTO categoryDTO);

    List<Category> toEntity(List<CategoryDTO> dtoList);

    List<CategoryDTO> toDto(List<Category> entityList);

    @Named("partialUpdate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget Category entity, CategoryDTO dto);
}
