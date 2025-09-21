import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaCogs,
  FaWarehouse,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa';
import './index.scss';

const AdminDashboard = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: FaBox, label: 'Product Management' },
    { path: '/admin/categories', icon: FaTags, label: 'Category Management' },
    { path: '/admin/attributes', icon: FaCogs, label: 'Product Attributes' },
    { path: '/admin/inventory', icon: FaWarehouse, label: 'Inventory Management' },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/reports', icon: FaChartBar, label: 'Reports' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Top Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
        <Container fluid>
          <Button variant="outline-light" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="me-3">
            <FaBars />
          </Button>
          <Navbar.Brand href="#home">FShop Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Admin User" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="admin-content-wrapper">
        {/* Sidebar */}
        <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <Nav className="flex-column">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Nav.Item key={item.path}>
                    <Nav.Link as={Link} to={item.path} className={`sidebar-link ${isActive(item.path, item.exact) ? 'active' : ''}`}>
                      <Icon className="me-2" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Container fluid className="py-4">
            {children}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
