package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.PaymentTestSamples.*;
import static com.quattrinh.shop.domain.ShopOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShopOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShopOrder.class);
        ShopOrder shopOrder1 = getShopOrderSample1();
        ShopOrder shopOrder2 = new ShopOrder();
        assertThat(shopOrder1).isNotEqualTo(shopOrder2);

        shopOrder2.setId(shopOrder1.getId());
        assertThat(shopOrder1).isEqualTo(shopOrder2);

        shopOrder2 = getShopOrderSample2();
        assertThat(shopOrder1).isNotEqualTo(shopOrder2);
    }

    @Test
    void paymentTest() {
        ShopOrder shopOrder = getShopOrderRandomSampleGenerator();
        Payment paymentBack = getPaymentRandomSampleGenerator();

        shopOrder.setPayment(paymentBack);
        assertThat(shopOrder.getPayment()).isEqualTo(paymentBack);
        assertThat(paymentBack.getOrder()).isEqualTo(shopOrder);

        shopOrder.payment(null);
        assertThat(shopOrder.getPayment()).isNull();
        assertThat(paymentBack.getOrder()).isNull();
    }
}
