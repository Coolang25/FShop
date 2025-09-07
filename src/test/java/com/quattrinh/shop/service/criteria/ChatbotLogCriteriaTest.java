package com.quattrinh.shop.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class ChatbotLogCriteriaTest {

    @Test
    void newChatbotLogCriteriaHasAllFiltersNullTest() {
        var chatbotLogCriteria = new ChatbotLogCriteria();
        assertThat(chatbotLogCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void chatbotLogCriteriaFluentMethodsCreatesFiltersTest() {
        var chatbotLogCriteria = new ChatbotLogCriteria();

        setAllFilters(chatbotLogCriteria);

        assertThat(chatbotLogCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void chatbotLogCriteriaCopyCreatesNullFilterTest() {
        var chatbotLogCriteria = new ChatbotLogCriteria();
        var copy = chatbotLogCriteria.copy();

        assertThat(chatbotLogCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(chatbotLogCriteria)
        );
    }

    @Test
    void chatbotLogCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var chatbotLogCriteria = new ChatbotLogCriteria();
        setAllFilters(chatbotLogCriteria);

        var copy = chatbotLogCriteria.copy();

        assertThat(chatbotLogCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(chatbotLogCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var chatbotLogCriteria = new ChatbotLogCriteria();

        assertThat(chatbotLogCriteria).hasToString("ChatbotLogCriteria{}");
    }

    private static void setAllFilters(ChatbotLogCriteria chatbotLogCriteria) {
        chatbotLogCriteria.id();
        chatbotLogCriteria.createdAt();
        chatbotLogCriteria.userId();
        chatbotLogCriteria.distinct();
    }

    private static Condition<ChatbotLogCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getCreatedAt()) &&
                condition.apply(criteria.getUserId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<ChatbotLogCriteria> copyFiltersAre(ChatbotLogCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getCreatedAt(), copy.getCreatedAt()) &&
                condition.apply(criteria.getUserId(), copy.getUserId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
