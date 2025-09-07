package com.quattrinh.shop.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class ProductAttributeValueCriteriaTest {

    @Test
    void newProductAttributeValueCriteriaHasAllFiltersNullTest() {
        var productAttributeValueCriteria = new ProductAttributeValueCriteria();
        assertThat(productAttributeValueCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void productAttributeValueCriteriaFluentMethodsCreatesFiltersTest() {
        var productAttributeValueCriteria = new ProductAttributeValueCriteria();

        setAllFilters(productAttributeValueCriteria);

        assertThat(productAttributeValueCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void productAttributeValueCriteriaCopyCreatesNullFilterTest() {
        var productAttributeValueCriteria = new ProductAttributeValueCriteria();
        var copy = productAttributeValueCriteria.copy();

        assertThat(productAttributeValueCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(productAttributeValueCriteria)
        );
    }

    @Test
    void productAttributeValueCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var productAttributeValueCriteria = new ProductAttributeValueCriteria();
        setAllFilters(productAttributeValueCriteria);

        var copy = productAttributeValueCriteria.copy();

        assertThat(productAttributeValueCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(productAttributeValueCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var productAttributeValueCriteria = new ProductAttributeValueCriteria();

        assertThat(productAttributeValueCriteria).hasToString("ProductAttributeValueCriteria{}");
    }

    private static void setAllFilters(ProductAttributeValueCriteria productAttributeValueCriteria) {
        productAttributeValueCriteria.id();
        productAttributeValueCriteria.value();
        productAttributeValueCriteria.attributeId();
        productAttributeValueCriteria.distinct();
    }

    private static Condition<ProductAttributeValueCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getValue()) &&
                condition.apply(criteria.getAttributeId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<ProductAttributeValueCriteria> copyFiltersAre(
        ProductAttributeValueCriteria copy,
        BiFunction<Object, Object, Boolean> condition
    ) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getValue(), copy.getValue()) &&
                condition.apply(criteria.getAttributeId(), copy.getAttributeId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
