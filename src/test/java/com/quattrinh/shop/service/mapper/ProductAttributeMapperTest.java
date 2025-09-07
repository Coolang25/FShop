package com.quattrinh.shop.service.mapper;

import static com.quattrinh.shop.domain.ProductAttributeAsserts.*;
import static com.quattrinh.shop.domain.ProductAttributeTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProductAttributeMapperTest {

    private ProductAttributeMapper productAttributeMapper;

    @BeforeEach
    void setUp() {
        productAttributeMapper = new ProductAttributeMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProductAttributeSample1();
        var actual = productAttributeMapper.toEntity(productAttributeMapper.toDto(expected));
        assertProductAttributeAllPropertiesEquals(expected, actual);
    }
}
