//package com.quattrinh.shop.service.mapper;
//
//import static com.quattrinh.shop.domain.VariantAttributeValueAsserts.*;
//import static com.quattrinh.shop.domain.VariantAttributeValueTestSamples.*;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//
//class VariantAttributeValueMapperTest {
//
//    private VariantAttributeValueMapper variantAttributeValueMapper;
//
//    @BeforeEach
//    void setUp() {
//        variantAttributeValueMapper = new VariantAttributeValueMapperImpl();
//    }
//
//    @Test
//    void shouldConvertToDtoAndBack() {
//        var expected = getVariantAttributeValueSample1();
//        var actual = variantAttributeValueMapper.toEntity(variantAttributeValueMapper.toDto(expected));
//        assertVariantAttributeValueAllPropertiesEquals(expected, actual);
//    }
//}
