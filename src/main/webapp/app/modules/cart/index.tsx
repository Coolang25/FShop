import CartActions from 'app/shared/layout/cart/cart-action';
import CartSummary from 'app/shared/layout/cart/cart-summary';
import CartTable from 'app/shared/layout/cart/cart-table';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ShopCart: React.FC = () => {
  return (
    <section className="shop-cart spad">
      <Container>
        <Row>
          <Col lg={12}>
            <CartTable />
          </Col>
        </Row>
        <CartActions />
        <CartSummary />
      </Container>
    </section>
  );
};

export default ShopCart;
