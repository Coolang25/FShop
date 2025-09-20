import React from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

const CartSummary: React.FC = () => {
  return (
    <Row>
      <Col lg={6}>
        <div className="discount__content">
          <h6>Discount codes</h6>
          <Form>
            <Form.Control type="text" placeholder="Enter your coupon code" />
            <Button type="submit" className="site-btn mt-2">
              Apply
            </Button>
          </Form>
        </div>
      </Col>
      <Col lg={{ span: 4, offset: 2 }}>
        <div className="cart__total__procced">
          <h6>Cart total</h6>
          <ul>
            <li>
              Subtotal <span>$ 750.0</span>
            </li>
            <li>
              Total <span>$ 750.0</span>
            </li>
          </ul>
          <a href="#" className="primary-btn">
            Proceed to checkout
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default CartSummary;
