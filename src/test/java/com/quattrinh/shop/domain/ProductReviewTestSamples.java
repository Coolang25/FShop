package com.quattrinh.shop.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProductReviewTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ProductReview getProductReviewSample1() {
        return new ProductReview().id(1L).rating(1);
    }

    public static ProductReview getProductReviewSample2() {
        return new ProductReview().id(2L).rating(2);
    }

    public static ProductReview getProductReviewRandomSampleGenerator() {
        return new ProductReview().id(longCount.incrementAndGet()).rating(intCount.incrementAndGet());
    }
}
