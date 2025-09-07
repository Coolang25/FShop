package com.quattrinh.shop.domain;

import static com.quattrinh.shop.domain.ChatbotLogTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChatbotLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChatbotLog.class);
        ChatbotLog chatbotLog1 = getChatbotLogSample1();
        ChatbotLog chatbotLog2 = new ChatbotLog();
        assertThat(chatbotLog1).isNotEqualTo(chatbotLog2);

        chatbotLog2.setId(chatbotLog1.getId());
        assertThat(chatbotLog1).isEqualTo(chatbotLog2);

        chatbotLog2 = getChatbotLogSample2();
        assertThat(chatbotLog1).isNotEqualTo(chatbotLog2);
    }
}
