import React from 'react';
import { Col, Tab, Nav } from 'react-bootstrap';

const ProductTabs: React.FC = () => {
  return (
    <Col lg={12}>
      <div className="product__details__tab">
        <Tab.Container defaultActiveKey="description">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="description">Description</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="specification">Specification</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviews">Reviews ( 2 )</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="description">
              <h6>Description</h6>
              <p>...</p>
            </Tab.Pane>
            <Tab.Pane eventKey="specification">
              <h6>Specification</h6>
              <p>...</p>
            </Tab.Pane>
            <Tab.Pane eventKey="reviews">
              <h6>Reviews ( 2 )</h6>
              <p>...</p>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Col>
  );
};

export default ProductTabs;
