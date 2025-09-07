package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.ProductAttributeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductAttributeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductAttribute.class);
        ProductAttribute productAttribute1 = getProductAttributeSample1();
        ProductAttribute productAttribute2 = new ProductAttribute();
        assertThat(productAttribute1).isNotEqualTo(productAttribute2);

        productAttribute2.setId(productAttribute1.getId());
        assertThat(productAttribute1).isEqualTo(productAttribute2);

        productAttribute2 = getProductAttributeSample2();
        assertThat(productAttribute1).isNotEqualTo(productAttribute2);
    }
}
