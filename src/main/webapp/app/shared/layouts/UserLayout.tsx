import React from 'react';
import { Card } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Header, Footer } from 'app/shared/components/layout';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

interface UserLayoutProps {
  children?: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  return (
    <div className="app-container">
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />

      <ErrorBoundary>
        <Header
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          currentLocale={currentLocale}
          ribbonEnv={ribbonEnv}
          isInProduction={isInProduction}
          isOpenAPIEnabled={isOpenAPIEnabled}
        />
      </ErrorBoundary>

      <div id="app-view-container">
        <Card className="jh-card">
          <ErrorBoundary>{children || <Outlet />}</ErrorBoundary>
        </Card>
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
