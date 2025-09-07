import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ShopOrder from './shop-order';
import ShopOrderDetail from './shop-order-detail';
import ShopOrderUpdate from './shop-order-update';
import ShopOrderDeleteDialog from './shop-order-delete-dialog';

const ShopOrderRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ShopOrder />} />
    <Route path="new" element={<ShopOrderUpdate />} />
    <Route path=":id">
      <Route index element={<ShopOrderDetail />} />
      <Route path="edit" element={<ShopOrderUpdate />} />
      <Route path="delete" element={<ShopOrderDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ShopOrderRoutes;
