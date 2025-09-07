package com.quattrinh.shop.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VariantAttributeValueDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(VariantAttributeValueDTO.class);
        VariantAttributeValueDTO variantAttributeValueDTO1 = new VariantAttributeValueDTO();
        variantAttributeValueDTO1.setId(1L);
        VariantAttributeValueDTO variantAttributeValueDTO2 = new VariantAttributeValueDTO();
        assertThat(variantAttributeValueDTO1).isNotEqualTo(variantAttributeValueDTO2);
        variantAttributeValueDTO2.setId(variantAttributeValueDTO1.getId());
        assertThat(variantAttributeValueDTO1).isEqualTo(variantAttributeValueDTO2);
        variantAttributeValueDTO2.setId(2L);
        assertThat(variantAttributeValueDTO1).isNotEqualTo(variantAttributeValueDTO2);
        variantAttributeValueDTO1.setId(null);
        assertThat(variantAttributeValueDTO1).isNotEqualTo(variantAttributeValueDTO2);
    }
}
