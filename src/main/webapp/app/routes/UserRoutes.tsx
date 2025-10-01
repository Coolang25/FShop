import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

import { Logout } from 'app/modules/user';
import ModernCart from 'app/modules/public/cart/modern-cart';
import ModernCheckout from 'app/modules/public/checkout/modern-checkout';
import ModernOrders from 'app/modules/public/order/modern-orders';
import ModernOrderDetail from 'app/modules/public/order/modern-order-detail';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/user/account'),
  loading: () => loading,
});

const UserRoutes: React.FC = () => {
  return (
    <ErrorBoundaryRoutes>
      {/* User-only pages - require authentication */}
      <Route
        path="cart"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <ModernCart />
          </PrivateRoute>
        }
      />
      <Route
        path="checkout"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <ModernCheckout />
          </PrivateRoute>
        }
      />
      <Route
        path="orders"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <ModernOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="orders/:id"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <ModernOrderDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="logout"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <Logout />
          </PrivateRoute>
        }
      />

      {/* Account management - requires authentication */}
      <Route
        path="account/*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
            <Account />
          </PrivateRoute>
        }
      />
    </ErrorBoundaryRoutes>
  );
};

export default UserRoutes;
