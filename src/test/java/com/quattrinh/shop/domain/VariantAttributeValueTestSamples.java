//package com.quattrinh.shop.domain;
//
//import java.util.Random;
//import java.util.concurrent.atomic.AtomicLong;
//
//public class VariantAttributeValueTestSamples {
//
//    private static final Random random = new Random();
//    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
//
//    public static VariantAttributeValue getVariantAttributeValueSample1() {
//        return new VariantAttributeValue().id(1L);
//    }
//
//    public static VariantAttributeValue getVariantAttributeValueSample2() {
//        return new VariantAttributeValue().id(2L);
//    }
//
//    public static VariantAttributeValue getVariantAttributeValueRandomSampleGenerator() {
//        return new VariantAttributeValue().id(longCount.incrementAndGet());
//    }
//}
