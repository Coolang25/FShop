package com.quattrinh.shop.service.mapper;

import static com.quattrinh.shop.domain.ChatbotLogAsserts.*;
import static com.quattrinh.shop.domain.ChatbotLogTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ChatbotLogMapperTest {

    private ChatbotLogMapper chatbotLogMapper;

    @BeforeEach
    void setUp() {
        chatbotLogMapper = new ChatbotLogMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getChatbotLogSample1();
        var actual = chatbotLogMapper.toEntity(chatbotLogMapper.toDto(expected));
        assertChatbotLogAllPropertiesEquals(expected, actual);
    }
}
