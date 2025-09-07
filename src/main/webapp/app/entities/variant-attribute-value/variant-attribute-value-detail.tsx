import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './variant-attribute-value.reducer';

export const VariantAttributeValueDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const variantAttributeValueEntity = useAppSelector(state => state.variantAttributeValue.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="variantAttributeValueDetailsHeading">
          <Translate contentKey="fShopApp.variantAttributeValue.detail.title">VariantAttributeValue</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{variantAttributeValueEntity.id}</dd>
          <dt>
            <Translate contentKey="fShopApp.variantAttributeValue.variant">Variant</Translate>
          </dt>
          <dd>{variantAttributeValueEntity.variant ? variantAttributeValueEntity.variant.sku : ''}</dd>
          <dt>
            <Translate contentKey="fShopApp.variantAttributeValue.attributeValue">Attribute Value</Translate>
          </dt>
          <dd>{variantAttributeValueEntity.attributeValue ? variantAttributeValueEntity.attributeValue.value : ''}</dd>
        </dl>
        <Button tag={Link} to="/variant-attribute-value" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/variant-attribute-value/${variantAttributeValueEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default VariantAttributeValueDetail;
