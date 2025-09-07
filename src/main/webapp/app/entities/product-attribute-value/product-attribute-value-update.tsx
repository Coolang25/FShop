import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getProductAttributes } from 'app/entities/product-attribute/product-attribute.reducer';
import { createEntity, getEntity, reset, updateEntity } from './product-attribute-value.reducer';

export const ProductAttributeValueUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const productAttributes = useAppSelector(state => state.productAttribute.entities);
  const productAttributeValueEntity = useAppSelector(state => state.productAttributeValue.entity);
  const loading = useAppSelector(state => state.productAttributeValue.loading);
  const updating = useAppSelector(state => state.productAttributeValue.updating);
  const updateSuccess = useAppSelector(state => state.productAttributeValue.updateSuccess);

  const handleClose = () => {
    navigate(`/product-attribute-value${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getProductAttributes({}));
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
      ...productAttributeValueEntity,
      ...values,
      attribute: productAttributes.find(it => it.id.toString() === values.attribute?.toString()),
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
          ...productAttributeValueEntity,
          attribute: productAttributeValueEntity?.attribute?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="fShopApp.productAttributeValue.home.createOrEditLabel" data-cy="ProductAttributeValueCreateUpdateHeading">
            <Translate contentKey="fShopApp.productAttributeValue.home.createOrEditLabel">Create or edit a ProductAttributeValue</Translate>
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
                  id="product-attribute-value-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('fShopApp.productAttributeValue.value')}
                id="product-attribute-value-value"
                name="value"
                data-cy="value"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                }}
              />
              <ValidatedField
                id="product-attribute-value-attribute"
                name="attribute"
                data-cy="attribute"
                label={translate('fShopApp.productAttributeValue.attribute')}
                type="select"
              >
                <option value="" key="0" />
                {productAttributes
                  ? productAttributes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/product-attribute-value" replace color="info">
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

export default ProductAttributeValueUpdate;
