import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { activateAction, reset } from './activate.reducer';

const SuccessAlert = () => (
  <Alert variant="success" className="text-center">
    <div className="mb-3">
      <i className="fa fa-check-circle fa-3x text-success"></i>
    </div>
    <h4 className="text-success">Account Activated Successfully!</h4>
    <p className="mb-3">
      <Translate contentKey="activate.messages.success">
        <strong>Your user account has been activated.</strong> Please
      </Translate>
      <Link to="/login" className="alert-link ms-1">
        <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
      </Link>
      .
    </p>
    <Link to="/login" className="btn btn-success">
      <i className="fa fa-sign-in me-2"></i>
      Sign In Now
    </Link>
  </Alert>
);

const FailureAlert = () => (
  <Alert variant="danger" className="text-center">
    <div className="mb-3">
      <i className="fa fa-times-circle fa-3x text-danger"></i>
    </div>
    <h4 className="text-danger">Activation Failed</h4>
    <p className="mb-3">
      <Translate contentKey="activate.messages.error">
        <strong>Your user could not be activated.</strong> Please use the registration form to sign up.
      </Translate>
    </p>
    <Link to="/account/register" className="btn btn-primary">
      <i className="fa fa-user-plus me-2"></i>
      Register Again
    </Link>
  </Alert>
);

const NoKeyAlert = () => (
  <Alert variant="warning" className="text-center">
    <div className="mb-3">
      <i className="fa fa-exclamation-triangle fa-3x text-warning"></i>
    </div>
    <h4 className="text-warning">Invalid Activation Link</h4>
    <p className="mb-3">No activation key found in the URL. Please check your email for the correct activation link.</p>
    <Link to="/account/register" className="btn btn-primary">
      <i className="fa fa-user-plus me-2"></i>
      Register Account
    </Link>
  </Alert>
);

export const ActivatePage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const { activationSuccess, activationFailure } = useAppSelector(state => state.activate);

  useEffect(() => {
    const key = searchParams.get('key');

    if (key) {
      setIsLoading(true);
      dispatch(activateAction(key)).finally(() => setIsLoading(false));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, searchParams]);

  const renderContent = () => {
    const key = searchParams.get('key');

    if (!key) {
      return <NoKeyAlert />;
    }

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4>Activating your account...</h4>
          <p className="text-muted">Please wait while we activate your account.</p>
        </div>
      );
    }

    if (activationSuccess) {
      return <SuccessAlert />;
    }

    if (activationFailure) {
      return <FailureAlert />;
    }

    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h4>Processing activation...</h4>
        <p className="text-muted">Please wait while we process your activation.</p>
      </div>
    );
  };

  return (
    <div
      className="activate-page"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '2rem 0',
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={6} md={8} sm={10}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="mb-2" style={{ color: '#2c3e50', fontWeight: '700' }}>
                    <Translate contentKey="activate.title">Account Activation</Translate>
                  </h2>
                  <p className="text-muted">Activating your account</p>
                </div>
                {renderContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ActivatePage;
