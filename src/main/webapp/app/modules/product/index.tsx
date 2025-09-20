import ProductImages from 'app/shared/layout/product/product-image';
import ProductInfo from 'app/shared/layout/product/product-info';
import ProductTabs from 'app/shared/layout/product/product-tab';
import RelatedProducts from 'app/shared/layout/product/related-product';
import ProductList from 'app/shared/layout/shop/product-list';
import ShopSidebar from 'app/shared/layout/shop/shop-sidebar';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const ProductPage = () => {
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

export default ProductPage;
