import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API calls
    const fetchDashboardData = () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalProducts: 156,
          totalOrders: 89,
          totalUsers: 1247,
          totalRevenue: 12500000,
          recentOrders: [
            { id: 1, customer: 'Nguyễn Văn A', total: 250000, status: 'PENDING', date: '2024-01-15' },
            { id: 2, customer: 'Trần Thị B', total: 180000, status: 'SHIPPED', date: '2024-01-15' },
            { id: 3, customer: 'Lê Văn C', total: 320000, status: 'COMPLETED', date: '2024-01-14' },
            { id: 4, customer: 'Phạm Thị D', total: 150000, status: 'PAID', date: '2024-01-14' },
          ],
          lowStockProducts: [
            { id: 1, name: 'Áo thun nam', sku: 'AT001', stock: 5 },
            { id: 2, name: 'Quần jean nữ', sku: 'QJ002', stock: 3 },
            { id: 3, name: 'Giày thể thao', sku: 'GT003', stock: 2 },
          ],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Chờ xử lý' },
      PAID: { variant: 'info', text: 'Đã thanh toán' },
      SHIPPED: { variant: 'primary', text: 'Đang giao' },
      COMPLETED: { variant: 'success', text: 'Hoàn thành' },
      CANCELED: { variant: 'danger', text: 'Đã hủy' },
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

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
          <h2>Dashboard</h2>
          <p className="text-muted">System management overview</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="text-muted small">Total Products</div>
                  <div className="h4 mb-0">{stats.totalProducts}</div>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    +12% from last month
                  </small>
                </Col>
                <Col xs="auto">
                  <div className="bg-primary text-white rounded-circle p-3">
                    <FaBox size={24} />
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
                  <div className="text-muted small">Total Orders</div>
                  <div className="h4 mb-0">{stats.totalOrders}</div>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    +8% from last month
                  </small>
                </Col>
                <Col xs="auto">
                  <div className="bg-success text-white rounded-circle p-3">
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
                  <div className="text-muted small">Total Users</div>
                  <div className="h4 mb-0">{stats.totalUsers.toLocaleString()}</div>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    +15% from last month
                  </small>
                </Col>
                <Col xs="auto">
                  <div className="bg-info text-white rounded-circle p-3">
                    <FaUsers size={24} />
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
                  <div className="text-muted small">Monthly Revenue</div>
                  <div className="h4 mb-0">{formatCurrency(stats.totalRevenue)}</div>
                  <small className="text-success">
                    <FaArrowUp className="me-1" />
                    +22% from last month
                  </small>
                </Col>
                <Col xs="auto">
                  <div className="bg-warning text-white rounded-circle p-3">
                    <FaDollarSign size={24} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Orders */}
        <Col lg={8} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Orders</h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Low Stock Products */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Low Stock Products</h5>
            </Card.Header>
            <Card.Body>
              {stats.lowStockProducts.map(product => (
                <div key={product.id} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="fw-medium">{product.name}</div>
                    <small className="text-muted">SKU: {product.sku}</small>
                  </div>
                  <Badge bg={product.stock <= 3 ? 'danger' : 'warning'}>{product.stock} items</Badge>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" className="w-100">
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
