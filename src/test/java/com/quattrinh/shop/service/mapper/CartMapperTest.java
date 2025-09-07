package com.quattrinh.shop.service.mapper;

import static com.quattrinh.shop.domain.CartAsserts.*;
import static com.quattrinh.shop.domain.CartTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CartMapperTest {

    private CartMapper cartMapper;

    @BeforeEach
    void setUp() {
        cartMapper = new CartMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCartSample1();
        var actual = cartMapper.toEntity(cartMapper.toDto(expected));
        assertCartAllPropertiesEquals(expected, actual);
    }
}
