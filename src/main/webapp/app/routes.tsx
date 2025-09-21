import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Register from 'app/modules/public/auth/register/register';
import Activate from 'app/modules/shared/auth/activate/activate';
import PasswordResetInit from 'app/modules/shared/auth/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/shared/auth/password-reset/finish/password-reset-finish';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { Home, Login, Shop } from './modules/public';
import ProductPage from './modules/public/product';
import ShopCart from './modules/user/cart';
import { Checkout, Logout } from './modules/user';
import { AUTHORITIES } from './config/constants';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/user/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "admin" */ 'app/modules/admin/routes'),
  loading: () => loading,
});
const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="cart" element={<ShopCart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>
        {/* <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        /> */}
        <Route path="admin/*" element={<Admin />} />
        {/* <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        /> */}
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
