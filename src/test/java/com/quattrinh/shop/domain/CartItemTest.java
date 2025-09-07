package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.CartItemTestSamples.*;
import static com.quattrinh.shop.domain.CartTestSamples.*;
import static com.quattrinh.shop.domain.ProductVariantTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CartItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CartItem.class);
        CartItem cartItem1 = getCartItemSample1();
        CartItem cartItem2 = new CartItem();
        assertThat(cartItem1).isNotEqualTo(cartItem2);

        cartItem2.setId(cartItem1.getId());
        assertThat(cartItem1).isEqualTo(cartItem2);

        cartItem2 = getCartItemSample2();
        assertThat(cartItem1).isNotEqualTo(cartItem2);
    }

    @Test
    void cartTest() {
        CartItem cartItem = getCartItemRandomSampleGenerator();
        Cart cartBack = getCartRandomSampleGenerator();

        cartItem.setCart(cartBack);
        assertThat(cartItem.getCart()).isEqualTo(cartBack);

        cartItem.cart(null);
        assertThat(cartItem.getCart()).isNull();
    }

    @Test
    void variantTest() {
        CartItem cartItem = getCartItemRandomSampleGenerator();
        ProductVariant productVariantBack = getProductVariantRandomSampleGenerator();

        cartItem.setVariant(productVariantBack);
        assertThat(cartItem.getVariant()).isEqualTo(productVariantBack);

        cartItem.variant(null);
        assertThat(cartItem.getVariant()).isNull();
    }
}
