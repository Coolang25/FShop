import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

import PublicLayout from 'app/shared/layouts/PublicLayout';
import UserLayout from 'app/shared/layouts/UserLayout';
import AdminLayout from 'app/shared/layouts/AdminLayout';
import PublicRoutes from './PublicRoutes';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';

const AppRouter: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));

  // Determine which layout to use based on route and user status
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.match(/^\/(cart|checkout|account)/);

  // Route classification
  const getRouteType = () => {
    if (isAdminRoute) return 'admin';
    if (isUserRoute) return 'user';
    return 'public';
  };

  const routeType = getRouteType();

  // Render appropriate layout and routes
  const renderRoutes = () => {
    switch (routeType) {
      case 'admin':
        return (
          <AdminLayout>
            <AdminRoutes />
          </AdminLayout>
        );

      case 'user':
        return (
          <UserLayout>
            <UserRoutes />
          </UserLayout>
        );

      default:
        return (
          <PublicLayout>
            <PublicRoutes />
          </PublicLayout>
        );
    }
  };

  return (
    <Routes>
      <Route path="/*" element={renderRoutes()} />
    </Routes>
  );
};

export default AppRouter;
