import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';

interface CartItem {
  id: number;
  quantity: number;
  price: number;
  variant: {
    id: number;
    sku: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive: boolean;
    product: {
      id: number;
      name: string;
    };
  };
}

interface Cart {
  id: number | null;
  items: CartItem[];
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const ModernCheckout: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const showToastMessage = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
      return;
    }

    if (account?.id) {
      fetchCart();
    }
  }, [isAuthenticated, account?.id, navigate, location.pathname]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/carts/with-items/user/${account.id}`);
      console.log('Checkout cart response:', response.data);

      if (response.data && response.data.items && response.data.items.length > 0) {
        // Get selected items from localStorage (passed from cart page)
        const selectedItemsData = localStorage.getItem('selectedItems');
        console.log('fetchCart - localStorage selectedItems:', selectedItemsData);
        const selectedItemsArray = selectedItemsData ? JSON.parse(selectedItemsData) : [];
        console.log('fetchCart - parsed selectedItemsArray:', selectedItemsArray);
        const selectedItemsSet = new Set<number>(selectedItemsArray.map((id: any) => Number(id)));
        console.log('fetchCart - selectedItemsSet:', selectedItemsSet);
        setSelectedItems(selectedItemsSet);

        // Clear localStorage after reading (to prevent reuse)
        localStorage.removeItem('selectedItems');
        console.log('fetchCart - cleared selectedItems from localStorage');

        // Filter cart items to only include selected items
        const filteredItems = response.data.items.filter((item: CartItem) => selectedItemsSet.has(item.id));

        if (filteredItems.length === 0) {
          setError('No selected items to checkout');
          return;
        }

        // Create cart with only selected items
        const filteredCart = {
          ...response.data,
          items: filteredItems,
        };

        setCart(filteredCart);

        // Pre-fill user info from account
        setShippingAddress({
          firstName: account.firstName || '',
          lastName: account.lastName || '',
          email: account.email || '',
          phone: '',
          address: '',
        });
      } else {
        setError('No items in cart to checkout');
      }
    } catch (err) {
      console.error('Error fetching cart for checkout:', err);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedItemsTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedItemsCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateShipping = () => {
    const total = getSelectedItemsTotal();
    return total > 100 ? 0 : 10; // Free shipping over $100
  };

  const getTotalAmount = () => {
    const subtotal = getSelectedItemsTotal();
    const shipping = calculateShipping();
    return subtotal + shipping;
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address'];

    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        showToastMessage(`Please fill in ${field}`, 'error');
        return false;
      }
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      console.log('Processing payment...');

      // Get selected item IDs from state (already loaded from localStorage in fetchCart)
      const selectedItemIds = Array.from(selectedItems);
      console.log('Selected items from state:', selectedItems);
      console.log('Selected item IDs array:', selectedItemIds);

      // Prepare checkout payload
      const checkoutPayload = {
        userId: account.id,
        total: getTotalAmount(),
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'PENDING',
        selectedItemIds,
      };
      console.log('Checkout payload:', checkoutPayload);

      // Call checkout API
      const response = await axios.post('/api/shop-orders/checkout', checkoutPayload);
      console.log('Checkout response:', response.data);

      showToastMessage('Order placed successfully! Redirecting...', 'success');

      // Clear selected items from localStorage (already cleared in fetchCart, but just in case)
      localStorage.removeItem('selectedItems');

      // Trigger cart count refresh in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Redirect to orders list
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error('Error processing payment:', err);
      showToastMessage('Payment failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Please login to checkout</h3>
          <Link to="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading checkout...</p>
        </div>
      </Container>
    );
  }

  if (error || !cart?.items?.length) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Alert variant="warning">
            <h4>No items to checkout</h4>
            <p>Your cart is empty. Please add some items before proceeding to checkout.</p>
            <Link to="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            {/* Shipping Information */}
            <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Header className="bg-primary text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0" style={{ fontWeight: '600' }}>
                  <i className="fa fa-shipping-fast me-2"></i>
                  Shipping Information
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shippingAddress.firstName}
                        readOnly
                        style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shippingAddress.lastName}
                        readOnly
                        style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        value={shippingAddress.email}
                        readOnly
                        style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    value={shippingAddress.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    placeholder="Enter street address"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Order Summary */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', position: 'sticky', top: '20px' }}>
              <Card.Header className="bg-primary text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0" style={{ fontWeight: '600' }}>
                  <i className="fa fa-shopping-cart me-2"></i>
                  Order Summary
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Items List */}
                <div className="mb-3">
                  {cart.items.map(item => (
                    <div key={item.id} className="d-flex align-items-center mb-3 p-2 bg-light rounded">
                      <img
                        src={item.variant.imageUrl || '/content/images/no-image.png'}
                        alt={item.variant.product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                          {item.variant.product.name}
                        </h6>
                        <small className="text-muted">SKU: {item.variant.sku}</small>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span className="text-muted">Qty: {item.quantity}</span>
                          <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Price Breakdown */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal ({getSelectedItemsCount()} items):</span>
                    <span className="fw-bold">${getSelectedItemsTotal().toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="fw-bold">
                      {calculateShipping() === 0 ? <span className="text-success">Free</span> : `$${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold" style={{ fontSize: '1.2rem' }}>
                    Total:
                  </span>
                  <span className="fw-bold" style={{ fontSize: '1.2rem', color: '#e74c3c' }}>
                    ${getTotalAmount().toFixed(2)}
                  </span>
                </div>

                {/* Place Order Button */}
                <Button
                  variant="success"
                  size="lg"
                  className="w-100"
                  onClick={() => {
                    processPayment();
                  }}
                  disabled={processing}
                  style={{
                    borderRadius: '25px',
                    padding: '15px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                  }}
                >
                  {processing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-shopping-cart me-2"></i>
                      Place Order (Cash on Delivery) - ${getTotalAmount().toFixed(2)}
                    </>
                  )}
                </Button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="fa fa-shield-alt me-1"></i>
                    Secure payment powered by SSL encryption
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
          <Toast.Header>
            <i
              className={`fa ${toastVariant === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger'} me-2`}
            ></i>
            <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ModernCheckout;
