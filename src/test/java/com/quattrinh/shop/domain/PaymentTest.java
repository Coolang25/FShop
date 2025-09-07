package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.PaymentTestSamples.*;
import static com.quattrinh.shop.domain.ShopOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaymentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Payment.class);
        Payment payment1 = getPaymentSample1();
        Payment payment2 = new Payment();
        assertThat(payment1).isNotEqualTo(payment2);

        payment2.setId(payment1.getId());
        assertThat(payment1).isEqualTo(payment2);

        payment2 = getPaymentSample2();
        assertThat(payment1).isNotEqualTo(payment2);
    }

    @Test
    void orderTest() {
        Payment payment = getPaymentRandomSampleGenerator();
        ShopOrder shopOrderBack = getShopOrderRandomSampleGenerator();

        payment.setOrder(shopOrderBack);
        assertThat(payment.getOrder()).isEqualTo(shopOrderBack);

        payment.order(null);
        assertThat(payment.getOrder()).isNull();
    }
}
