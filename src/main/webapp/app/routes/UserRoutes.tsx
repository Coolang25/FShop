import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

import { Cart, Checkout, Logout } from 'app/modules/user';

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
          // <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
          <Cart />
          // </PrivateRoute>
        }
      />
      <Route
        path="checkout"
        element={
          // <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.ADMIN]}>
          <Checkout />
          // </PrivateRoute>
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
