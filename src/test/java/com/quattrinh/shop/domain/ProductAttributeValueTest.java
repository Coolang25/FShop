package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.ProductAttributeTestSamples.*;
import static com.quattrinh.shop.domain.ProductAttributeValueTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductAttributeValueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductAttributeValue.class);
        ProductAttributeValue productAttributeValue1 = getProductAttributeValueSample1();
        ProductAttributeValue productAttributeValue2 = new ProductAttributeValue();
        assertThat(productAttributeValue1).isNotEqualTo(productAttributeValue2);

        productAttributeValue2.setId(productAttributeValue1.getId());
        assertThat(productAttributeValue1).isEqualTo(productAttributeValue2);

        productAttributeValue2 = getProductAttributeValueSample2();
        assertThat(productAttributeValue1).isNotEqualTo(productAttributeValue2);
    }

    @Test
    void attributeTest() {
        ProductAttributeValue productAttributeValue = getProductAttributeValueRandomSampleGenerator();
        ProductAttribute productAttributeBack = getProductAttributeRandomSampleGenerator();

        productAttributeValue.setAttribute(productAttributeBack);
        assertThat(productAttributeValue.getAttribute()).isEqualTo(productAttributeBack);

        productAttributeValue.attribute(null);
        assertThat(productAttributeValue.getAttribute()).isNull();
    }
}
