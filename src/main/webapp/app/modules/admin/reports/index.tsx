import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge, InputGroup, Alert, Tabs, Tab } from 'react-bootstrap';
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaEye,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaBox,
} from 'react-icons/fa';

interface ReportData {
  id: number;
  name: string;
  type: 'SALES' | 'INVENTORY' | 'USERS' | 'PRODUCTS';
  period: string;
  generatedAt: string;
  status: 'READY' | 'GENERATING' | 'ERROR';
  fileUrl?: string;
}

interface SalesReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  dailySales: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

interface InventoryReport {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchSalesReport();
    fetchInventoryReport();
  }, []);

  const fetchReports = () => {
    try {
      // Mock data - replace with actual API call
      const mockReports: ReportData[] = [
        {
          id: 1,
          name: 'Monthly Sales Report - January 2024',
          type: 'SALES',
          period: '2024-01-01 to 2024-01-31',
          generatedAt: '2024-01-31 23:59:00',
          status: 'READY',
          fileUrl: '/reports/sales-jan-2024.pdf',
        },
        {
          id: 2,
          name: 'Inventory Status Report',
          type: 'INVENTORY',
          period: '2024-01-20',
          generatedAt: '2024-01-20 10:30:00',
          status: 'READY',
          fileUrl: '/reports/inventory-jan-2024.pdf',
        },
        {
          id: 3,
          name: 'User Activity Report - Q4 2023',
          type: 'USERS',
          period: '2023-10-01 to 2023-12-31',
          generatedAt: '2023-12-31 23:59:00',
          status: 'READY',
          fileUrl: '/reports/users-q4-2023.pdf',
        },
        {
          id: 4,
          name: 'Weekly Sales Report - Week 3',
          type: 'SALES',
          period: '2024-01-15 to 2024-01-21',
          generatedAt: '2024-01-21 18:00:00',
          status: 'GENERATING',
        },
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchSalesReport = () => {
    try {
      // Mock data - replace with actual API call
      const mockSalesReport: SalesReport = {
        period: 'January 2024',
        totalRevenue: 12500000,
        totalOrders: 245,
        averageOrderValue: 51020,
        topProducts: [
          { name: "Premium Men's T-Shirt", quantity: 45, revenue: 1125000 },
          { name: "Women's Slim Fit Jeans", quantity: 32, revenue: 1440000 },
          { name: 'Leather Handbag', quantity: 18, revenue: 1440000 },
          { name: 'Cotton Dress', quantity: 28, revenue: 1400000 },
          { name: 'Running Shoes', quantity: 22, revenue: 1100000 },
        ],
        dailySales: [
          { date: '2024-01-01', revenue: 450000, orders: 12 },
          { date: '2024-01-02', revenue: 520000, orders: 15 },
          { date: '2024-01-03', revenue: 380000, orders: 9 },
          { date: '2024-01-04', revenue: 610000, orders: 18 },
          { date: '2024-01-05', revenue: 480000, orders: 14 },
        ],
      };
      setSalesReport(mockSalesReport);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  const fetchInventoryReport = () => {
    try {
      // Mock data - replace with actual API call
      const mockInventoryReport: InventoryReport = {
        totalProducts: 156,
        lowStockProducts: 12,
        outOfStockProducts: 3,
        totalValue: 45000000,
        categoryBreakdown: [
          { category: "Men's Fashion", count: 45, value: 18000000 },
          { category: "Women's Fashion", count: 67, value: 20100000 },
          { category: 'Accessories', count: 23, value: 4600000 },
          { category: 'Shoes', count: 21, value: 2300000 },
        ],
      };
      setInventoryReport(mockInventoryReport);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
    }
  };

  const generateReport = async (type: string) => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Generating ${type} report for period:`, dateRange);
      // Refresh reports list
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report: ReportData) => {
    if (report.fileUrl) {
      // Simulate download
      console.log('Downloading report:', report.name);
      // In real app, trigger actual download
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return <Badge bg="success">Ready</Badge>;
      case 'GENERATING':
        return <Badge bg="warning">Generating</Badge>;
      case 'ERROR':
        return <Badge bg="danger">Error</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SALES':
        return <FaDollarSign className="text-success" />;
      case 'INVENTORY':
        return <FaBox className="text-info" />;
      case 'USERS':
        return <FaUsers className="text-primary" />;
      case 'PRODUCTS':
        return <FaShoppingCart className="text-warning" />;
      default:
        return <FaChartBar />;
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Reports & Analytics</h2>
              <p className="text-muted">Generate and view business reports and analytics</p>
            </div>
            <div className="d-flex gap-2">
              <Form.Control
                type="date"
                value={dateRange.startDate}
                onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
                placeholder="Start Date"
                style={{ width: '150px' }}
              />
              <Form.Control
                type="date"
                value={dateRange.endDate}
                onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
                placeholder="End Date"
                style={{ width: '150px' }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaDollarSign size={24} />
              </div>
              <h4 className="mb-1">{salesReport?.totalRevenue.toLocaleString()} VND</h4>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-primary text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaShoppingCart size={24} />
              </div>
              <h4 className="mb-1">{salesReport?.totalOrders}</h4>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-info text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaBox size={24} />
              </div>
              <h4 className="mb-1">{inventoryReport?.totalProducts}</h4>
              <p className="text-muted mb-0">Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-warning text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaUsers size={24} />
              </div>
              <h4 className="mb-1">{reports.length}</h4>
              <p className="text-muted mb-0">Generated Reports</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k || 'overview')} className="mb-4">
        <Tab eventKey="overview" title="Overview">
          <Row>
            <Col md={6}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Sales Performance</h5>
                </Card.Header>
                <Card.Body>
                  {salesReport && (
                    <div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Average Order Value:</span>
                        <strong>{salesReport.averageOrderValue.toLocaleString()} VND</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Period:</span>
                        <strong>{salesReport.period}</strong>
                      </div>
                      <hr />
                      <h6>Top Products</h6>
                      {salesReport.topProducts.slice(0, 3).map((product, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span>{product.name}</span>
                          <span>{product.quantity} sold</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Inventory Status</h5>
                </Card.Header>
                <Card.Body>
                  {inventoryReport && (
                    <div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Total Value:</span>
                        <strong>{inventoryReport.totalValue.toLocaleString()} VND</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Low Stock:</span>
                        <Badge bg="warning">{inventoryReport.lowStockProducts} products</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Out of Stock:</span>
                        <Badge bg="danger">{inventoryReport.outOfStockProducts} products</Badge>
                      </div>
                      <hr />
                      <h6>Category Breakdown</h6>
                      {inventoryReport.categoryBreakdown.map((category, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span>{category.category}</span>
                          <span>{category.count} items</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="generate" title="Generate Reports">
          <Row>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Sales Reports</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-success" onClick={() => void generateReport('SALES')} disabled={loading}>
                      <FaDollarSign className="me-2" />
                      Generate Sales Report
                    </Button>
                    <Button variant="outline-primary" onClick={() => void generateReport('DAILY_SALES')} disabled={loading}>
                      <FaChartLine className="me-2" />
                      Generate Daily Sales Report
                    </Button>
                    <Button variant="outline-info" onClick={() => void generateReport('PRODUCT_PERFORMANCE')} disabled={loading}>
                      <FaChartPie className="me-2" />
                      Generate Product Performance Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Other Reports</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button variant="outline-warning" onClick={() => void generateReport('INVENTORY')} disabled={loading}>
                      <FaBox className="me-2" />
                      Generate Inventory Report
                    </Button>
                    <Button variant="outline-secondary" onClick={() => void generateReport('USERS')} disabled={loading}>
                      <FaUsers className="me-2" />
                      Generate User Activity Report
                    </Button>
                    <Button variant="outline-dark" onClick={() => void generateReport('CUSTOM')} disabled={loading}>
                      <FaFilter className="me-2" />
                      Generate Custom Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="history" title="Report History">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Generated Reports</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Report Name</th>
                    <th>Type</th>
                    <th>Period</th>
                    <th>Generated</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getTypeIcon(report.type)}
                          <span className="ms-2">{report.name}</span>
                        </div>
                      </td>
                      <td>
                        <Badge bg="secondary">{report.type}</Badge>
                      </td>
                      <td>{report.period}</td>
                      <td>{report.generatedAt}</td>
                      <td>{getStatusBadge(report.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          {report.status === 'READY' && (
                            <Button variant="outline-primary" size="sm" onClick={() => downloadReport(report)}>
                              <FaDownload />
                            </Button>
                          )}
                          <Button variant="outline-info" size="sm">
                            <FaEye />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Generating report...</span>
          </div>
          <p className="mt-2">Generating report, please wait...</p>
        </div>
      )}
    </Container>
  );
};

export default ReportsManagement;
