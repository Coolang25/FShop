package com.quattrinh.shop.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.quattrinh.shop.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChatbotLogDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChatbotLogDTO.class);
        ChatbotLogDTO chatbotLogDTO1 = new ChatbotLogDTO();
        chatbotLogDTO1.setId(1L);
        ChatbotLogDTO chatbotLogDTO2 = new ChatbotLogDTO();
        assertThat(chatbotLogDTO1).isNotEqualTo(chatbotLogDTO2);
        chatbotLogDTO2.setId(chatbotLogDTO1.getId());
        assertThat(chatbotLogDTO1).isEqualTo(chatbotLogDTO2);
        chatbotLogDTO2.setId(2L);
        assertThat(chatbotLogDTO1).isNotEqualTo(chatbotLogDTO2);
        chatbotLogDTO1.setId(null);
        assertThat(chatbotLogDTO1).isNotEqualTo(chatbotLogDTO2);
    }
}
