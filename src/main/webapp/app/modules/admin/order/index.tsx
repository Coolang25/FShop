import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table, Dropdown, Modal, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities, getEntitiesForAdmin, updateStatus } from 'app/entities/shop-order/shop-order.reducer';
import { IShopOrder } from 'app/shared/model/shop-order.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

interface OrderStatusLabels {
  PENDING: string;
  PAID: string;
  SHIPPED: string;
  COMPLETED: string;
  CANCELED: string;
  RETURNED: string;
}

const OrderManagement = () => {
  const dispatch = useAppDispatch();
  const shopOrderList = useAppSelector(state => state.shopOrder.entities);
  const loading = useAppSelector(state => state.shopOrder.loading);
  const updating = useAppSelector(state => state.shopOrder.updating);

  const [selectedOrder, setSelectedOrder] = useState<IShopOrder | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const orderStatuses: OrderStatusLabels = {
    PENDING: 'Pending',
    PAID: 'Paid',
    SHIPPED: 'Shipped',
    COMPLETED: 'Completed',
    CANCELED: 'Canceled',
    RETURNED: 'Returned',
  };

  useEffect(() => {
    // Use the admin endpoint to get all orders with eager relationships
    dispatch(getEntitiesForAdmin());
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending' },
      PAID: { variant: 'info', text: 'Paid' },
      SHIPPED: { variant: 'primary', text: 'Shipped' },
      COMPLETED: { variant: 'success', text: 'Completed' },
      CANCELED: { variant: 'danger', text: 'Canceled' },
      RETURNED: { variant: 'secondary', text: 'Returned' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleStatusChange = (order: IShopOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'PENDING');
    setShowStatusModal(true);
  };

  const handleShowDetail = (order: IShopOrder) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      await dispatch(updateStatus({ id: selectedOrder.id, status: newStatus }));
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');

      // Refresh the orders list
      dispatch(getEntitiesForAdmin());
    }
  };

  const handleUpdateStatusWrapper = () => {
    void handleUpdateStatus();
  };

  const handleRefreshWrapper = () => {
    dispatch(getEntitiesForAdmin());
  };

  const getTotalItems = (order: IShopOrder) => {
    return order.orderItems?.reduce((total: number, item) => total + (item.quantity || 0), 0) || 0;
  };

  // Parse customer data from JSON format
  const parseCustomerData = (order: IShopOrder) => {
    try {
      // Priority 1: If customer data is stored as JSON string in shippingAddress, parse it
      if (typeof order.shippingAddress === 'string' && order.shippingAddress.startsWith('{')) {
        const customerData = JSON.parse(order.shippingAddress);
        return {
          name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'Unknown Customer',
          email: customerData.email || 'No email',
          phone: customerData.phone || 'N/A',
        };
      }

      // Priority 2: If user data is available, use it (but it only has login, not full info)
      if (order.user) {
        return {
          name: order.user.login || 'Unknown User',
          email: order.user.email || 'No email',
          phone: 'N/A', // Phone not available in user model
        };
      }

      // Fallback to basic info
      return {
        name: 'Unknown Customer',
        email: 'No email',
        phone: 'N/A',
      };
    } catch (error) {
      console.error('Error parsing customer data:', error);
      return {
        name: 'Unknown Customer',
        email: 'No email',
        phone: 'N/A',
      };
    }
  };

  // Parse shipping address from JSON format
  const parseShippingAddress = (order: IShopOrder) => {
    try {
      if (typeof order.shippingAddress === 'string' && order.shippingAddress.startsWith('{')) {
        const addressData = JSON.parse(order.shippingAddress);
        return {
          street: addressData.address || addressData.street || '',
          city: addressData.city || '',
          state: addressData.state || addressData.province || '',
          zipCode: addressData.zipCode || addressData.postalCode || '',
          country: addressData.country || '',
        };
      }
      return {
        street: order.shippingAddress || 'No address provided',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };
    } catch (error) {
      return {
        street: order.shippingAddress || 'No address provided',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };
    }
  };

  // Filter orders by status
  const filteredOrders = shopOrderList.filter(order => {
    if (!statusFilter) return true;
    return order.status === statusFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading orders...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1
                className="mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Order Management
              </h1>
              <p className="text-muted mb-0">Manage and track customer orders</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mb-0 fw-bold">Filter:</label>
                <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '150px' }} size="sm">
                  <option value="">All Status</option>
                  {Object.entries(orderStatuses).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <Button variant="outline-primary" onClick={handleRefreshWrapper} disabled={loading}>
                <i className="fa fa-refresh me-2"></i>
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="fa fa-clock-o fa-2x"></i>
              </div>
              <h4 className="mb-1">{shopOrderList.filter(order => order.status === 'PENDING').length}</h4>
              <p className="text-muted mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="fa fa-truck fa-2x"></i>
              </div>
              <h4 className="mb-1">{shopOrderList.filter(order => order.status === 'SHIPPED').length}</h4>
              <p className="text-muted mb-0">Shipped Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="fa fa-check-circle fa-2x"></i>
              </div>
              <h4 className="mb-1">{shopOrderList.filter(order => order.status === 'COMPLETED').length}</h4>
              <p className="text-muted mb-0">Completed Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="fa fa-shopping-cart fa-2x"></i>
              </div>
              <h4 className="mb-1">{shopOrderList.length}</h4>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="fa fa-list me-2"></i>
                All Orders
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fa fa-shopping-bag fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No Orders Found</h4>
                  <p className="text-muted">No orders have been placed yet.</p>
                </div>
              ) : (
                <Table responsive className="mb-0 table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th className="border-0 p-3">
                        <i className="fa fa-hashtag me-2"></i>Order #
                      </th>
                      <th className="border-0 p-3">
                        <i className="fa fa-user me-2"></i>Customer
                      </th>
                      <th className="border-0 p-3">
                        <i className="fa fa-calendar me-2"></i>Date
                      </th>
                      <th className="border-0 p-3">
                        <i className="fa fa-shopping-bag me-2"></i>Items
                      </th>
                      <th className="border-0 p-3">
                        <i className="fa fa-dollar me-2"></i>Total
                      </th>
                      <th className="border-0 p-3">
                        <i className="fa fa-info-circle me-2"></i>Status
                      </th>
                      <th className="border-0 p-3 text-center">
                        <i className="fa fa-cogs me-2"></i>Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map(order => (
                      <tr key={order.id} className="align-middle" style={{ transition: 'all 0.2s ease' }}>
                        <td className="p-3">
                          <span className="fw-bold">#{order.id}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            {(() => {
                              const customerData = parseCustomerData(order);
                              const addressData = parseShippingAddress(order);
                              return (
                                <>
                                  <div className="fw-bold">{customerData.name}</div>
                                  <small className="text-muted d-block">
                                    <i className="fa fa-envelope me-1"></i>
                                    {customerData.email}
                                  </small>
                                  <small className="text-muted d-block">
                                    <i className="fa fa-phone me-1"></i>
                                    {customerData.phone}
                                  </small>
                                  <small className="text-muted d-block">
                                    <i className="fa fa-map-marker me-1"></i>
                                    {addressData.street.length > 30 ? addressData.street.substring(0, 30) + '...' : addressData.street}
                                  </small>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="fw-bold">{formatDate(order.createdAt ? order.createdAt.toString() : '')}</div>
                            <small className="text-muted">{order.updatedDate ? formatDate(order.updatedDate) : 'Not updated'}</small>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                <i className="fa fa-shopping-bag text-primary"></i>
                              </div>
                              <div>
                                <div className="fw-bold">{getTotalItems(order)} items</div>
                                <small className="text-muted">{order.orderItems?.length || 0} products</small>
                              </div>
                            </div>
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleShowDetail(order)}
                              className="btn-sm"
                              style={{
                                borderRadius: '20px',
                                transition: 'all 0.2s ease',
                                borderWidth: '2px',
                              }}
                            >
                              <i className="fa fa-eye me-1"></i>
                              Detail
                            </Button>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="fw-bold">{formatCurrency(order.total || 0)}</span>
                        </td>
                        <td className="p-3">{getStatusBadge(order.status || 'PENDING')}</td>
                        <td className="p-3 text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleStatusChange(order)}
                              disabled={updating}
                              className="btn-sm"
                              style={{
                                borderRadius: '20px',
                                transition: 'all 0.2s ease',
                                borderWidth: '2px',
                              }}
                            >
                              <i className="fa fa-edit me-1"></i>
                              Update
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* Pagination */}
              {filteredOrders.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                  <div className="text-muted">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(page)} style={{ cursor: 'pointer' }}>
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fa fa-edit me-2"></i>
            Update Order Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedOrder && (
            <div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-muted">
                        <i className="fa fa-info-circle me-2"></i>
                        Order Information
                      </h6>
                      <p className="mb-1">
                        <strong>Order #:</strong> #{selectedOrder.id}
                      </p>
                      <p className="mb-1">
                        <strong>Customer:</strong>{' '}
                        {(() => {
                          const customerData = parseCustomerData(selectedOrder);
                          return customerData.name;
                        })()}
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong>{' '}
                        {(() => {
                          const customerData = parseCustomerData(selectedOrder);
                          return customerData.email;
                        })()}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong>{' '}
                        {(() => {
                          const customerData = parseCustomerData(selectedOrder);
                          return customerData.phone;
                        })()}
                      </p>
                      <p className="mb-1">
                        <strong>Total:</strong> {formatCurrency(selectedOrder.total || 0)}
                      </p>
                      <p className="mb-0">
                        <strong>Shipping Address:</strong>
                        <br />
                        {(() => {
                          const addressData = parseShippingAddress(selectedOrder);
                          return (
                            <small className="text-muted">
                              {addressData.street}
                              {addressData.city && (
                                <>
                                  <br />
                                  {addressData.city}
                                </>
                              )}
                              {addressData.state && (
                                <>
                                  <br />
                                  {addressData.state}
                                </>
                              )}
                              {addressData.zipCode && (
                                <>
                                  <br />
                                  {addressData.zipCode}
                                </>
                              )}
                              {addressData.country && (
                                <>
                                  <br />
                                  {addressData.country}
                                </>
                              )}
                            </small>
                          );
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-muted">
                        <i className="fa fa-flag me-2"></i>
                        Current Status
                      </h6>
                      <div className="mt-2">{getStatusBadge(selectedOrder.status || 'PENDING')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Form.Group className="mt-3">
                <Form.Label className="fw-bold">
                  <i className="fa fa-arrow-right me-2 text-primary"></i>
                  Select New Status
                </Form.Label>
                <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)} size="lg" className="border-2">
                  <option value="">Choose new status...</option>
                  {Object.entries(orderStatuses).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setShowStatusModal(false)} className="px-4">
            <i className="fa fa-times me-2"></i>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatusWrapper} disabled={updating || !newStatus} className="px-4">
            {updating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              <>
                <i className="fa fa-check me-2"></i>
                Update Status
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="xl">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            <i className="fa fa-shopping-bag me-2"></i>
            Order Items Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedOrder && (
            <div>
              {/* Order Info Header */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-muted">
                        <i className="fa fa-info-circle me-2"></i>
                        Order Information
                      </h6>
                      <p className="mb-1">
                        <strong>Order #:</strong> #{selectedOrder.id}
                      </p>
                      <p className="mb-1">
                        <strong>Customer:</strong>{' '}
                        {(() => {
                          const customerData = parseCustomerData(selectedOrder);
                          return customerData.name;
                        })()}
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong>{' '}
                        {(() => {
                          const customerData = parseCustomerData(selectedOrder);
                          return customerData.email;
                        })()}
                      </p>
                      <p className="mb-0">
                        <strong>Total:</strong> {formatCurrency(selectedOrder.total || 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title text-muted">
                        <i className="fa fa-flag me-2"></i>
                        Order Status
                      </h6>
                      <div className="mt-2">{getStatusBadge(selectedOrder.status || 'PENDING')}</div>
                      <p className="mb-1 mt-2">
                        <strong>Date:</strong> {formatDate(selectedOrder.createdAt ? selectedOrder.createdAt.toString() : '')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0 text-primary">
                    <i className="fa fa-shopping-bag me-2"></i>
                    Order Items ({selectedOrder.orderItems?.length || 0})
                  </h5>
                </div>
                <div className="card-body p-0">
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 p-3">Product</th>
                            <th className="border-0 p-3">SKU</th>
                            <th className="border-0 p-3 text-center">Quantity</th>
                            <th className="border-0 p-3 text-end">Price</th>
                            <th className="border-0 p-3 text-end">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.orderItems.map((item, index) => (
                            <tr key={index}>
                              <td className="p-3">
                                <div className="d-flex align-items-center">
                                  <div className="me-3">
                                    {item.variant?.imageUrl ? (
                                      <img
                                        src={item.variant.imageUrl}
                                        alt={item.variant.product?.name || 'Product'}
                                        className="rounded"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        onError={e => {
                                          (e.target as HTMLImageElement).src = '/content/images/placeholder-product.png';
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className="bg-light rounded d-flex align-items-center justify-content-center"
                                        style={{ width: '60px', height: '60px' }}
                                      >
                                        <i className="fa fa-image text-muted"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="fw-bold">{item.variant?.product?.name || 'Unknown Product'}</div>
                                    <small className="text-muted">ID: {item.id}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="badge bg-secondary">{item.variant?.sku || 'N/A'}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="badge bg-primary fs-6">{item.quantity || 0}</span>
                              </td>
                              <td className="p-3 text-end">
                                <span className="fw-bold">{formatCurrency(item.price || 0)}</span>
                              </td>
                              <td className="p-3 text-end">
                                <span className="fw-bold text-primary">{formatCurrency((item.price || 0) * (item.quantity || 0))}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fa fa-shopping-bag fa-3x text-muted mb-3"></i>
                      <h4 className="text-muted">No Items Found</h4>
                      <p className="text-muted">This order doesn&apos;t have any items.</p>
                    </div>
                  )}
                </div>
                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                  <div className="card-footer bg-light border-0">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Total Items:</span>
                          <span className="fw-bold">{getTotalItems(selectedOrder)}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Order Total:</span>
                          <span className="fw-bold text-primary fs-5">{formatCurrency(selectedOrder.total || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)} className="px-4">
            <i className="fa fa-times me-2"></i>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
