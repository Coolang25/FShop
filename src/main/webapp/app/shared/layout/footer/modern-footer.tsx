import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './modern-footer.scss';

const ModernFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      {/* Main Footer */}
      <div className="main-footer py-5" style={{ backgroundColor: '#2c3e50', color: 'white' }}>
        <Container>
          <Row>
            {/* Company Info */}
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-section">
                <h5 className="footer-title mb-3" style={{ fontWeight: '600' }}>
                  FShop
                </h5>
                <p className="footer-description mb-4" style={{ lineHeight: '1.6', opacity: '0.9' }}>
                  Your trusted online shopping destination for quality products at unbeatable prices. We&apos;re committed to providing
                  exceptional customer service and fast delivery.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link me-3">
                    <i className="fa fa-facebook" />
                  </a>
                  <a href="#" className="social-link me-3">
                    <i className="fa fa-twitter" />
                  </a>
                  <a href="#" className="social-link me-3">
                    <i className="fa fa-instagram" />
                  </a>
                  <a href="#" className="social-link me-3">
                    <i className="fa fa-youtube" />
                  </a>
                  <a href="#" className="social-link">
                    <i className="fa fa-linkedin" />
                  </a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle mb-3" style={{ fontWeight: '600' }}>
                  Quick Links
                </h6>
                <ul className="footer-links list-unstyled">
                  <li className="mb-2">
                    <Link to="/" className="footer-link">
                      Home
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/shop" className="footer-link">
                      Shop
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/about" className="footer-link">
                      About Us
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/contact" className="footer-link">
                      Contact
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/faq" className="footer-link">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Customer Service */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle mb-3" style={{ fontWeight: '600' }}>
                  Customer Service
                </h6>
                <ul className="footer-links list-unstyled">
                  <li className="mb-2">
                    <Link to="/shipping" className="footer-link">
                      Shipping Info
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/returns" className="footer-link">
                      Returns
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/size-guide" className="footer-link">
                      Size Guide
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/track-order" className="footer-link">
                      Track Order
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/support" className="footer-link">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Categories */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle mb-3" style={{ fontWeight: '600' }}>
                  Categories
                </h6>
                <ul className="footer-links list-unstyled">
                  <li className="mb-2">
                    <Link to="/category/electronics" className="footer-link">
                      Electronics
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/category/fashion" className="footer-link">
                      Fashion
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/category/home" className="footer-link">
                      Home & Garden
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/category/sports" className="footer-link">
                      Sports
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/category/beauty" className="footer-link">
                      Beauty
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>

            {/* Newsletter */}
            <Col lg={2} md={6} className="mb-4">
              <div className="footer-section">
                <h6 className="footer-subtitle mb-3" style={{ fontWeight: '600' }}>
                  Newsletter
                </h6>
                <p className="footer-description mb-3" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
                  Subscribe to get updates on new products and exclusive offers.
                </p>
                <Form className="newsletter-form">
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder="Your email"
                      style={{
                        borderRadius: '25px 0 0 25px',
                        border: 'none',
                        fontSize: '0.9rem',
                      }}
                    />
                    <Button
                      variant="primary"
                      style={{
                        borderRadius: '0 25px 25px 0',
                        border: 'none',
                      }}
                    >
                      <i className="fa fa-paper-plane" />
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods py-3" style={{ backgroundColor: '#34495e', borderTop: '1px solid #4a5f7a' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <span className="me-3" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
                  We Accept:
                </span>
                <div className="payment-icons">
                  <i className="fa fa-cc-visa me-2" style={{ fontSize: '1.5rem', color: '#1a1f71' }} />
                  <i className="fa fa-cc-mastercard me-2" style={{ fontSize: '1.5rem', color: '#eb001b' }} />
                  <i className="fa fa-cc-paypal me-2" style={{ fontSize: '1.5rem', color: '#0070ba' }} />
                  <i className="fa fa-cc-stripe me-2" style={{ fontSize: '1.5rem', color: '#635bff' }} />
                  <i className="fa fa-cc-apple-pay me-2" style={{ fontSize: '1.5rem', color: '#000' }} />
                </div>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <div className="security-badges">
                <span className="badge bg-success me-2">
                  <i className="fa fa-shield me-1" />
                  Secure Payment
                </span>
                <span className="badge bg-info me-2">
                  <i className="fa fa-truck me-1" />
                  Free Shipping
                </span>
                <span className="badge bg-warning">
                  <i className="fa fa-undo me-1" />
                  Easy Returns
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar py-3" style={{ backgroundColor: '#2c3e50', borderTop: '1px solid #4a5f7a' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright mb-0" style={{ fontSize: '0.9rem', opacity: '0.9' }}>
                © {currentYear} FShop. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-end">
              <div className="legal-links">
                <Link to="/privacy" className="legal-link me-3">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="legal-link me-3">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="legal-link">
                  Cookie Policy
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default ModernFooter;
