package com.quattrinh.shop.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.quattrinh.shop.domain.ChatbotLog} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChatbotLogDTO implements Serializable {

    private Long id;

    @Lob
    private String question;

    @Lob
    private String answer;

    private Instant createdAt;

    private UserDTO user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChatbotLogDTO)) {
            return false;
        }

        ChatbotLogDTO chatbotLogDTO = (ChatbotLogDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, chatbotLogDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChatbotLogDTO{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
