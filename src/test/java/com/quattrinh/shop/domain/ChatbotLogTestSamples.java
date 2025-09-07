package com.quattrinh.shop.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ChatbotLogTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ChatbotLog getChatbotLogSample1() {
        return new ChatbotLog().id(1L);
    }

    public static ChatbotLog getChatbotLogSample2() {
        return new ChatbotLog().id(2L);
    }

    public static ChatbotLog getChatbotLogRandomSampleGenerator() {
        return new ChatbotLog().id(longCount.incrementAndGet());
    }
}
