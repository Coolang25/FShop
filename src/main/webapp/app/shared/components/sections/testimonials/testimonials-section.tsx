import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      image: '/content/img/testimonials/sarah.jpg',
      rating: 5,
      comment:
        'Amazing quality and fast shipping! I&apos;ve been shopping here for months and never disappointed. The customer service is outstanding.',
      location: 'New York, USA',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Tech Enthusiast',
      image: '/content/img/testimonials/michael.jpg',
      rating: 5,
      comment:
        'Best online shopping experience I&apos;ve had. Great prices, authentic products, and lightning-fast delivery. Highly recommended!',
      location: 'San Francisco, USA',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Lifestyle Influencer',
      image: '/content/img/testimonials/emma.jpg',
      rating: 5,
      comment:
        'Love the variety of products and the attention to detail. Every purchase feels like a premium experience. Will definitely shop again!',
      location: 'London, UK',
    },
    {
      id: 4,
      name: 'David Rodriguez',
      role: 'Business Owner',
      image: '/content/img/testimonials/david.jpg',
      rating: 5,
      comment:
        'Excellent customer support and product quality. The return policy is hassle-free, which gives me confidence in every purchase.',
      location: 'Barcelona, Spain',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa fa-star ${i < rating ? 'text-warning' : 'text-muted'}`} style={{ fontSize: '1.1rem' }} />
    ));
  };

  return (
    <section className="testimonials-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title mb-3" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              What Our Customers Say
            </h2>
            <p className="section-subtitle text-muted" style={{ fontSize: '1.1rem' }}>
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
          </Col>
        </Row>

        <Row>
          {testimonials.map(testimonial => (
            <Col lg={6} md={6} className="mb-4" key={testimonial.id}>
              <Card
                className="testimonial-card h-100 border-0 shadow-sm"
                style={{
                  borderRadius: '15px',
                  padding: '2rem',
                  backgroundColor: 'white',
                }}
              >
                <Card.Body className="p-0">
                  {/* Rating */}
                  <div className="testimonial-rating mb-3">{renderStars(testimonial.rating)}</div>

                  {/* Comment */}
                  <blockquote className="testimonial-comment mb-4">
                    <p
                      style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        color: '#2c3e50',
                        fontStyle: 'italic',
                        margin: 0,
                      }}
                    >
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                  </blockquote>

                  {/* Customer Info */}
                  <div className="testimonial-author d-flex align-items-center">
                    <div
                      className="author-avatar me-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundImage: `url(${testimonial.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '3px solid #e9ecef',
                      }}
                    />
                    <div>
                      <h6
                        className="author-name mb-1"
                        style={{
                          fontWeight: '600',
                          color: '#2c3e50',
                          margin: 0,
                        }}
                      >
                        {testimonial.name}
                      </h6>
                      <p
                        className="author-role mb-1"
                        style={{
                          color: '#6c757d',
                          fontSize: '0.9rem',
                          margin: 0,
                        }}
                      >
                        {testimonial.role}
                      </p>
                      <p
                        className="author-location"
                        style={{
                          color: '#95a5a6',
                          fontSize: '0.8rem',
                          margin: 0,
                        }}
                      >
                        <i className="fa fa-map-marker me-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Stats Section */}
        <Row className="mt-5 pt-4" style={{ borderTop: '1px solid #e9ecef' }}>
          <Col lg={3} md={6} className="text-center mb-4">
            <div className="stat-item">
              <h3
                className="stat-number mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#e74c3c',
                  margin: 0,
                }}
              >
                10K+
              </h3>
              <p className="stat-label text-muted" style={{ fontSize: '1rem', margin: 0 }}>
                Happy Customers
              </p>
            </div>
          </Col>
          <Col lg={3} md={6} className="text-center mb-4">
            <div className="stat-item">
              <h3
                className="stat-number mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#e74c3c',
                  margin: 0,
                }}
              >
                50K+
              </h3>
              <p className="stat-label text-muted" style={{ fontSize: '1rem', margin: 0 }}>
                Products Sold
              </p>
            </div>
          </Col>
          <Col lg={3} md={6} className="text-center mb-4">
            <div className="stat-item">
              <h3
                className="stat-number mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#e74c3c',
                  margin: 0,
                }}
              >
                4.9
              </h3>
              <p className="stat-label text-muted" style={{ fontSize: '1rem', margin: 0 }}>
                Average Rating
              </p>
            </div>
          </Col>
          <Col lg={3} md={6} className="text-center mb-4">
            <div className="stat-item">
              <h3
                className="stat-number mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#e74c3c',
                  margin: 0,
                }}
              >
                24/7
              </h3>
              <p className="stat-label text-muted" style={{ fontSize: '1rem', margin: 0 }}>
                Customer Support
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
