import React from 'react';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductRating from '../product/product-rating';

interface ProductItemProps {
  id?: number;
  image: string;
  title: string;
  price: string;
  oldPrice?: string;
  label?: string;
  categories?: string;
  isSale?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, image, title, price, oldPrice, label, isSale }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <Col lg={4} md={6}>
      <div className={`product__item ${label === 'Sale' || isSale ? 'sale' : ''}`}>
        <div className="product__item__pic set-bg" style={{ backgroundImage: `url(${image})` }}>
          {(label || isSale) && <div className={`label ${(label || 'sale').toLowerCase()}`}>{label || 'Sale'}</div>}
        </div>
        <div className="product__item__text">
          <h6>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                handleViewDetails();
              }}
            >
              {title}
            </a>
          </h6>
          {id && (
            <div className="product-rating mb-2">
              <ProductRating productId={id} showReviewsCount={false} size="sm" />
            </div>
          )}
          <div className="product__price">
            {price} {oldPrice && <span>{oldPrice}</span>}
          </div>
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={handleViewDetails}
            style={{
              borderRadius: '25px',
              padding: '8px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.9rem',
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductItem;
