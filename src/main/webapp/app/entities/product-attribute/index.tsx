import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ProductAttribute from './product-attribute';
import ProductAttributeDetail from './product-attribute-detail';
import ProductAttributeUpdate from './product-attribute-update';
import ProductAttributeDeleteDialog from './product-attribute-delete-dialog';

const ProductAttributeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ProductAttribute />} />
    <Route path="new" element={<ProductAttributeUpdate />} />
    <Route path=":id">
      <Route index element={<ProductAttributeDetail />} />
      <Route path="edit" element={<ProductAttributeUpdate />} />
      <Route path="delete" element={<ProductAttributeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProductAttributeRoutes;
