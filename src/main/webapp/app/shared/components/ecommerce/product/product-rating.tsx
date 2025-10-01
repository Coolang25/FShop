import React from 'react';
import useProductReviews from 'app/shared/hooks/useProductReviews';

interface ProductRatingProps {
  productId: number;
  showReviewsCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId, showReviewsCount = true, size = 'sm' }) => {
  const { rating: productRating, loading } = useProductReviews(productId);

  const renderStars = (rating: number) => {
    const starSize = size === 'sm' ? '0.9rem' : size === 'md' ? '1rem' : '1.1rem';
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa fa-star ${i < Math.floor(rating) ? 'text-warning' : 'text-muted'}`} style={{ fontSize: starSize }} />
    ));
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <div className="me-2">
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className="fa fa-star text-muted" style={{ fontSize: size === 'sm' ? '0.9rem' : '1rem' }} />
          ))}
        </div>
        <small className="text-muted">Loading...</small>
      </div>
    );
  }

  return (
    <div className="product-rating">
      <div className="d-flex align-items-center">
        <div className="me-2">{renderStars(productRating.averageRating)}</div>
        {showReviewsCount && (
          <small className="text-muted">
            ({productRating.averageRating > 0 ? productRating.averageRating.toFixed(1) : '0.0'}) • {productRating.totalReviews} review
            {productRating.totalReviews !== 1 ? 's' : ''}
          </small>
        )}
      </div>
    </div>
  );
};

export default ProductRating;
