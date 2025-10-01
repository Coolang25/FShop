import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
    imageUrl?: string;
    product: {
      id: number;
      name: string;
    };
    attributeValues: Array<{
      id: number;
      value: string;
      attributeName: string;
    }>;
  };
}

interface Cart {
  id: number | null;
  items: CartItem[];
}

const ModernCart: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [localChanges, setLocalChanges] = useState<Map<number, number>>(new Map()); // Track local quantity changes
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set()); // Track selected items for checkout
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const navigate = useNavigate();

  const showToastMessage = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  useEffect(() => {
    if (isAuthenticated && account?.id) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, account?.id]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Fetching cart for user:', account.id); // Debug log

      // First test if API is working
      try {
        const testResponse = await axios.get(`/api/carts/test/user/${account.id}`);
        console.log('Test API response:', testResponse.data); // Debug log
      } catch (testErr) {
        console.error('Test API failed:', testErr);
      }

      // Use optimized single API call to get cart with items
      const response = await axios.get(`/api/carts/with-items/user/${account.id}`);
      console.log('Cart API response:', response.data); // Debug log
      console.log('Response data type:', typeof response.data); // Debug log
      console.log('Response data keys:', Object.keys(response.data || {})); // Debug log
      console.log('Cart ID from API:', response.data?.id); // Debug log

      if (response.data) {
        console.log('Setting cart with ID:', response.data.id, 'Items count:', response.data.items?.length || 0);
        setCart(response.data);
      } else {
        console.log('No response data'); // Debug log
        setCart(null);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      console.error('Error details:', err.response?.data); // Debug log
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Find the current item to get original quantity
    const currentItem = cart?.items?.find(item => item.id === itemId);
    if (!currentItem) {
      console.error('Item not found in cart:', itemId);
      return;
    }

    console.log('Updating local quantity for item:', itemId, 'from:', currentItem.quantity, 'to:', newQuantity);

    // Update local state immediately
    if (cart && cart.items) {
      const updatedItems = cart.items.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item));
      setCart({ ...cart, items: updatedItems });
    }

    // Track local changes
    if (newQuantity === currentItem.quantity) {
      // If quantity is back to original, remove from local changes
      const newLocalChanges = new Map(localChanges);
      newLocalChanges.delete(itemId);
      setLocalChanges(newLocalChanges);
    } else {
      // Track the change
      const newLocalChanges = new Map(localChanges);
      newLocalChanges.set(itemId, newQuantity);
      setLocalChanges(newLocalChanges);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      console.log('Removing item:', itemId); // Debug log
      await axios.delete(`/api/cart-items/${itemId}`);
      console.log('Item removed successfully'); // Debug log
      await fetchCart(); // Refresh cart
      // Trigger cart count refresh in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Error removing item:', err);
      console.error('Error details:', err.response?.data); // Debug log
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSelectedItemsTotal = () => {
    if (!cart?.items || selectedItems.size === 0) return 0;
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => {
        const quantity = localChanges.get(item.id) ?? item.quantity;
        return total + item.price * quantity;
      }, 0);
  };

  const getSelectedItemsCount = () => {
    if (!cart?.items || selectedItems.size === 0) return 0;
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => {
        const quantity = localChanges.get(item.id) ?? item.quantity;
        return total + quantity;
      }, 0);
  };

  const toggleItemSelection = (itemId: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const selectAllItems = () => {
    if (!cart?.items) return;
    const allItemIds = cart.items.map(item => item.id);
    setSelectedItems(new Set(allItemIds));
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const saveAllChanges = async () => {
    if (localChanges.size === 0) {
      showToastMessage('No changes to save', 'error');
      return;
    }

    try {
      console.log('Saving all local changes to backend:', localChanges);
      console.log('Current cart ID before save:', cart?.id);
      console.log('Current cart items count:', cart?.items?.length || 0);

      const updatePromises = Array.from(localChanges.entries()).map(async ([itemId, newQuantity]) => {
        const currentItem = cart?.items?.find(item => item.id === itemId);
        if (!currentItem) return;

        const updateData = {
          id: itemId,
          quantity: newQuantity,
          price: currentItem.price,
          cart: { id: cart?.id },
          variant: currentItem.variant,
        };

        console.log('Saving item:', itemId, 'to quantity:', newQuantity);
        console.log('Update payload:', updateData);
        const response = await axios.put(`/api/cart-items/${itemId}`, updateData);
        console.log('Update response for item', itemId, ':', response.data);
        return response;
      });

      await Promise.all(updatePromises);
      console.log('All changes saved successfully');

      // Clear all local changes
      setLocalChanges(new Map());

      // Refresh cart from backend
      await fetchCart();
      console.log('Cart ID after fetch:', cart?.id);

      showToastMessage('All changes saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving changes:', err);
      showToastMessage('Error saving changes. Please try again.', 'error');
    }
  };

  const syncSelectedItemsToBackend = async () => {
    if (selectedItems.size === 0) return;

    console.log('Syncing selected items to backend:', selectedItems);
    console.log('Local changes for selected items:', localChanges);

    try {
      const updatePromises = Array.from(selectedItems).map(async itemId => {
        const currentItem = cart?.items?.find(item => item.id === itemId);
        if (!currentItem) return;

        // Use local change quantity if exists, otherwise use current quantity
        const newQuantity = localChanges.get(itemId) ?? currentItem.quantity;

        const updateData = {
          id: itemId,
          quantity: newQuantity,
          price: currentItem.price,
          cart: { id: cart?.id },
          variant: currentItem.variant,
        };

        console.log('Syncing selected item:', itemId, 'to quantity:', newQuantity);
        return axios.put(`/api/cart-items/${itemId}`, updateData);
      });

      await Promise.all(updatePromises);
      console.log('All selected items synced successfully');

      // Clear local changes for selected items only
      const newLocalChanges = new Map(localChanges);
      selectedItems.forEach(itemId => {
        newLocalChanges.delete(itemId);
      });
      setLocalChanges(newLocalChanges);

      // Refresh cart from backend
      await fetchCart();
    } catch (err) {
      console.error('Error syncing selected items:', err);
      throw err;
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      showToastMessage('Please select at least one item to checkout', 'error');
      return;
    }

    try {
      // Only sync if there are local changes for selected items
      const hasChangesForSelectedItems = Array.from(selectedItems).some(itemId => localChanges.has(itemId));

      if (hasChangesForSelectedItems) {
        console.log('Syncing changes for selected items before checkout');
        await syncSelectedItemsToBackend();
      } else {
        console.log('No changes to sync for selected items');
      }

      // Then proceed to checkout with selected items
      console.log('Proceeding to checkout with items:', Array.from(selectedItems));

      // Pass selected items to checkout page via localStorage
      const selectedItemsArray = Array.from(selectedItems);
      console.log('Saving selected items to localStorage:', selectedItemsArray);
      localStorage.setItem('selectedItems', JSON.stringify(selectedItemsArray));

      // Navigate to checkout page
      navigate('/checkout');
    } catch (err) {
      console.error('Error during checkout preparation:', err);
      showToastMessage('Error preparing checkout. Please try again.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '2.5rem',
            }}
          >
            <i className="fa fa-shopping-cart"></i>
          </div>
          <h3 className="mb-3">Please Login to View Your Cart</h3>
          <p className="text-muted mb-4">You need to be logged in to access your shopping cart.</p>
          <Link to="/login">
            <Button
              variant="primary"
              size="lg"
              style={{
                borderRadius: '25px',
                padding: '12px 30px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              <i className="fa fa-sign-in me-2"></i>
              Login Now
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading your cart...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '2.5rem',
            }}
          >
            <i className="fa fa-shopping-cart"></i>
          </div>
          <h3 className="mb-3">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Looks like you haven&apos;t added any items to your cart yet.</p>

          {/* Debug info */}
          <div className="mt-4 p-3 bg-light rounded" style={{ fontSize: '0.9rem' }}>
            <strong>Debug Info:</strong>
            <br />
            Cart: {cart ? 'Exists' : 'Null'}
            <br />
            Items: {cart?.items ? cart.items.length : 'No items array'}
            <br />
            User ID: {account?.id}
          </div>

          <Link to="/shop" className="mt-3 d-inline-block">
            <Button
              variant="primary"
              size="lg"
              style={{
                borderRadius: '25px',
                padding: '12px 30px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              <i className="fa fa-shopping-bag me-2"></i>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="modern-cart">
      <Container className="py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ fontWeight: '700', color: '#2c3e50' }}>
              Shopping Cart
            </h2>
            <p className="text-muted mb-0">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
              {localChanges.size > 0 && <span className="ms-2 text-warning">• {localChanges.size} pending changes</span>}
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            {localChanges.size > 0 && (
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => {
                  saveAllChanges();
                }}
                style={{
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontWeight: '600',
                }}
              >
                <i className="fa fa-save me-2"></i>
                Save All Changes
              </Button>
            )}
            <Badge
              bg="primary"
              style={{
                fontSize: '1rem',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: '600',
              }}
            >
              Total: ${calculateTotal().toFixed(2)}
            </Badge>
          </div>
        </div>

        <Row>
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Header className="bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                  Cart Items
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="border-0 py-3 px-4" style={{ fontWeight: '600', width: '50px' }}>
                          <input
                            type="checkbox"
                            checked={selectedItems.size === cart?.items?.length && cart?.items?.length > 0}
                            onChange={() => {
                              if (selectedItems.size === cart?.items?.length) {
                                deselectAllItems();
                              } else {
                                selectAllItems();
                              }
                            }}
                            style={{ transform: 'scale(1.2)' }}
                          />
                        </th>
                        <th className="border-0 py-3 px-4" style={{ fontWeight: '600' }}>
                          Product
                        </th>
                        <th className="border-0 py-3 px-4" style={{ fontWeight: '600' }}>
                          Price
                        </th>
                        <th className="border-0 py-3 px-4" style={{ fontWeight: '600' }}>
                          Quantity
                        </th>
                        <th className="border-0 py-3 px-4" style={{ fontWeight: '600' }}>
                          Total
                        </th>
                        <th className="border-0 py-3 px-4" style={{ fontWeight: '600' }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map(item => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-4 px-4" style={{ width: '50px' }}>
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItemSelection(item.id)}
                              style={{ transform: 'scale(1.2)' }}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="d-flex align-items-center">
                              <div
                                className="me-3"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  backgroundImage: `url(${item.variant.imageUrl || '/content/img/products/product-1.jpg'})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  borderRadius: '10px',
                                }}
                              />
                              <div>
                                <h6 className="mb-1" style={{ fontWeight: '600', color: '#2c3e50' }}>
                                  {item.variant.product.name}
                                </h6>
                                <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                                  SKU: {item.variant.sku}
                                </p>
                                {item.variant.attributeValues.map((attr, index) => (
                                  <Badge key={index} bg="light" text="dark" className="me-1" style={{ fontSize: '0.75rem' }}>
                                    {attr.attributeName}: {attr.value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="fw-bold" style={{ color: '#e74c3c' }}>
                              ${item.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="d-flex align-items-center">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  updateQuantity(item.id, item.quantity - 1);
                                }}
                                disabled={updating === item.id || item.quantity <= 1}
                                style={{ borderRadius: '50%', width: '32px', height: '32px' }}
                              >
                                -
                              </Button>
                              <span className="mx-3 fw-bold">{item.quantity}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  updateQuantity(item.id, item.quantity + 1);
                                }}
                                disabled={updating === item.id || item.quantity >= item.variant.stock}
                                style={{ borderRadius: '50%', width: '32px', height: '32px' }}
                              >
                                +
                              </Button>
                            </div>
                            {updating === item.id && <Spinner size="sm" className="ms-2" />}
                          </td>
                          <td className="py-4 px-4">
                            <span className="fw-bold" style={{ color: '#e74c3c' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                removeItem(item.id);
                              }}
                              style={{ borderRadius: '20px' }}
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Header className="bg-primary text-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0" style={{ fontWeight: '600' }}>
                  Order Summary
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Selection Summary */}
                <div className="mb-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">Selected Items:</span>
                    <span className="fw-bold text-primary">{selectedItems.size}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Selected Quantity:</span>
                    <span className="fw-bold">{getSelectedItemsCount()}</span>
                  </div>
                </div>

                {selectedItems.size > 0 ? (
                  <>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Selected Items ({getSelectedItemsCount()} items):</span>
                      <span className="fw-bold">${getSelectedItemsTotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping:</span>
                      <span className="fw-bold text-success">Free</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax:</span>
                      <span className="fw-bold">$0.00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold" style={{ fontSize: '1.1rem' }}>
                        Checkout Total:
                      </span>
                      <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#e74c3c' }}>
                        ${getSelectedItemsTotal().toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal ({getTotalItems()} items):</span>
                      <span className="fw-bold">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping:</span>
                      <span className="fw-bold text-success">Free</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax:</span>
                      <span className="fw-bold">$0.00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold" style={{ fontSize: '1.1rem' }}>
                        Total:
                      </span>
                      <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#e74c3c' }}>
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </>
                )}

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      handleCheckout();
                    }}
                    disabled={selectedItems.size === 0}
                    style={{
                      borderRadius: '25px',
                      padding: '12px',
                      fontWeight: '600',
                      background: selectedItems.size === 0 ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                    }}
                  >
                    <i className="fa fa-credit-card me-2"></i>
                    {selectedItems.size === 0 ? 'Select Items to Checkout' : `Checkout ${selectedItems.size} Selected Items`}
                  </Button>
                  <Link to="/shop">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="w-100"
                      style={{
                        borderRadius: '25px',
                        padding: '12px',
                        fontWeight: '600',
                      }}
                    >
                      <i className="fa fa-arrow-left me-2"></i>
                      Continue Shopping
                    </Button>
                  </Link>
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
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-white'}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ModernCart;
