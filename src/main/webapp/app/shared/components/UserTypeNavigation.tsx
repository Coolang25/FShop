import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const UserTypeNavigation: React.FC = () => {
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

  // Navigation items based on user type
  const getNavigationItems = () => {
    switch (currentUserType) {
      case 'admin':
        return [
          { path: '/admin', label: 'Admin Dashboard' },
          { path: '/admin/products', label: 'Products' },
          { path: '/admin/orders', label: 'Orders' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/reports', label: 'Reports' },
        ];

      case 'user':
        return [
          { path: '/shop', label: 'Shop' },
          { path: '/cart', label: 'Cart' },
          { path: '/account', label: 'My Account' },
        ];

      default:
        return [
          { path: '/', label: 'Home' },
          { path: '/shop', label: 'Shop' },
          { path: '/login', label: 'Login' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <Nav className="me-auto">
      {navigationItems.map(item => (
        <Nav.Link key={item.path} as={Link} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default UserTypeNavigation;
