import ProductImages from 'app/shared/components/ecommerce/product/product-image';
import ProductInfo from 'app/shared/components/ecommerce/product/product-info';
import ProductTabs from 'app/shared/components/ecommerce/product/product-tab';
import RelatedProducts from 'app/shared/components/ecommerce/product/related-product';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const Shop = () => {
  return (
    <section className="product-details spad">
      <Container>
        <Row>
          <ProductImages />
          <ProductInfo />
          <ProductTabs />
        </Row>
        <Row>
          <RelatedProducts />
        </Row>
      </Container>
    </section>
  );
};

export default Shop;
