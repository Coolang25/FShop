import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Alert, Tabs, Tab, ListGroup } from 'react-bootstrap';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaDownload,
} from 'react-icons/fa';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentMethod: 'COD' | 'CREDIT_CARD' | 'PAYPAL' | 'VNPAY' | 'MOMO';
  total: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  productName: string;
  variantSku: string;
  quantity: number;
  price: number;
  total: number;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    paymentStatus: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    try {
      // Mock data - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          customerName: 'Nguyễn Văn A',
          customerEmail: 'nguyenvana@email.com',
          customerPhone: '0123456789',
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: 'COD',
          total: 750000,
          shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
          items: [
            {
              id: 1,
              productName: 'Áo thun nam cao cấp',
              variantSku: 'AT001-M-RED',
              quantity: 2,
              price: 250000,
              total: 500000,
            },
            {
              id: 2,
              productName: 'Quần jean nữ slim fit',
              variantSku: 'QJ002-28-BLUE',
              quantity: 1,
              price: 450000,
              total: 450000,
            },
          ],
          createdAt: '2024-01-15 10:30:00',
          updatedAt: '2024-01-15 10:30:00',
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          customerName: 'Trần Thị B',
          customerEmail: 'tranthib@email.com',
          customerPhone: '0987654321',
          status: 'SHIPPED',
          paymentStatus: 'SUCCESS',
          paymentMethod: 'VNPAY',
          total: 320000,
          shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
          items: [
            {
              id: 3,
              productName: 'Giày thể thao nam',
              variantSku: 'GT003-42-BLACK',
              quantity: 1,
              price: 320000,
              total: 320000,
            },
          ],
          createdAt: '2024-01-14 14:20:00',
          updatedAt: '2024-01-15 09:15:00',
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          customerName: 'Lê Văn C',
          customerEmail: 'levanc@email.com',
          customerPhone: '0369852147',
          status: 'COMPLETED',
          paymentStatus: 'SUCCESS',
          paymentMethod: 'CREDIT_CARD',
          total: 180000,
          shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
          items: [
            {
              id: 4,
              productName: 'Áo thun nam cao cấp',
              variantSku: 'AT001-L-BLUE',
              quantity: 1,
              price: 180000,
              total: 180000,
            },
          ],
          createdAt: '2024-01-13 16:45:00',
          updatedAt: '2024-01-14 11:30:00',
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateOrder = (order: Order) => {
    setSelectedOrder(order);
    setUpdateForm({
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = () => {
    // Handle update logic here
    console.log('Updating order:', selectedOrder?.id, updateForm);
    setShowUpdateModal(false);
    fetchOrders(); // Refresh the list
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending', icon: FaClock },
      PAID: { variant: 'info', text: 'Paid', icon: FaCreditCard },
      SHIPPED: { variant: 'primary', text: 'Shipping', icon: FaTruck },
      COMPLETED: { variant: 'success', text: 'Completed', icon: FaCheckCircle },
      CANCELED: { variant: 'danger', text: 'Canceled', icon: FaTimesCircle },
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status, icon: FaClock };
    const Icon = config.icon;

    return (
      <Badge bg={config.variant}>
        <Icon className="me-1" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Chờ thanh toán' },
      SUCCESS: { variant: 'success', text: 'Thành công' },
      FAILED: { variant: 'danger', text: 'Thất bại' },
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getPaymentMethodText = (method: string) => {
    const methodConfig = {
      COD: 'Thanh toán khi nhận hàng',
      CREDIT_CARD: 'Thẻ tín dụng',
      PAYPAL: 'PayPal',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
    };
    return methodConfig[method] || method;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Order Management</h2>
              <p className="text-muted">Track and process orders</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary">
                <FaDownload className="me-2" />
                Export Report
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="text-muted small">Total Orders</div>
                  <div className="h4 mb-0">{orders.length}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-primary text-white rounded-circle p-3">
                    <FaShoppingCart size={24} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="text-muted small">Pending</div>
                  <div className="h4 mb-0 text-warning">{orders.filter(o => o.status === 'PENDING').length}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-warning text-white rounded-circle p-3">
                    <FaClock size={24} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="text-muted small">Shipping</div>
                  <div className="h4 mb-0 text-primary">{orders.filter(o => o.status === 'SHIPPED').length}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-primary text-white rounded-circle p-3">
                    <FaTruck size={24} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="text-muted small">Completed</div>
                  <div className="h4 mb-0 text-success">{orders.filter(o => o.status === 'COMPLETED').length}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-success text-white rounded-circle p-3">
                    <FaCheckCircle size={24} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipping</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            <option value="all">All Payments</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="SUCCESS">Payment Success</option>
            <option value="FAILED">Payment Failed</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" className="w-100">
            <FaFilter className="me-2" />
            Filters
          </Button>
        </Col>
      </Row>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Order Code</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Date tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div>
                      <div className="fw-medium">{order.orderNumber}</div>
                      <small className="text-muted">ID: {order.id}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-medium">{order.customerName}</div>
                      <small className="text-muted">{order.customerEmail}</small>
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium">{formatCurrency(order.total)}</div>
                    <small className="text-muted">{order.items.length} products</small>
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div>
                      {getPaymentStatusBadge(order.paymentStatus)}
                      <small className="text-muted d-block">{getPaymentMethodText(order.paymentMethod)}</small>
                    </div>
                  </td>
                  <td>
                    <div>{order.createdAt.split(' ')[0]}</div>
                    <small className="text-muted">{order.createdAt.split(' ')[1]}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" title="View Details" onClick={() => handleViewOrder(order)}>
                        <FaEye />
                      </Button>
                      <Button variant="outline-warning" size="sm" title="Update Status" onClick={() => handleUpdateOrder(order)}>
                        <FaEdit />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Order Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - {selectedOrder?.orderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Customer Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="card-title">
                        <FaUser className="me-2" />
                        Customer Information
                      </h6>
                      <div>
                        <strong>Tên:</strong> {selectedOrder.customerName}
                        <br />
                        <strong>Email:</strong> {selectedOrder.customerEmail}
                        <br />
                        <strong>SĐT:</strong> {selectedOrder.customerPhone}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="card-title">
                        <FaMapMarkerAlt className="me-2" />
                        Shipping Address
                      </h6>
                      <div>{selectedOrder.shippingAddress}</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Order Items */}
              <Row className="mb-4">
                <Col>
                  <h6>Chi tiết products</h6>
                  <ListGroup>
                    {selectedOrder.items.map(item => (
                      <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">{item.productName}</div>
                          <small className="text-muted">SKU: {item.variantSku}</small>
                        </div>
                        <div className="text-end">
                          <div>
                            {item.quantity} x {formatCurrency(item.price)}
                          </div>
                          <div className="fw-medium">{formatCurrency(item.total)}</div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>

              {/* Order Summary */}
              <Row>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="card-title">Order Status</h6>
                      <div className="mb-2">{getStatusBadge(selectedOrder.status)}</div>
                      <div className="mb-2">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</div>
                      <small className="text-muted">Method: {getPaymentMethodText(selectedOrder.paymentMethod)}</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="card-title">Summary</h6>
                      <div className="d-flex justify-content-between">
                        <span>Total:</span>
                        <strong>{formatCurrency(selectedOrder.total)}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span>Date tạo:</span>
                        <span>{selectedOrder.createdAt}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Last Updated:</span>
                        <span>{selectedOrder.updatedAt}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDetailModal(false);
              handleUpdateOrder(selectedOrder);
            }}
          >
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Order Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Order Status</Form.Label>
              <Form.Select value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="SHIPPED">Shipping</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select value={updateForm.paymentStatus} onChange={e => setUpdateForm({ ...updateForm, paymentStatus: e.target.value })}>
                <option value="PENDING">Chờ thanh toán</option>
                <option value="SUCCESS">Thành công</option>
                <option value="FAILED">Thất bại</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
