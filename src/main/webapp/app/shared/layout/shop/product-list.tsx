import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductItem from './product-item';

const products = [
  { image: 'content/img/shop/shop-1.jpg', title: 'Furry hooded parka', price: '$59.0', label: 'New' },
  { image: 'content/img/shop/shop-2.jpg', title: 'Flowy striped skirt', price: '$49.0' },
  { image: 'content/img/shop/shop-3.jpg', title: 'Croc-effect bag', price: '$59.0' },
  { image: 'content/img/shop/shop-4.jpg', title: 'Dark wash Xavi jeans', price: '$59.0' },
  { image: 'content/img/shop/shop-5.jpg', title: 'Ankle-cuff sandals', price: '$49.0', oldPrice: '$59.0', label: 'Sale' },
  { image: 'content/img/shop/shop-6.jpg', title: 'Contrasting sunglasses', price: '$59.0' },
  { image: 'content/img/shop/shop-7.jpg', title: 'Circular pendant earrings', price: '$59.0' },
  { image: 'content/img/shop/shop-8.jpg', title: 'Cotton T-Shirt', price: '$59.0', label: 'Out Of Stock' },
  { image: 'content/img/shop/shop-9.jpg', title: 'Water resistant zips backpack', price: '$49.0', oldPrice: '$59.0', label: 'Sale' },
];

const ProductList: React.FC = () => {
  return (
    <Row>
      {products.map((p, idx) => (
        <ProductItem key={idx} {...p} />
      ))}

      <Col lg={12} className="text-center">
        <div className="pagination__option">
          <a href="#">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">
            <i className="fa fa-angle-right"></i>
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default ProductList;
