import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Form, InputGroup, Badge, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import axios from 'axios';
import './modern-header.scss';

const ModernHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const fetchCartCount = async () => {
    if (isAuthenticated && account?.id) {
      try {
        // Use optimized single API call to get cart count
        const response = await axios.get(`/api/carts/count/user/${account.id}`);
        const count = response.data || 0;
        console.log('Cart count from API:', count); // Debug log
        setCartCount(count);
      } catch (err) {
        console.error('Error fetching cart count:', err);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated, account?.id]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isAuthenticated, account?.id]);

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
              {isAuthenticated && (
                <Nav.Link as={Link} to="/orders" className="nav-link-custom">
                  Orders
                </Nav.Link>
              )}
            </Nav>

            {/* User Actions */}
            <div className="user-actions d-flex align-items-center">
              {/* Cart */}
              <Link to="/cart">
                <Button variant="link" className="action-btn me-3 position-relative" style={{ color: '#6c757d' }}>
                  <i className="fa fa-shopping-cart" style={{ fontSize: '1.2rem' }} />
                  {cartCount > 0 && (
                    <Badge
                      bg="primary"
                      className="position-absolute top-0 start-100 translate-middle rounded-pill"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account */}
              {isAuthenticated ? (
                <Dropdown>
                  <Dropdown.Toggle
                    as={Button}
                    variant="outline-primary"
                    style={{
                      borderRadius: '50%',
                      padding: '0',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
                    }}
                    className="custom-dropdown-toggle"
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                      }}
                    >
                      {account?.firstName ? account.firstName.charAt(0).toUpperCase() : account?.login?.charAt(0).toUpperCase()}
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    align="end"
                    style={{
                      borderRadius: '15px',
                      border: 'none',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                      padding: '0',
                      minWidth: '220px',
                      overflow: 'hidden',
                    }}
                  >
                    <Dropdown.Header
                      className="text-center py-3"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                          }}
                        >
                          {account?.firstName ? account.firstName.charAt(0).toUpperCase() : account?.login?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '1rem' }}>
                          {account?.firstName} {account?.lastName}
                        </div>
                        <small style={{ opacity: '0.9', fontSize: '0.8rem' }}>{account?.email}</small>
                      </div>
                    </Dropdown.Header>

                    <div style={{ padding: '8px 0' }}>
                      <Dropdown.Item
                        as={Link}
                        to="/account/profile"
                        className="py-3 px-4"
                        style={{
                          border: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'inherit';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <i className="fa fa-user me-3" style={{ width: '20px' }}></i>
                        Profile
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={Link}
                        to="/account/orders"
                        className="py-3 px-4"
                        style={{
                          border: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'inherit';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <i className="fa fa-shopping-bag me-3" style={{ width: '20px' }}></i>
                        My Orders
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={Link}
                        to="/account/wishlist"
                        className="py-3 px-4"
                        style={{
                          border: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'inherit';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <i className="fa fa-heart me-3" style={{ width: '20px' }}></i>
                        Wishlist
                      </Dropdown.Item>

                      <Dropdown.Item
                        as={Link}
                        to="/account/reviews"
                        className="py-3 px-4"
                        style={{
                          border: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'inherit';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <i className="fa fa-star me-3" style={{ width: '20px' }}></i>
                        My Reviews
                      </Dropdown.Item>

                      <hr style={{ margin: '8px 0', borderColor: '#e9ecef' }} />

                      <Dropdown.Item
                        as={Link}
                        to="/account/settings"
                        className="py-3 px-4"
                        style={{
                          border: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'inherit';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <i className="fa fa-cog me-3" style={{ width: '20px' }}></i>
                        Settings
                      </Dropdown.Item>

                      <hr style={{ margin: '8px 0', borderColor: '#e9ecef' }} />

                      <Dropdown.Item
                        onClick={handleLogout}
                        className="py-3 px-4"
                        style={{
                          border: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          color: '#dc3545',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#dc3545';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <i className="fa fa-sign-out me-3" style={{ width: '20px' }}></i>
                        Logout
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="auth-buttons d-flex align-items-center gap-2">
                  <Link to="/login">
                    <Button
                      variant="outline-primary"
                      style={{
                        borderRadius: '20px',
                        padding: '10px 24px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderWidth: '2px',
                        transition: 'all 0.3s ease',
                        background: 'transparent',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#667eea';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fa fa-sign-in me-2"></i>
                      Login
                    </Button>
                  </Link>
                  <Link to="/account/register">
                    <Button
                      variant="primary"
                      style={{
                        borderRadius: '20px',
                        padding: '10px 24px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                      }}
                    >
                      <i className="fa fa-user-plus me-2"></i>
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
