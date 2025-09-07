package com.quattrinh.shop.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ShopOrderTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ShopOrder getShopOrderSample1() {
        return new ShopOrder().id(1L).shippingAddress("shippingAddress1");
    }

    public static ShopOrder getShopOrderSample2() {
        return new ShopOrder().id(2L).shippingAddress("shippingAddress2");
    }

    public static ShopOrder getShopOrderRandomSampleGenerator() {
        return new ShopOrder().id(longCount.incrementAndGet()).shippingAddress(UUID.randomUUID().toString());
    }
}
