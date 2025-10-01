import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';

interface ShopOrder {
  id: number;
  status: string;
  total: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: Array<{
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
  }>;
  payment?: {
    id: number;
    status: string;
    method: string;
    amount: number;
  };
}

const ModernOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ShopOrder[]>([]);
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
    console.log('ModernOrders useEffect - isAuthenticated:', isAuthenticated, 'account:', account);
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    if (account?.id) {
      console.log('User authenticated, fetching orders');
      fetchOrders();
    } else {
      console.log('Account ID not available yet');
    }
  }, [isAuthenticated, account?.id, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders for user ID:', account?.id);
      const response = await axios.get(`/api/shop-orders/user/${account.id}`);
      console.log('Orders response:', response.data);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
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
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalItems = (order: ShopOrder) => {
    return order.orderItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your orders...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/shop')}>
              Back to Shop
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

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
              <h2 className="mb-1">My Orders</h2>
              <p className="text-muted mb-0">Track and manage your orders</p>
            </div>
            <Button variant="outline-primary" onClick={() => navigate('/shop')} style={{ borderRadius: '25px' }}>
              <i className="fa fa-shopping-cart me-2"></i>
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>

      {orders.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body className="py-5">
                <i className="fa fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No Orders Yet</h4>
                <p className="text-muted mb-4">You haven&apos;t placed any orders yet. Start shopping to see your orders here.</p>
                <Button variant="primary" onClick={() => navigate('/shop')} style={{ borderRadius: '25px' }}>
                  <i className="fa fa-shopping-cart me-2"></i>
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Header className="bg-primary text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0" style={{ fontWeight: '600' }}>
                  <i className="fa fa-list me-2"></i>
                  Order History
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 p-3">Order #</th>
                      <th className="border-0 p-3">Date</th>
                      <th className="border-0 p-3">Items</th>
                      <th className="border-0 p-3">Total</th>
                      <th className="border-0 p-3">Status</th>
                      <th className="border-0 p-3">Payment</th>
                      <th className="border-0 p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="p-3">
                          <Link to={`/orders/${order.id}`} className="text-decoration-none fw-bold" style={{ color: '#007bff' }}>
                            #{order.id}
                          </Link>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="fw-bold">{formatDate(order.createdAt)}</div>
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </small>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="d-flex align-items-center">
                            {order.orderItems &&
                              order.orderItems.length > 0 &&
                              order.orderItems[0].variant &&
                              order.orderItems[0].variant.product && (
                                <>
                                  <img
                                    src={order.orderItems[0].variant.imageUrl || '/content/images/no-image.png'}
                                    alt={order.orderItems[0].variant.product.name || 'Product'}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                                    className="me-2"
                                  />
                                  <div>
                                    <div className="fw-bold">{order.orderItems[0].variant.product.name || 'Unknown Product'}</div>
                                    <small className="text-muted">
                                      {getTotalItems(order)} item{getTotalItems(order) > 1 ? 's' : ''}
                                    </small>
                                  </div>
                                </>
                              )}
                            {(!order.orderItems ||
                              order.orderItems.length === 0 ||
                              !order.orderItems[0].variant ||
                              !order.orderItems[0].variant.product) && (
                              <div>
                                <div className="fw-bold">No Items</div>
                                <small className="text-muted">Order details unavailable</small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="fw-bold">${order.total.toFixed(2)}</span>
                        </td>
                        <td className="p-3">{getStatusBadge(order.status)}</td>
                        <td className="p-3">
                          {order.payment ? (
                            <div>
                              <div className="fw-bold">{order.payment.method}</div>
                              {getPaymentStatusBadge(order.payment.status)}
                            </div>
                          ) : (
                            <Badge bg="secondary">No Payment</Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="outline-primary" size="sm" style={{ borderRadius: '20px' }}>
                              <i className="fa fa-eye me-1"></i>
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ModernOrders;
