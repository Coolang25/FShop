import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface TrendItemProps {
  img: string;
  title: string;
  price: string;
}

const TrendItem: React.FC<TrendItemProps> = ({ img, title, price }) => (
  <div className="trend__item">
    <div className="trend__item__pic">
      <img src={img} alt={title} />
    </div>
    <div className="trend__item__text">
      <h6>{title}</h6>
      <div className="rating">
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
      </div>
      <div className="product__price">{price}</div>
    </div>
  </div>
);

interface TrendContentProps {
  title: string;
  items: TrendItemProps[];
}

const TrendContent: React.FC<TrendContentProps> = ({ title, items }) => (
  <div className="trend__content">
    <div className="section-title">
      <h4>{title}</h4>
    </div>
    {items.map((item, index) => (
      <TrendItem key={index} {...item} />
    ))}
  </div>
);

const TrendSection: React.FC = () => (
  <section className="trend spad">
    <Container>
      <Row>
        <Col lg={4} md={4} sm={6}>
          <TrendContent
            title="Hot Trend"
            items={[
              { img: 'content/img/trend/ht-1.jpg', title: 'Chain bucket bag', price: '$ 59.0' },
              { img: 'content/img/trend/ht-2.jpg', title: 'Pendant earrings', price: '$ 59.0' },
              { img: 'content/img/trend/ht-3.jpg', title: 'Cotton T-Shirt', price: '$ 59.0' },
            ]}
          />
        </Col>
        <Col lg={4} md={4} sm={6}>
          <TrendContent
            title="Best seller"
            items={[
              { img: 'content/img/trend/bs-1.jpg', title: 'Cotton T-Shirt', price: '$ 59.0' },
              { img: 'content/img/trend/bs-2.jpg', title: 'Zip-pockets pebbled tote briefcase', price: '$ 59.0' },
              { img: 'content/img/trend/bs-3.jpg', title: 'Round leather bag', price: '$ 59.0' },
            ]}
          />
        </Col>
        <Col lg={4} md={4} sm={6}>
          <TrendContent
            title="Feature"
            items={[
              { img: 'content/img/trend/f-1.jpg', title: 'Bow wrap skirt', price: '$ 59.0' },
              { img: 'content/img/trend/f-2.jpg', title: 'Metallic earrings', price: '$ 59.0' },
              { img: 'content/img/trend/f-3.jpg', title: 'Flap cross-body bag', price: '$ 59.0' },
            ]}
          />
        </Col>
      </Row>
    </Container>
  </section>
);

export default TrendSection;
