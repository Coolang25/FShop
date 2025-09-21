import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ErrorBoundary from 'app/shared/error/error-boundary';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-app-container">
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />

      <ErrorBoundary>{children || <Outlet />}</ErrorBoundary>
    </div>
  );
};

export default AdminLayout;
