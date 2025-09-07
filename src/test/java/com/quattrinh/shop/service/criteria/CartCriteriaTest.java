package com.quattrinh.shop.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class CartCriteriaTest {

    @Test
    void newCartCriteriaHasAllFiltersNullTest() {
        var cartCriteria = new CartCriteria();
        assertThat(cartCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void cartCriteriaFluentMethodsCreatesFiltersTest() {
        var cartCriteria = new CartCriteria();

        setAllFilters(cartCriteria);

        assertThat(cartCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void cartCriteriaCopyCreatesNullFilterTest() {
        var cartCriteria = new CartCriteria();
        var copy = cartCriteria.copy();

        assertThat(cartCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(cartCriteria)
        );
    }

    @Test
    void cartCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var cartCriteria = new CartCriteria();
        setAllFilters(cartCriteria);

        var copy = cartCriteria.copy();

        assertThat(cartCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(cartCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var cartCriteria = new CartCriteria();

        assertThat(cartCriteria).hasToString("CartCriteria{}");
    }

    private static void setAllFilters(CartCriteria cartCriteria) {
        cartCriteria.id();
        cartCriteria.createdAt();
        cartCriteria.updatedAt();
        cartCriteria.userId();
        cartCriteria.distinct();
    }

    private static Condition<CartCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt()) &&
                condition.apply(criteria.getUserId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<CartCriteria> copyFiltersAre(CartCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getCreatedAt(), copy.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt(), copy.getUpdatedAt()) &&
                condition.apply(criteria.getUserId(), copy.getUserId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
