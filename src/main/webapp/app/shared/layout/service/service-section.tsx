import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface ServiceItemProps {
  icon: string;
  title: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, title, description }) => (
  <div className="services__item">
    <i className={`fa ${icon}`}></i>
    <h6>{title}</h6>
    <p>{description}</p>
  </div>
);

const ServicesSection: React.FC = () => {
  const services: ServiceItemProps[] = [
    { icon: 'fa-car', title: 'Free Shipping', description: 'For all oder over $99' },
    { icon: 'fa-money', title: 'Money Back Guarantee', description: 'If good have Problems' },
    { icon: 'fa-support', title: 'Online Support 24/7', description: 'Dedicated support' },
    { icon: 'fa-headphones', title: 'Payment Secure', description: '100% secure payment' },
  ];

  return (
    <section className="services spad">
      <Container>
        <Row>
          {services.map((service, index) => (
            <Col key={index} lg={3} md={4} sm={6}>
              <ServiceItem {...service} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServicesSection;
