import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

// Import account modules from shared
import { Activate, PasswordResetInit, PasswordResetFinish } from 'app/modules/shared';

const AccountRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path="activate" element={<Activate />} />
    <Route path="reset/request" element={<PasswordResetInit />} />
    <Route path="reset/finish" element={<PasswordResetFinish />} />
  </ErrorBoundaryRoutes>
);

export default AccountRoutes;
