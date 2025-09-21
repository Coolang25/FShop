import React from 'react';
import { Col } from 'react-bootstrap';

const RelatedProducts: React.FC = () => {
  const products = [
    { id: 1, img: 'content/img/product/related/rp-1.jpg', title: 'Buttons tweed blazer', price: 59.0, label: 'New' },
    { id: 2, img: 'content/img/product/related/rp-2.jpg', title: 'Flowy striped skirt', price: 49.0 },
    { id: 3, img: 'content/img/product/related/rp-3.jpg', title: 'Cotton T-Shirt', price: 59.0, label: 'out of stock' },
    { id: 4, img: 'content/img/product/related/rp-4.jpg', title: 'Slim striped pocket shirt', price: 59.0 },
  ];

  return (
    <>
      <Col lg={12} className="text-center">
        <div className="related__title">
          <h5>RELATED PRODUCTS</h5>
        </div>
      </Col>
      {products.map(p => (
        <Col key={p.id} lg={3} md={4} sm={6}>
          <div className="product__item">
            <div className="product__item__pic set-bg" style={{ backgroundImage: `url(${p.img})` }}>
              {p.label && <div className={`label ${p.label === 'New' ? 'new' : 'stockout'}`}>{p.label}</div>}
              <ul className="product__hover">
                <li>
                  <a href={p.img} className="image-popup">
                    <span className="arrow_expand"></span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon_heart_alt"></span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="icon_bag_alt"></span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="product__item__text">
              <h6>
                <a href="#">{p.title}</a>
              </h6>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa fa-star"></i>
                ))}
              </div>
              <div className="product__price">${p.price}</div>
            </div>
          </div>
        </Col>
      ))}
    </>
  );
};

export default RelatedProducts;
