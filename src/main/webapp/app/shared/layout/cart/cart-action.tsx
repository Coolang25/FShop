import React from 'react';
import { Col, Row } from 'react-bootstrap';

const CartActions: React.FC = () => {
  return (
    <Row>
      <Col lg={6} md={6} sm={6}>
        <div className="cart__btn">
          <a href="#">Continue Shopping</a>
        </div>
      </Col>
      <Col lg={6} md={6} sm={6}>
        <div className="cart__btn update__btn">
          <a href="#">
            <span className="icon_loading"></span> Update cart
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default CartActions;
