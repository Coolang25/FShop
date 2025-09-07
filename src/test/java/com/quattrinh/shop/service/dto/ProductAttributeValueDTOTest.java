package com.quattrinh.shop.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductAttributeValueDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductAttributeValueDTO.class);
        ProductAttributeValueDTO productAttributeValueDTO1 = new ProductAttributeValueDTO();
        productAttributeValueDTO1.setId(1L);
        ProductAttributeValueDTO productAttributeValueDTO2 = new ProductAttributeValueDTO();
        assertThat(productAttributeValueDTO1).isNotEqualTo(productAttributeValueDTO2);
        productAttributeValueDTO2.setId(productAttributeValueDTO1.getId());
        assertThat(productAttributeValueDTO1).isEqualTo(productAttributeValueDTO2);
        productAttributeValueDTO2.setId(2L);
        assertThat(productAttributeValueDTO1).isNotEqualTo(productAttributeValueDTO2);
        productAttributeValueDTO1.setId(null);
        assertThat(productAttributeValueDTO1).isNotEqualTo(productAttributeValueDTO2);
    }
}
