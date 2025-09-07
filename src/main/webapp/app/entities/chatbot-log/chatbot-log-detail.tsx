import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './chatbot-log.reducer';

export const ChatbotLogDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const chatbotLogEntity = useAppSelector(state => state.chatbotLog.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="chatbotLogDetailsHeading">
          <Translate contentKey="fShopApp.chatbotLog.detail.title">ChatbotLog</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{chatbotLogEntity.id}</dd>
          <dt>
            <span id="question">
              <Translate contentKey="fShopApp.chatbotLog.question">Question</Translate>
            </span>
          </dt>
          <dd>{chatbotLogEntity.question}</dd>
          <dt>
            <span id="answer">
              <Translate contentKey="fShopApp.chatbotLog.answer">Answer</Translate>
            </span>
          </dt>
          <dd>{chatbotLogEntity.answer}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="fShopApp.chatbotLog.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {chatbotLogEntity.createdAt ? <TextFormat value={chatbotLogEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="fShopApp.chatbotLog.user">User</Translate>
          </dt>
          <dd>{chatbotLogEntity.user ? chatbotLogEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/chatbot-log" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/chatbot-log/${chatbotLogEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChatbotLogDetail;
