import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './shop-order.reducer';

export const ShopOrderDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const shopOrderEntity = useAppSelector(state => state.shopOrder.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="shopOrderDetailsHeading">
          <Translate contentKey="fShopApp.shopOrder.detail.title">ShopOrder</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{shopOrderEntity.id}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="fShopApp.shopOrder.status">Status</Translate>
            </span>
          </dt>
          <dd>{shopOrderEntity.status}</dd>
          <dt>
            <span id="total">
              <Translate contentKey="fShopApp.shopOrder.total">Total</Translate>
            </span>
          </dt>
          <dd>{shopOrderEntity.total}</dd>
          <dt>
            <span id="shippingAddress">
              <Translate contentKey="fShopApp.shopOrder.shippingAddress">Shipping Address</Translate>
            </span>
          </dt>
          <dd>{shopOrderEntity.shippingAddress}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="fShopApp.shopOrder.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {shopOrderEntity.createdAt ? <TextFormat value={shopOrderEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="fShopApp.shopOrder.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {shopOrderEntity.updatedAt ? <TextFormat value={shopOrderEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="fShopApp.shopOrder.user">User</Translate>
          </dt>
          <dd>{shopOrderEntity.user ? shopOrderEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/shop-order" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/shop-order/${shopOrderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ShopOrderDetail;
