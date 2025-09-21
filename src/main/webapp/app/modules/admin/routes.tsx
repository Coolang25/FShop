import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Dashboard from './dashboard';
import ProductManagement from './products';
import CategoryManagement from './categories';
import AttributeManagement from './attributes';
import InventoryManagement from './inventory';
import OrderManagement from './order';
import UserManagement from './users';
import ReportsManagement from './reports';

const AdminRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<ProductManagement />} />
    <Route path="categories" element={<CategoryManagement />} />
    <Route path="attributes" element={<AttributeManagement />} />
    <Route path="inventory" element={<InventoryManagement />} />
    <Route path="orders" element={<OrderManagement />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="reports" element={<ReportsManagement />} />
  </ErrorBoundaryRoutes>
);

export default AdminRoutes;
