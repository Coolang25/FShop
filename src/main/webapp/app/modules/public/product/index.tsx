import React from 'react';
import { useParams } from 'react-router-dom';
import ModernProductDetail from './modern-product-detail';

export const Product = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Product not found</div>;
  }

  return <ModernProductDetail productId={parseInt(id, 10)} />;
};

export default Product;
