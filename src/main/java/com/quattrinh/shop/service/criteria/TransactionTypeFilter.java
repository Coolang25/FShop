package com.quattrinh.shop.service.criteria;

import com.quattrinh.shop.domain.enumeration.TransactionType;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import tech.jhipster.service.filter.Filter;

/**
 * Filter class for {@link TransactionType} type.
 * It can be used in following ways:
 * <code>
 * new TransactionTypeFilter().setEquals(TransactionType.IMPORT)
 * new TransactionTypeFilter().setIn(List.of(TransactionType.IMPORT, TransactionType.EXPORT))
 * </code>
 */
public class TransactionTypeFilter extends Filter<TransactionType> implements Serializable {

    private static final long serialVersionUID = 1L;

    public TransactionTypeFilter() {}

    public TransactionTypeFilter(TransactionTypeFilter filter) {
        super(filter);
    }

    @Override
    public TransactionTypeFilter copy() {
        return new TransactionTypeFilter(this);
    }

    public TransactionTypeFilter setEquals(TransactionType value) {
        super.setEquals(value);
        return this;
    }

    public TransactionTypeFilter setNotEquals(TransactionType value) {
        super.setNotEquals(value);
        return this;
    }

    public TransactionTypeFilter setIn(List<TransactionType> values) {
        super.setIn(values);
        return this;
    }

    public TransactionTypeFilter setNotIn(List<TransactionType> values) {
        super.setNotIn(values);
        return this;
    }

    public TransactionTypeFilter setSpecified(Boolean specified) {
        super.setSpecified(specified);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TransactionTypeFilter)) {
            return false;
        }
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode());
    }

    @Override
    public String toString() {
        return "TransactionTypeFilter{" + super.toString() + "}";
    }
}
