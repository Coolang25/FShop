import React from 'react';
import { Card } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ModernHeader from 'app/shared/layout/header/modern-header';
import ModernFooter from 'app/shared/layout/footer/modern-footer';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

interface UserLayoutProps {
  children?: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />

      <ErrorBoundary>
        <ModernHeader />
      </ErrorBoundary>

      <div id="app-view-container">
        <ErrorBoundary>{children || <Outlet />}</ErrorBoundary>
        <ModernFooter />
      </div>
    </div>
  );
};

export default UserLayout;
