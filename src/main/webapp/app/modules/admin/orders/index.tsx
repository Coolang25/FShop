import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table, Dropdown, Modal, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities, updateEntity } from 'app/entities/shop-order/shop-order.reducer';
import { IShopOrder } from 'app/shared/model/shop-order.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

interface OrderStatusLabels {
  PENDING: string;
  PAID: string;
  SHIPPED: string;
  COMPLETED: string;
  CANCELED: string;
  RETURNED: string;
}

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const shopOrderList = useAppSelector(state => state.shopOrder.entities);
  const loading = useAppSelector(state => state.shopOrder.loading);
  const updating = useAppSelector(state => state.shopOrder.updating);

  const [selectedOrder, setSelectedOrder] = useState<IShopOrder | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
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
    dispatch(getEntities({}));
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
      return new Date(dateString).toLocaleDateString('en-US', {
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

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      const updatedOrder = {
        ...selectedOrder,
        status: newStatus as keyof typeof OrderStatus,
      };

      await dispatch(updateEntity(updatedOrder));
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');

      // Refresh the orders list
      dispatch(getEntities({}));
    }
  };

  const handleUpdateStatusWrapper = () => {
    void handleUpdateStatus();
  };

  const getTotalItems = (order: IShopOrder) => {
    return (order as any).orderItems?.reduce((total: number, item: any) => total + (item.quantity || 0), 0) || 0;
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
              <Button variant="outline-primary" onClick={() => dispatch(getEntities({}))} disabled={loading}>
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
                            <div className="fw-bold">{order.user?.login || order.user?.firstName || 'Unknown User'}</div>
                            <small className="text-muted">
                              {order.shippingAddress
                                ? order.shippingAddress.length > 30
                                  ? order.shippingAddress.substring(0, 30) + '...'
                                  : order.shippingAddress
                                : 'No address'}
                            </small>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="fw-bold">{formatDate(order.createdDate || order.createdAt || '')}</div>
                            <small className="text-muted">{order.updatedDate ? formatDate(order.updatedDate) : 'Not updated'}</small>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="fa fa-shopping-bag text-primary"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{getTotalItems(order)} items</div>
                              <small className="text-muted">{order.orderItems?.length || 0} products</small>
                            </div>
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
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p>
                <strong>Order #:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.user?.login || 'Unknown User'}
              </p>
              <p>
                <strong>Current Status:</strong> {getStatusBadge(selectedOrder.status || 'PENDING')}
              </p>

              <Form.Group className="mt-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatusWrapper} disabled={updating || !newStatus}>
            {updating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;
