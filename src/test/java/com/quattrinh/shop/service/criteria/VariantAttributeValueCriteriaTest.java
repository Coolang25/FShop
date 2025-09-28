//package com.quattrinh.shop.service.criteria;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.util.function.BiFunction;
//import java.util.function.Function;
//import org.assertj.core.api.Condition;
//import org.junit.jupiter.api.Test;
//
//class VariantAttributeValueCriteriaTest {
//
//    @Test
//    void newVariantAttributeValueCriteriaHasAllFiltersNullTest() {
//        var variantAttributeValueCriteria = new VariantAttributeValueCriteria();
//        assertThat(variantAttributeValueCriteria).is(criteriaFiltersAre(filter -> filter == null));
//    }
//
//    @Test
//    void variantAttributeValueCriteriaFluentMethodsCreatesFiltersTest() {
//        var variantAttributeValueCriteria = new VariantAttributeValueCriteria();
//
//        setAllFilters(variantAttributeValueCriteria);
//
//        assertThat(variantAttributeValueCriteria).is(criteriaFiltersAre(filter -> filter != null));
//    }
//
//    @Test
//    void variantAttributeValueCriteriaCopyCreatesNullFilterTest() {
//        var variantAttributeValueCriteria = new VariantAttributeValueCriteria();
//        var copy = variantAttributeValueCriteria.copy();
//
//        assertThat(variantAttributeValueCriteria).satisfies(
//            criteria ->
//                assertThat(criteria).is(
//                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
//                ),
//            criteria -> assertThat(criteria).isEqualTo(copy),
//            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
//        );
//
//        assertThat(copy).satisfies(
//            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
//            criteria -> assertThat(criteria).isEqualTo(variantAttributeValueCriteria)
//        );
//    }
//
//    @Test
//    void variantAttributeValueCriteriaCopyDuplicatesEveryExistingFilterTest() {
//        var variantAttributeValueCriteria = new VariantAttributeValueCriteria();
//        setAllFilters(variantAttributeValueCriteria);
//
//        var copy = variantAttributeValueCriteria.copy();
//
//        assertThat(variantAttributeValueCriteria).satisfies(
//            criteria ->
//                assertThat(criteria).is(
//                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
//                ),
//            criteria -> assertThat(criteria).isEqualTo(copy),
//            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
//        );
//
//        assertThat(copy).satisfies(
//            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
//            criteria -> assertThat(criteria).isEqualTo(variantAttributeValueCriteria)
//        );
//    }
//
//    @Test
//    void toStringVerifier() {
//        var variantAttributeValueCriteria = new VariantAttributeValueCriteria();
//
//        assertThat(variantAttributeValueCriteria).hasToString("VariantAttributeValueCriteria{}");
//    }
//
//    private static void setAllFilters(VariantAttributeValueCriteria variantAttributeValueCriteria) {
//        variantAttributeValueCriteria.id();
//        variantAttributeValueCriteria.variantId();
//        variantAttributeValueCriteria.attributeValueId();
//        variantAttributeValueCriteria.distinct();
//    }
//
//    private static Condition<VariantAttributeValueCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
//        return new Condition<>(
//            criteria ->
//                condition.apply(criteria.getId()) &&
//                condition.apply(criteria.getVariantId()) &&
//                condition.apply(criteria.getAttributeValueId()) &&
//                condition.apply(criteria.getDistinct()),
//            "every filter matches"
//        );
//    }
//
//    private static Condition<VariantAttributeValueCriteria> copyFiltersAre(
//        VariantAttributeValueCriteria copy,
//        BiFunction<Object, Object, Boolean> condition
//    ) {
//        return new Condition<>(
//            criteria ->
//                condition.apply(criteria.getId(), copy.getId()) &&
//                condition.apply(criteria.getVariantId(), copy.getVariantId()) &&
//                condition.apply(criteria.getAttributeValueId(), copy.getAttributeValueId()) &&
//                condition.apply(criteria.getDistinct(), copy.getDistinct()),
//            "every filter matches"
//        );
//    }
//}
