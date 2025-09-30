import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import './modern-header.scss';

const ModernHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <header className="modern-header">
      {/* Top Bar */}
      <div className="top-bar py-2" style={{ backgroundColor: '#2c3e50', color: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <i className="fa fa-phone me-2" />
                <span className="me-4">+1 (555) 123-4567</span>
                <i className="fa fa-envelope me-2" />
                <span>support@fshop.com</span>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <div className="d-flex align-items-center justify-content-end">
                <span className="me-3">Free shipping on orders over $50</span>
                <div className="social-links">
                  <a href="#" className="text-white me-2">
                    <i className="fa fa-facebook" />
                  </a>
                  <a href="#" className="text-white me-2">
                    <i className="fa fa-twitter" />
                  </a>
                  <a href="#" className="text-white me-2">
                    <i className="fa fa-instagram" />
                  </a>
                  <a href="#" className="text-white">
                    <i className="fa fa-youtube" />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Header */}
      <Navbar expand="lg" className="main-header py-3" style={{ backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <h2
              className="mb-0"
              style={{
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FShop
            </h2>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/shop" className="nav-link-custom">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/categories" className="nav-link-custom">
                Categories
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link-custom">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-custom">
                Contact
              </Nav.Link>
            </Nav>

            {/* User Actions */}
            <div className="user-actions d-flex align-items-center">
              {/* Wishlist */}
              <Button variant="link" className="action-btn me-2" style={{ color: '#6c757d' }}>
                <i className="fa fa-heart-o" style={{ fontSize: '1.2rem' }} />
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: '0.7rem' }}
                >
                  3
                </Badge>
              </Button>

              {/* Cart */}
              <Button variant="link" className="action-btn me-3" style={{ color: '#6c757d' }}>
                <i className="fa fa-shopping-cart" style={{ fontSize: '1.2rem' }} />
                <Badge
                  bg="primary"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: '0.7rem' }}
                >
                  5
                </Badge>
              </Button>

              {/* User Account */}
              {isAuthenticated ? (
                <div className="dropdown">
                  <Button
                    variant="outline-primary"
                    className="dropdown-toggle"
                    style={{
                      borderRadius: '25px',
                      padding: '8px 20px',
                      fontWeight: '500',
                    }}
                  >
                    <i className="fa fa-user me-2" />
                    {account?.login || 'Account'}
                  </Button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="me-2">
                    <Button
                      variant="outline-primary"
                      style={{
                        borderRadius: '25px',
                        padding: '8px 20px',
                        fontWeight: '500',
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="primary"
                      style={{
                        borderRadius: '25px',
                        padding: '8px 20px',
                        fontWeight: '500',
                      }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default ModernHeader;
