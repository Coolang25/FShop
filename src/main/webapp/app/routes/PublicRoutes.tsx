import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { Home, Shop, Product, Login, Register } from 'app/modules/public';
import { Activate, PasswordResetInit, PasswordResetFinish } from 'app/modules/shared';
import PageNotFound from 'app/shared/error/page-not-found';

const PublicRoutes: React.FC = () => {
  return (
    <ErrorBoundaryRoutes>
      {/* Public pages - accessible to everyone */}
      <Route index element={<Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="product" element={<Product />} />

      {/* Authentication pages */}
      <Route path="login" element={<Login />} />
      <Route path="account/register" element={<Register />} />
      <Route path="account/activate" element={<Activate />} />
      <Route path="account/reset/request" element={<PasswordResetInit />} />
      <Route path="account/reset/finish" element={<PasswordResetFinish />} />

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<PageNotFound />} />
    </ErrorBoundaryRoutes>
  );
};

export default PublicRoutes;
