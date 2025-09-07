import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product-image.reducer';

export const ProductImageDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productImageEntity = useAppSelector(state => state.productImage.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productImageDetailsHeading">
          <Translate contentKey="fShopApp.productImage.detail.title">ProductImage</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productImageEntity.id}</dd>
          <dt>
            <span id="url">
              <Translate contentKey="fShopApp.productImage.url">Url</Translate>
            </span>
          </dt>
          <dd>{productImageEntity.url}</dd>
          <dt>
            <span id="isMain">
              <Translate contentKey="fShopApp.productImage.isMain">Is Main</Translate>
            </span>
          </dt>
          <dd>{productImageEntity.isMain ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="fShopApp.productImage.product">Product</Translate>
          </dt>
          <dd>{productImageEntity.product ? productImageEntity.product.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/product-image" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product-image/${productImageEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductImageDetail;
