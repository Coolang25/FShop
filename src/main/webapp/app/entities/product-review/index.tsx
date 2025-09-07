import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ProductReview from './product-review';
import ProductReviewDetail from './product-review-detail';
import ProductReviewUpdate from './product-review-update';
import ProductReviewDeleteDialog from './product-review-delete-dialog';

const ProductReviewRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ProductReview />} />
    <Route path="new" element={<ProductReviewUpdate />} />
    <Route path=":id">
      <Route index element={<ProductReviewDetail />} />
      <Route path="edit" element={<ProductReviewUpdate />} />
      <Route path="delete" element={<ProductReviewDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProductReviewRoutes;
