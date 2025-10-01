import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductRating from './product-rating';

interface ProductItemProps {
  id?: number;
  title: string;
  price: string;
  image: string;
  categories: string;
  isSale?: boolean;
  oldPrice?: string;
  label?: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, title, price, oldPrice, image, categories, isSale, label }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div className={`col-lg-3 col-md-4 col-sm-6 mix ${categories}`}>
      <div className={`product__item ${isSale ? 'sale' : ''}`}>
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
    </div>
  );
};

export default ProductItem;
