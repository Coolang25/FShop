import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import AdminDashboard from 'app/modules/admin/index';

const loading = <div>loading ...</div>;

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "admin" */ 'app/modules/admin/routes'),
  loading: () => loading,
});

const AdminRoutes: React.FC = () => {
  return (
    <ErrorBoundaryRoutes>
      {/* Admin-only pages - require admin authority */}
      <Route
        path="admin/*"
        element={
          // <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
          <AdminDashboard>
            <Admin />
          </AdminDashboard>
          // </PrivateRoute>
        }
      />
    </ErrorBoundaryRoutes>
  );
};

export default AdminRoutes;
