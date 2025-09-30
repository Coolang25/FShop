import ProductImages from 'app/shared/components/ecommerce/product/product-image';
import ProductInfo from 'app/shared/components/ecommerce/product/product-info';
import ProductTabs from 'app/shared/components/ecommerce/product/product-tab';
import RelatedProducts from 'app/shared/components/ecommerce/product/related-product';
import { ShopSidebar, ProductList } from 'app/shared/components/ecommerce/shop';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ModernShop from './modern-shop';

export const Shop = () => {
  // Sử dụng giao diện mới hiện đại
  return <ModernShop />;

  // Giao diện cũ (có thể comment lại nếu muốn sử dụng)
  /*
  return (
    <section className="shop spad">
      <Container>
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <ShopSidebar />
          </div>
          <div className="col-lg-9 col-md-9">
            <ProductList />
          </div>
        </div>
      </Container>
    </section>
  );
  */
};

export default Shop;
