package com.quattrinh.shop.service.mapper;

import static com.quattrinh.shop.domain.ProductReviewAsserts.*;
import static com.quattrinh.shop.domain.ProductReviewTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProductReviewMapperTest {

    private ProductReviewMapper productReviewMapper;

    @BeforeEach
    void setUp() {
        productReviewMapper = new ProductReviewMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getProductReviewSample1();
        var actual = productReviewMapper.toEntity(productReviewMapper.toDto(expected));
        assertProductReviewAllPropertiesEquals(expected, actual);
    }
}
