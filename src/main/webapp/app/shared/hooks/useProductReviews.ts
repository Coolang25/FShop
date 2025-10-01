import { useState, useEffect } from 'react';
import axios from 'axios';

interface ProductReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    login: string;
  };
}

interface ProductRating {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
}

export const useProductReviews = (productId: number | undefined) => {
  const [rating, setRating] = useState<ProductRating>({
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductReviews();
    }
  }, [productId]);

  const fetchProductReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/product-reviews?productId.equals=${productId}`);
      const reviews: ProductReview[] = response.data;

      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

      setRating({
        averageRating,
        totalReviews,
        reviews,
      });
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      setRating({
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return { rating, loading, refetch: fetchProductReviews };
};

export default useProductReviews;
