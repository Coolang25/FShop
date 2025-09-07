import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getProductVariants } from 'app/entities/product-variant/product-variant.reducer';
import { getEntities as getProductAttributeValues } from 'app/entities/product-attribute-value/product-attribute-value.reducer';
import { createEntity, getEntity, reset, updateEntity } from './variant-attribute-value.reducer';

export const VariantAttributeValueUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const productVariants = useAppSelector(state => state.productVariant.entities);
  const productAttributeValues = useAppSelector(state => state.productAttributeValue.entities);
  const variantAttributeValueEntity = useAppSelector(state => state.variantAttributeValue.entity);
  const loading = useAppSelector(state => state.variantAttributeValue.loading);
  const updating = useAppSelector(state => state.variantAttributeValue.updating);
  const updateSuccess = useAppSelector(state => state.variantAttributeValue.updateSuccess);

  const handleClose = () => {
    navigate(`/variant-attribute-value${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getProductVariants({}));
    dispatch(getProductAttributeValues({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...variantAttributeValueEntity,
      ...values,
      variant: productVariants.find(it => it.id.toString() === values.variant?.toString()),
      attributeValue: productAttributeValues.find(it => it.id.toString() === values.attributeValue?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...variantAttributeValueEntity,
          variant: variantAttributeValueEntity?.variant?.id,
          attributeValue: variantAttributeValueEntity?.attributeValue?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="fShopApp.variantAttributeValue.home.createOrEditLabel" data-cy="VariantAttributeValueCreateUpdateHeading">
            <Translate contentKey="fShopApp.variantAttributeValue.home.createOrEditLabel">Create or edit a VariantAttributeValue</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="variant-attribute-value-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="variant-attribute-value-variant"
                name="variant"
                data-cy="variant"
                label={translate('fShopApp.variantAttributeValue.variant')}
                type="select"
              >
                <option value="" key="0" />
                {productVariants
                  ? productVariants.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.sku}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="variant-attribute-value-attributeValue"
                name="attributeValue"
                data-cy="attributeValue"
                label={translate('fShopApp.variantAttributeValue.attributeValue')}
                type="select"
              >
                <option value="" key="0" />
                {productAttributeValues
                  ? productAttributeValues.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.value}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/variant-attribute-value" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default VariantAttributeValueUpdate;
