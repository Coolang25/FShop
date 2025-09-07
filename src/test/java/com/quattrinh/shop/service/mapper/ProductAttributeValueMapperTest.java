package com.quattrinh.shop.service.mapper;

import static com.quattrinh.shop.domain.ProductAttributeValueAsserts.*;
import static com.quattrinh.shop.domain.ProductAttributeValueTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProductAttributeValueMapperTest {

    private ProductAttributeValueMapper productAttributeValueMapper;

    @BeforeEach
    void setUp() {
        productAttributeValueMapper = new ProductAttributeValueMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProductAttributeValueSample1();
        var actual = productAttributeValueMapper.toEntity(productAttributeValueMapper.toDto(expected));
        assertProductAttributeValueAllPropertiesEquals(expected, actual);
    }
}
