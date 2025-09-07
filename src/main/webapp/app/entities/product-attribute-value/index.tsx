import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ProductAttributeValue from './product-attribute-value';
import ProductAttributeValueDetail from './product-attribute-value-detail';
import ProductAttributeValueUpdate from './product-attribute-value-update';
import ProductAttributeValueDeleteDialog from './product-attribute-value-delete-dialog';

const ProductAttributeValueRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ProductAttributeValue />} />
    <Route path="new" element={<ProductAttributeValueUpdate />} />
    <Route path=":id">
      <Route index element={<ProductAttributeValueDetail />} />
      <Route path="edit" element={<ProductAttributeValueUpdate />} />
      <Route path="delete" element={<ProductAttributeValueDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ProductAttributeValueRoutes;
