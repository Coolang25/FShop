import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ActivateTest: React.FC = () => {
  const testKey = 'IpEnKDv9dRDnJ7v5ZNUq'; // Example key from user

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4>Test Account Activation</h4>
            </Card.Header>
            <Card.Body>
              <p>Click the button below to test the activation flow with a sample key:</p>
              <div className="d-flex gap-2">
                <Link to={`/account/activate?key=${testKey}`} className="btn btn-primary">
                  Test Activation with Key: {testKey}
                </Link>
                <Link to="/account/activate" className="btn btn-secondary">
                  Test Activation without Key
                </Link>
              </div>
              <hr />
              <h6>Expected Flow:</h6>
              <ol>
                <li>User registers account</li>
                <li>
                  Email sent with activation link: <code>/account/activate?key=ACTIVATION_KEY</code>
                </li>
                <li>
                  User clicks link → Frontend calls <code>GET /api/activate?key=ACTIVATION_KEY</code>
                </li>
                <li>Backend activates account and returns success/error</li>
                <li>Frontend shows success/error message</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ActivateTest;
