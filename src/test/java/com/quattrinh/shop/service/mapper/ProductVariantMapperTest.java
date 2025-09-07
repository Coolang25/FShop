package com.quattrinh.shop.service.mapper;

import static com.quattrinh.shop.domain.ProductVariantAsserts.*;
import static com.quattrinh.shop.domain.ProductVariantTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProductVariantMapperTest {

    private ProductVariantMapper productVariantMapper;

    @BeforeEach
    void setUp() {
        productVariantMapper = new ProductVariantMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProductVariantSample1();
        var actual = productVariantMapper.toEntity(productVariantMapper.toDto(expected));
        assertProductVariantAllPropertiesEquals(expected, actual);
    }
}
