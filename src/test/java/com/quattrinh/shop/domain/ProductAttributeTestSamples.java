package com.quattrinh.shop.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProductAttributeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ProductAttribute getProductAttributeSample1() {
        return new ProductAttribute().id(1L).name("name1");
    }

    public static ProductAttribute getProductAttributeSample2() {
        return new ProductAttribute().id(2L).name("name2");
    }

    public static ProductAttribute getProductAttributeRandomSampleGenerator() {
        return new ProductAttribute().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString());
    }
}
