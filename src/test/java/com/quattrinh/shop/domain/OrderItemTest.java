package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.OrderItemTestSamples.*;
import static com.quattrinh.shop.domain.ProductVariantTestSamples.*;
import static com.quattrinh.shop.domain.ShopOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderItem.class);
        OrderItem orderItem1 = getOrderItemSample1();
        OrderItem orderItem2 = new OrderItem();
        assertThat(orderItem1).isNotEqualTo(orderItem2);

        orderItem2.setId(orderItem1.getId());
        assertThat(orderItem1).isEqualTo(orderItem2);

        orderItem2 = getOrderItemSample2();
        assertThat(orderItem1).isNotEqualTo(orderItem2);
    }

    @Test
    void orderTest() {
        OrderItem orderItem = getOrderItemRandomSampleGenerator();
        ShopOrder shopOrderBack = getShopOrderRandomSampleGenerator();

        orderItem.setOrder(shopOrderBack);
        assertThat(orderItem.getOrder()).isEqualTo(shopOrderBack);

        orderItem.order(null);
        assertThat(orderItem.getOrder()).isNull();
    }

    @Test
    void variantTest() {
        OrderItem orderItem = getOrderItemRandomSampleGenerator();
        ProductVariant productVariantBack = getProductVariantRandomSampleGenerator();

        orderItem.setVariant(productVariantBack);
        assertThat(orderItem.getVariant()).isEqualTo(productVariantBack);

        orderItem.variant(null);
        assertThat(orderItem.getVariant()).isNull();
    }
}
