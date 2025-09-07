import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product-review.reducer';

export const ProductReviewDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productReviewEntity = useAppSelector(state => state.productReview.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productReviewDetailsHeading">
          <Translate contentKey="fShopApp.productReview.detail.title">ProductReview</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productReviewEntity.id}</dd>
          <dt>
            <span id="rating">
              <Translate contentKey="fShopApp.productReview.rating">Rating</Translate>
            </span>
          </dt>
          <dd>{productReviewEntity.rating}</dd>
          <dt>
            <span id="comment">
              <Translate contentKey="fShopApp.productReview.comment">Comment</Translate>
            </span>
          </dt>
          <dd>{productReviewEntity.comment}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="fShopApp.productReview.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {productReviewEntity.createdAt ? (
              <TextFormat value={productReviewEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="fShopApp.productReview.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {productReviewEntity.updatedAt ? (
              <TextFormat value={productReviewEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="fShopApp.productReview.product">Product</Translate>
          </dt>
          <dd>{productReviewEntity.product ? productReviewEntity.product.name : ''}</dd>
          <dt>
            <Translate contentKey="fShopApp.productReview.user">User</Translate>
          </dt>
          <dd>{productReviewEntity.user ? productReviewEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/product-review" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product-review/${productReviewEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductReviewDetail;
