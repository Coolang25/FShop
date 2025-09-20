import BillingDetails from 'app/shared/layout/checkout/billing-detail';
import OrderSummary from 'app/shared/layout/checkout/order-summary';
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Checkout: React.FC = () => {
  return (
    <section className="checkout spad">
      <Container>
        <Row>
          <Col lg={12}>
            <h6 className="coupon__link">
              <span className="icon_tag_alt"></span> <a href="#">Have a coupon?</a> Click here to enter your code.
            </h6>
          </Col>
        </Row>
        <Form className="checkout__form">
          <Row>
            <Col lg={8}>
              <BillingDetails />
            </Col>
            <Col lg={4}>
              <OrderSummary />
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
};

export default Checkout;
