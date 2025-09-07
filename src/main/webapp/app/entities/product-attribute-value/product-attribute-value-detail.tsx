import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product-attribute-value.reducer';

export const ProductAttributeValueDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productAttributeValueEntity = useAppSelector(state => state.productAttributeValue.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productAttributeValueDetailsHeading">
          <Translate contentKey="fShopApp.productAttributeValue.detail.title">ProductAttributeValue</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productAttributeValueEntity.id}</dd>
          <dt>
            <span id="value">
              <Translate contentKey="fShopApp.productAttributeValue.value">Value</Translate>
            </span>
          </dt>
          <dd>{productAttributeValueEntity.value}</dd>
          <dt>
            <Translate contentKey="fShopApp.productAttributeValue.attribute">Attribute</Translate>
          </dt>
          <dd>{productAttributeValueEntity.attribute ? productAttributeValueEntity.attribute.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/product-attribute-value" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product-attribute-value/${productAttributeValueEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductAttributeValueDetail;
