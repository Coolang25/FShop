import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getCarts } from 'app/entities/cart/cart.reducer';
import { getEntities as getProductVariants } from 'app/entities/product-variant/product-variant.reducer';
import { createEntity, getEntity, reset, updateEntity } from './cart-item.reducer';

export const CartItemUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const carts = useAppSelector(state => state.cart.entities);
  const productVariants = useAppSelector(state => state.productVariant.entities);
  const cartItemEntity = useAppSelector(state => state.cartItem.entity);
  const loading = useAppSelector(state => state.cartItem.loading);
  const updating = useAppSelector(state => state.cartItem.updating);
  const updateSuccess = useAppSelector(state => state.cartItem.updateSuccess);

  const handleClose = () => {
    navigate(`/cart-item${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getCarts({}));
    dispatch(getProductVariants({}));
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
    if (values.quantity !== undefined && typeof values.quantity !== 'number') {
      values.quantity = Number(values.quantity);
    }
    if (values.price !== undefined && typeof values.price !== 'number') {
      values.price = Number(values.price);
    }

    const entity = {
      ...cartItemEntity,
      ...values,
      cart: carts.find(it => it.id.toString() === values.cart?.toString()),
      variant: productVariants.find(it => it.id.toString() === values.variant?.toString()),
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
          ...cartItemEntity,
          cart: cartItemEntity?.cart?.id,
          variant: cartItemEntity?.variant?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="fShopApp.cartItem.home.createOrEditLabel" data-cy="CartItemCreateUpdateHeading">
            <Translate contentKey="fShopApp.cartItem.home.createOrEditLabel">Create or edit a CartItem</Translate>
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
                  id="cart-item-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('fShopApp.cartItem.quantity')}
                id="cart-item-quantity"
                name="quantity"
                data-cy="quantity"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  min: { value: 1, message: translate('entity.validation.min', { min: 1 }) },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('fShopApp.cartItem.price')}
                id="cart-item-price"
                name="price"
                data-cy="price"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField id="cart-item-cart" name="cart" data-cy="cart" label={translate('fShopApp.cartItem.cart')} type="select">
                <option value="" key="0" />
                {carts
                  ? carts.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="cart-item-variant"
                name="variant"
                data-cy="variant"
                label={translate('fShopApp.cartItem.variant')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/cart-item" replace color="info">
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

export default CartItemUpdate;
