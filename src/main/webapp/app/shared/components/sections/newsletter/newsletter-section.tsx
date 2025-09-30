import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section
      className="newsletter-section py-5"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={6} md={6} className="mb-4 mb-md-0">
            <div className="newsletter-content">
              <h2
                className="newsletter-title mb-3"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  margin: 0,
                }}
              >
                Stay in the Loop
              </h2>
              <p
                className="newsletter-subtitle mb-0"
                style={{
                  fontSize: '1.2rem',
                  opacity: '0.9',
                  lineHeight: '1.6',
                }}
              >
                Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers. Join thousands
                of satisfied customers!
              </p>
            </div>
          </Col>

          <Col lg={6} md={6}>
            <div className="newsletter-form">
              {isSubscribed ? (
                <Alert
                  variant="success"
                  className="text-center"
                  style={{
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <i className="fa fa-check-circle me-2" />
                  Thank you for subscribing! You&apos;ll receive our latest updates soon.
                </Alert>
              ) : (
                <Form onSubmit={e => handleSubmit(e)}>
                  <div className="d-flex flex-column flex-md-row gap-3">
                    <Form.Group className="flex-grow-1">
                      <Form.Control
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                          borderRadius: '25px',
                          padding: '15px 20px',
                          border: 'none',
                          fontSize: '1rem',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="light"
                      disabled={isLoading}
                      style={{
                        borderRadius: '25px',
                        padding: '15px 30px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        minWidth: '150px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>
                </Form>
              )}

              <div className="newsletter-benefits mt-4">
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-4">
                  <div className="benefit-item d-flex align-items-center">
                    <i className="fa fa-gift me-2" style={{ fontSize: '1.2rem', opacity: '0.8' }} />
                    <span style={{ fontSize: '0.9rem' }}>Exclusive Deals</span>
                  </div>
                  <div className="benefit-item d-flex align-items-center">
                    <i className="fa fa-bell me-2" style={{ fontSize: '1.2rem', opacity: '0.8' }} />
                    <span style={{ fontSize: '0.9rem' }}>New Arrivals</span>
                  </div>
                  <div className="benefit-item d-flex align-items-center">
                    <i className="fa fa-star me-2" style={{ fontSize: '1.2rem', opacity: '0.8' }} />
                    <span style={{ fontSize: '0.9rem' }}>Special Offers</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NewsletterSection;
