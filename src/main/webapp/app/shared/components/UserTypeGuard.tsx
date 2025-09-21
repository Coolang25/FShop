import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

interface UserTypeGuardProps {
  children: React.ReactNode;
  allowedUserTypes: ('public' | 'user' | 'admin')[];
  redirectTo?: string;
}

const UserTypeGuard: React.FC<UserTypeGuardProps> = ({ children, allowedUserTypes, redirectTo = '/' }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));

  // Determine current user type
  const getUserType = (): 'public' | 'user' | 'admin' => {
    if (isAdmin) return 'admin';
    if (isAuthenticated) return 'user';
    return 'public';
  };

  const currentUserType = getUserType();

  // Check if current user type is allowed
  const isAllowed = allowedUserTypes.includes(currentUserType);

  if (!isAllowed) {
    // Redirect based on user type
    if (currentUserType === 'public') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else if (currentUserType === 'user' && allowedUserTypes.includes('admin')) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

export default UserTypeGuard;
