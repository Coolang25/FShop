import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  variant: {
    id: number;
    sku: string;
    imageUrl: string;
    product: {
      id: number;
      name: string;
    };
  };
}

interface ShopOrder {
  id: number;
  status: string;
  total: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payment?: {
    id: number;
    status: string;
    method: string;
    amount: number;
  };
}

const ModernOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  const showToastMessage = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchOrder();
    }
  }, [isAuthenticated, id, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/shop-orders/${id}`);
      console.log('Order response:', response.data);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending' },
      CONFIRMED: { variant: 'info', text: 'Confirmed' },
      SHIPPED: { variant: 'primary', text: 'Shipped' },
      DELIVERED: { variant: 'success', text: 'Delivered' },
      CANCELLED: { variant: 'danger', text: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending' },
      COMPLETED: { variant: 'success', text: 'Completed' },
      FAILED: { variant: 'danger', text: 'Failed' },
      REFUNDED: { variant: 'info', text: 'Refunded' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseShippingAddress = (addressString: string) => {
    try {
      return JSON.parse(addressString);
    } catch {
      return { firstName: '', lastName: '', email: '', phone: '', address: '' };
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading order details...</p>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Order not found'}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const shippingAddress = parseShippingAddress(order.shippingAddress);

  return (
    <Container className="py-5">
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-success' : 'text-danger'}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Order Details</h2>
              <p className="text-muted mb-0">Order #{order.id}</p>
            </div>
            <div className="text-end">{getStatusBadge(order.status)}</div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Order Items */}
        <Col lg={8}>
          <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-primary text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="fa fa-shopping-bag me-2"></i>
                Order Items
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 p-3">Product</th>
                    <th className="border-0 p-3">SKU</th>
                    <th className="border-0 p-3 text-center">Quantity</th>
                    <th className="border-0 p-3 text-end">Price</th>
                    <th className="border-0 p-3 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems?.map(item => (
                    <tr key={item.id}>
                      <td className="p-3">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.variant.imageUrl || '/content/images/no-image.png'}
                            alt={item.variant.product.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-1">{item.variant.product.name}</h6>
                            <small className="text-muted">Variant: {item.variant.sku}</small>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <code>{item.variant.sku}</code>
                      </td>
                      <td className="p-3 text-center">
                        <Badge bg="secondary">{item.quantity}</Badge>
                      </td>
                      <td className="p-3 text-end">${item.price.toFixed(2)}</td>
                      <td className="p-3 text-end fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Shipping Information */}
          <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-info text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="fa fa-truck me-2"></i>
                Shipping Information
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Name:</strong>
                    <p className="mb-0">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <p className="mb-0">{shippingAddress.email}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Phone:</strong>
                    <p className="mb-0">{shippingAddress.phone}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Address:</strong>
                    <p className="mb-0">{shippingAddress.address}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', position: 'sticky', top: '20px' }}>
            <Card.Header className="bg-success text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="fa fa-receipt me-2"></i>
                Order Summary
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Order Date:</span>
                  <span className="fw-bold">{formatDate(order.createdAt)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Order Status:</span>
                  {getStatusBadge(order.status)}
                </div>
                {order.payment && (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Payment Method:</span>
                      <span className="fw-bold">{order.payment.method}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Payment Status:</span>
                      {getPaymentStatusBadge(order.payment.status)}
                    </div>
                  </>
                )}
              </div>

              <hr />

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span className="fw-bold">${order.total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="fw-bold text-success">Free</span>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold" style={{ fontSize: '1.2rem' }}>
                  Total:
                </span>
                <span className="fw-bold" style={{ fontSize: '1.2rem', color: '#e74c3c' }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => navigate('/orders')} style={{ borderRadius: '25px' }}>
                  <i className="fa fa-list me-2"></i>
                  Back to Orders
                </Button>
                <Button variant="outline-success" onClick={() => navigate('/shop')} style={{ borderRadius: '25px' }}>
                  <i className="fa fa-shopping-cart me-2"></i>
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModernOrderDetail;
