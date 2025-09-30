import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div
        className="hero-bg"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/content/img/hero/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={8}>
              <div className="hero-content text-white">
                <h1 className="hero-title mb-4" style={{ fontSize: '3.5rem', fontWeight: '700' }}>
                  Discover Amazing Products
                </h1>
                <p className="hero-subtitle mb-4" style={{ fontSize: '1.2rem', opacity: '0.9' }}>
                  Shop the latest trends and find your perfect style. Quality products at unbeatable prices.
                </p>
                <div className="hero-buttons">
                  <Button
                    variant="primary"
                    size="lg"
                    className="me-3 mb-2"
                    style={{
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="mb-2"
                    style={{
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    View Collection
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default HeroSection;
