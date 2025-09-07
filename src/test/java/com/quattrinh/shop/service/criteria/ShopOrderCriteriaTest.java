package com.quattrinh.shop.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class ShopOrderCriteriaTest {

    @Test
    void newShopOrderCriteriaHasAllFiltersNullTest() {
        var shopOrderCriteria = new ShopOrderCriteria();
        assertThat(shopOrderCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void shopOrderCriteriaFluentMethodsCreatesFiltersTest() {
        var shopOrderCriteria = new ShopOrderCriteria();

        setAllFilters(shopOrderCriteria);

        assertThat(shopOrderCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void shopOrderCriteriaCopyCreatesNullFilterTest() {
        var shopOrderCriteria = new ShopOrderCriteria();
        var copy = shopOrderCriteria.copy();

        assertThat(shopOrderCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(shopOrderCriteria)
        );
    }

    @Test
    void shopOrderCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var shopOrderCriteria = new ShopOrderCriteria();
        setAllFilters(shopOrderCriteria);

        var copy = shopOrderCriteria.copy();

        assertThat(shopOrderCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(shopOrderCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var shopOrderCriteria = new ShopOrderCriteria();

        assertThat(shopOrderCriteria).hasToString("ShopOrderCriteria{}");
    }

    private static void setAllFilters(ShopOrderCriteria shopOrderCriteria) {
        shopOrderCriteria.id();
        shopOrderCriteria.status();
        shopOrderCriteria.total();
        shopOrderCriteria.shippingAddress();
        shopOrderCriteria.createdAt();
        shopOrderCriteria.updatedAt();
        shopOrderCriteria.userId();
        shopOrderCriteria.paymentId();
        shopOrderCriteria.distinct();
    }

    private static Condition<ShopOrderCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getStatus()) &&
                condition.apply(criteria.getTotal()) &&
                condition.apply(criteria.getShippingAddress()) &&
                condition.apply(criteria.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt()) &&
                condition.apply(criteria.getUserId()) &&
                condition.apply(criteria.getPaymentId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<ShopOrderCriteria> copyFiltersAre(ShopOrderCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getStatus(), copy.getStatus()) &&
                condition.apply(criteria.getTotal(), copy.getTotal()) &&
                condition.apply(criteria.getShippingAddress(), copy.getShippingAddress()) &&
                condition.apply(criteria.getCreatedAt(), copy.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt(), copy.getUpdatedAt()) &&
                condition.apply(criteria.getUserId(), copy.getUserId()) &&
                condition.apply(criteria.getPaymentId(), copy.getPaymentId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
