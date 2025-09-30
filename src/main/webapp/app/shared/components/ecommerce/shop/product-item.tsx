import React from 'react';
import { Col } from 'react-bootstrap';

interface ProductItemProps {
  image: string;
  title: string;
  price: string;
  oldPrice?: string;
  label?: string;
  categories?: string;
  isSale?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ image, title, price, oldPrice, label, isSale }) => {
  return (
    <Col lg={4} md={6}>
      <div className={`product__item ${label === 'Sale' || isSale ? 'sale' : ''}`}>
        <div className="product__item__pic set-bg" style={{ backgroundImage: `url(${image})` }}>
          {(label || isSale) && <div className={`label ${(label || 'sale').toLowerCase()}`}>{label || 'Sale'}</div>}
          <ul className="product__hover">
            <li>
              <a href={image} className="image-popup">
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
            <a href="#">{title}</a>
          </h6>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fa fa-star"></i>
            ))}
          </div>
          <div className="product__price">
            {price} {oldPrice && <span>{oldPrice}</span>}
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductItem;
