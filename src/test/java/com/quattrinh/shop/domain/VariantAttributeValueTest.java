package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.ProductAttributeValueTestSamples.*;
import static com.quattrinh.shop.domain.ProductVariantTestSamples.*;
import static com.quattrinh.shop.domain.VariantAttributeValueTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VariantAttributeValueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VariantAttributeValue.class);
        VariantAttributeValue variantAttributeValue1 = getVariantAttributeValueSample1();
        VariantAttributeValue variantAttributeValue2 = new VariantAttributeValue();
        assertThat(variantAttributeValue1).isNotEqualTo(variantAttributeValue2);

        variantAttributeValue2.setId(variantAttributeValue1.getId());
        assertThat(variantAttributeValue1).isEqualTo(variantAttributeValue2);

        variantAttributeValue2 = getVariantAttributeValueSample2();
        assertThat(variantAttributeValue1).isNotEqualTo(variantAttributeValue2);
    }

    @Test
    void variantTest() {
        VariantAttributeValue variantAttributeValue = getVariantAttributeValueRandomSampleGenerator();
        ProductVariant productVariantBack = getProductVariantRandomSampleGenerator();

        variantAttributeValue.setVariant(productVariantBack);
        assertThat(variantAttributeValue.getVariant()).isEqualTo(productVariantBack);

        variantAttributeValue.variant(null);
        assertThat(variantAttributeValue.getVariant()).isNull();
    }

    @Test
    void attributeValueTest() {
        VariantAttributeValue variantAttributeValue = getVariantAttributeValueRandomSampleGenerator();
        ProductAttributeValue productAttributeValueBack = getProductAttributeValueRandomSampleGenerator();

        variantAttributeValue.setAttributeValue(productAttributeValueBack);
        assertThat(variantAttributeValue.getAttributeValue()).isEqualTo(productAttributeValueBack);

        variantAttributeValue.attributeValue(null);
        assertThat(variantAttributeValue.getAttributeValue()).isNull();
    }
}
