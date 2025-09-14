import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          {/* About */}
          <Col lg={4} md={6} sm={7}>
            <div className="footer__about">
              <div className="footer__logo">
                <a href="./index.html">
                  <img src="content/img/logo.png" alt="Logo" />
                </a>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt cilisis.</p>
              <div className="footer__payment">
                <a href="#">
                  <img src="content/img/payment/payment-1.png" alt="Payment 1" />
                </a>
                <a href="#">
                  <img src="content/img/payment/payment-2.png" alt="Payment 2" />
                </a>
                <a href="#">
                  <img src="content/img/payment/payment-3.png" alt="Payment 3" />
                </a>
                <a href="#">
                  <img src="content/img/payment/payment-4.png" alt="Payment 4" />
                </a>
                <a href="#">
                  <img src="content/img/payment/payment-5.png" alt="Payment 5" />
                </a>
              </div>
            </div>
          </Col>

          {/* Quick links */}
          <Col lg={2} md={3} sm={5}>
            <div className="footer__widget">
              <h6>Quick links</h6>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
              </ul>
            </div>
          </Col>

          {/* Account */}
          <Col lg={2} md={3} sm={4}>
            <div className="footer__widget">
              <h6>Account</h6>
              <ul>
                <li>
                  <a href="#">My Account</a>
                </li>
                <li>
                  <a href="#">Orders Tracking</a>
                </li>
                <li>
                  <a href="#">Checkout</a>
                </li>
                <li>
                  <a href="#">Wishlist</a>
                </li>
              </ul>
            </div>
          </Col>

          {/* Newsletter & Social */}
          <Col lg={4} md={8} sm={8}>
            <div className="footer__newslatter">
              <h6>NEWSLETTER</h6>
              <Form action="#">
                <input type="text" placeholder="Email" />
                <Button type="submit" className="site-btn">
                  Subscribe
                </Button>
              </Form>
              <div className="footer__social">
                <a href="#">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa fa-youtube-play"></i>
                </a>
                <a href="#">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fa fa-pinterest"></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <div className="footer__copyright__text">
              <p>
                Copyright &copy; {currentYear} All rights reserved | This template is made with{' '}
                <i className="fa fa-heart" aria-hidden="true"></i> by{' '}
                <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer">
                  Colorlib
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
