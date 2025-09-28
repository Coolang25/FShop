package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.Category;
import com.quattrinh.shop.domain.Product;
import com.quattrinh.shop.domain.ProductVariant;
import com.quattrinh.shop.repository.CategoryRepository;
import com.quattrinh.shop.service.dto.CategoryDTO;
import com.quattrinh.shop.service.dto.ProductDTO;
import com.quattrinh.shop.service.dto.ProductVariantDTO;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Mapper for the entity {@link Product} and its DTO {@link ProductDTO}.
 */
@Component
public class ProductMapper {

    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    public ProductDTO toDto(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBasePrice(product.getBasePrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setIsActive(product.getIsActive());

        // Map categories
        Set<CategoryDTO> categoryDTOs = new HashSet<>();
        if (product.getCategories() != null) {
            for (Category category : product.getCategories()) {
                CategoryDTO categoryDTO = new CategoryDTO();
                categoryDTO.setId(category.getId());
                categoryDTO.setName(category.getName());
                categoryDTOs.add(categoryDTO);
            }
        }
        dto.setCategories(categoryDTOs);

        // Map variants using ProductVariantMapper
        Set<ProductVariantDTO> variantDTOs = new HashSet<>();
        if (product.getVariants() != null) {
            for (ProductVariant variant : product.getVariants()) {
                variantDTOs.add(productVariantMapper.toDtoVariant(variant));
            }
        }
        dto.setVariants(variantDTOs);

        return dto;
    }

    public Product toEntity(ProductDTO productDTO) {
        if (productDTO == null) {
            return null;
        }

        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setBasePrice(productDTO.getBasePrice());
        product.setImageUrl(productDTO.getImageUrl());
        product.setIsActive(productDTO.getIsActive());

        // Map categories
        Set<Category> categories = new HashSet<>();
        if (productDTO.getCategories() != null) {
            for (CategoryDTO categoryDTO : productDTO.getCategories()) {
                if (categoryDTO.getId() != null) {
                    categoryRepository.findById(categoryDTO.getId()).ifPresent(categories::add);
                }
            }
        }
        product.setCategories(categories);

        return product;
    }

    public List<ProductDTO> toDto(List<Product> products) {
        return products.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<Product> toEntity(List<ProductDTO> productDTOs) {
        return productDTOs.stream().map(this::toEntity).collect(Collectors.toList());
    }

    public Product partialUpdate(Product product, ProductDTO productDTO) {
        if (productDTO == null) {
            return product;
        }

        if (productDTO.getId() != null) {
            product.setId(productDTO.getId());
        }
        if (productDTO.getName() != null) {
            product.setName(productDTO.getName());
        }
        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }
        if (productDTO.getBasePrice() != null) {
            product.setBasePrice(productDTO.getBasePrice());
        }
        if (productDTO.getImageUrl() != null) {
            product.setImageUrl(productDTO.getImageUrl());
        }
        if (productDTO.getIsActive() != null) {
            product.setIsActive(productDTO.getIsActive());
        }
        if (productDTO.getCategories() != null) {
            // Map categories
            Set<Category> categories = new HashSet<>();
            for (CategoryDTO categoryDTO : productDTO.getCategories()) {
                if (categoryDTO.getId() != null) {
                    categoryRepository.findById(categoryDTO.getId()).ifPresent(categories::add);
                }
            }
            product.setCategories(categories);
        }

        return product;
    }
}
