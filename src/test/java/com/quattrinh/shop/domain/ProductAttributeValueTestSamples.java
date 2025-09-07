package com.quattrinh.shop.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProductAttributeValueTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProductAttributeValue getProductAttributeValueSample1() {
        return new ProductAttributeValue().id(1L).value("value1");
    }

    public static ProductAttributeValue getProductAttributeValueSample2() {
        return new ProductAttributeValue().id(2L).value("value2");
    }

    public static ProductAttributeValue getProductAttributeValueRandomSampleGenerator() {
        return new ProductAttributeValue().id(longCount.incrementAndGet()).value(UUID.randomUUID().toString());
    }
}
