import React from 'react';
import { Col, Carousel } from 'react-bootstrap';

const ProductImages: React.FC = () => {
  const images = [
    { id: 'product-1', src: 'content/img/product/details/product-1.jpg' },
    { id: 'product-2', src: 'content/img/product/details/product-3.jpg' },
    { id: 'product-3', src: 'content/img/product/details/product-2.jpg' },
    { id: 'product-4', src: 'content/img/product/details/product-4.jpg' },
  ];

  return (
    <Col lg={6}>
      <div className="product__details__pic">
        <div className="product__details__slider__content">
          <Carousel indicators={true} controls={true} interval={null} className="product__details__pic__slider">
            {images.map(img => (
              <Carousel.Item key={img.id}>
                <img className="d-block w-100 product__big__img" src={img.src} alt={img.id} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
    </Col>
  );
};

export default ProductImages;
