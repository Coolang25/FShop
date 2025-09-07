import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import VariantAttributeValue from './variant-attribute-value';
import VariantAttributeValueDetail from './variant-attribute-value-detail';
import VariantAttributeValueUpdate from './variant-attribute-value-update';
import VariantAttributeValueDeleteDialog from './variant-attribute-value-delete-dialog';

const VariantAttributeValueRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<VariantAttributeValue />} />
    <Route path="new" element={<VariantAttributeValueUpdate />} />
    <Route path=":id">
      <Route index element={<VariantAttributeValueDetail />} />
      <Route path="edit" element={<VariantAttributeValueUpdate />} />
      <Route path="delete" element={<VariantAttributeValueDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default VariantAttributeValueRoutes;
