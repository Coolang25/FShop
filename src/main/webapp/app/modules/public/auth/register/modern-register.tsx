import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';
import PasswordStrengthBar from 'app/shared/components/ui/password/password-strength-bar';
import './modern-register.scss';

const ModernRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const successMessage = useAppSelector(state => state.register.successMessage);
  const errorMessage = useAppSelector(state => state.register.errorMessage);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setRegistrationSuccess(true);
      toast.success(successMessage);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 1) {
      newErrors.username = 'Username must be at least 1 character';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username cannot be longer than 50 characters';
    } else if (!/^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/.test(formData.username)) {
      newErrors.username = 'Username is invalid';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (formData.email.length < 5) {
      newErrors.email = 'Email must be at least 5 characters';
    } else if (formData.email.length > 254) {
      newErrors.email = 'Email cannot be longer than 254 characters';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    } else if (formData.password.length > 100) {
      newErrors.password = 'Password cannot be longer than 100 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitRegistration = async () => {
      try {
        await dispatch(
          handleRegister({
            login: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            langKey: currentLocale,
          }),
        ).unwrap();
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    submitRegistration();
  };

  // Success component
  const SuccessMessage = () => (
    <div className="text-center">
      <div className="mb-4">
        <i className="fa fa-envelope fa-4x text-success"></i>
      </div>
      <h3 className="text-success mb-3">Registration Successful!</h3>
      <div className="alert alert-info mb-4">
        <i className="fa fa-info-circle me-2"></i>
        We have sent an activation email to:
        <br />
        <strong className="text-primary">{formData.email}</strong>
      </div>
      <div className="alert alert-warning mb-4">
        <i className="fa fa-exclamation-triangle me-2"></i>
        <strong>Important:</strong> Please check your email and click the activation link to activate your account.
        <br />
        <small>If you don&apos;t see the email, please check your spam folder.</small>
      </div>
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <Button
          variant="primary"
          onClick={() => {
            setRegistrationSuccess(false);
            setFormData({
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              agreeToTerms: false,
            });
          }}
        >
          <i className="fa fa-user-plus me-2"></i>
          Register Another Account
        </Button>
        <Button variant="outline-primary" onClick={() => navigate('/login')}>
          <i className="fa fa-sign-in me-2"></i>
          Go to Login
        </Button>
      </div>
    </div>
  );

  return (
    <div className="modern-register-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col lg={6} md={8} sm={10}>
            <Card className="register-card shadow-lg border-0">
              <Card.Body className="p-5">
                {registrationSuccess ? (
                  <SuccessMessage />
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="register-title mb-2">Create Your Account</h2>
                      <p className="text-muted">Join our community and start shopping today</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              isInvalid={!!errors.firstName}
                              placeholder="Enter your first name"
                            />
                            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              isInvalid={!!errors.lastName}
                              placeholder="Enter your last name"
                            />
                            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Username *</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          isInvalid={!!errors.username}
                          placeholder="Choose a username"
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email"
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          isInvalid={!!errors.password}
                          placeholder="Create a password"
                        />
                        <PasswordStrengthBar password={formData.password} />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password *</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Confirm your password"
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          isInvalid={!!errors.agreeToTerms}
                          label={
                            <span>
                              I agree to the{' '}
                              <Link to="/terms" className="text-primary">
                                Terms and Conditions
                              </Link>{' '}
                              and{' '}
                              <Link to="/privacy" className="text-primary">
                                Privacy Policy
                              </Link>
                            </span>
                          }
                        />
                        {errors.agreeToTerms && <div className="text-danger small mt-1">{errors.agreeToTerms}</div>}
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-100 mb-3"
                        disabled={isSubmitting}
                        style={{
                          borderRadius: '25px',
                          padding: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      </Button>

                      <div className="text-center">
                        <p className="mb-0">
                          Already have an account?{' '}
                          <Link to="/login" className="text-primary fw-semibold">
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ModernRegister;
