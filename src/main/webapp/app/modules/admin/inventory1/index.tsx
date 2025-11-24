import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Alert, Tabs, Tab } from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaWarehouse,
  FaBox,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
  FaFilter,
} from 'react-icons/fa';

interface ProductVariant {
  id: number;
  sku: string;
  productName: string;
  attributes: { [key: string]: string };
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
}

interface StockTransaction {
  id: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  variantId: number;
  variantSku: string;
  productName: string;
  quantity: number;
  reason: string;
  reference: string;
  createdAt: string;
  createdBy: string;
}

const InventoryManagement = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>('IN');

  // Form states
  const [transactionForm, setTransactionForm] = useState({
    variantId: '',
    quantity: '',
    reason: '',
    reference: '',
  });

  const [adjustmentForm, setAdjustmentForm] = useState({
    variantId: '',
    newStock: '',
    reason: '',
  });

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = () => {
    try {
      // Mock data - replace with actual API calls
      const mockVariants: ProductVariant[] = [
        {
          id: 1,
          sku: 'AT001-S-RED',
          productName: 'Áo thun nam cao cấp',
          attributes: { Size: 'S', Color: 'Đỏ' },
          currentStock: 45,
          reservedStock: 5,
          availableStock: 40,
          minStock: 10,
          maxStock: 100,
          lastUpdated: '2024-01-15',
        },
        {
          id: 2,
          sku: 'AT001-M-RED',
          productName: 'Áo thun nam cao cấp',
          attributes: { Size: 'M', Color: 'Đỏ' },
          currentStock: 25,
          reservedStock: 3,
          availableStock: 22,
          minStock: 10,
          maxStock: 100,
          lastUpdated: '2024-01-15',
        },
        {
          id: 3,
          sku: 'QJ002-28-BLUE',
          productName: 'Quần jean nữ slim fit',
          attributes: { Size: '28', Color: 'Xanh' },
          currentStock: 5,
          reservedStock: 2,
          availableStock: 3,
          minStock: 10,
          maxStock: 50,
          lastUpdated: '2024-01-14',
        },
        {
          id: 4,
          sku: 'GT003-42-BLACK',
          productName: 'Giày thể thao nam',
          attributes: { Size: '42', Color: 'Đen' },
          currentStock: 0,
          reservedStock: 0,
          availableStock: 0,
          minStock: 5,
          maxStock: 30,
          lastUpdated: '2024-01-13',
        },
      ];

      const mockTransactions: StockTransaction[] = [
        {
          id: 1,
          type: 'IN',
          variantId: 1,
          variantSku: 'AT001-S-RED',
          productName: 'Áo thun nam cao cấp',
          quantity: 50,
          reason: 'Stock In từ nhà cung cấp',
          reference: 'PO-2024-001',
          createdAt: '2024-01-15 10:30:00',
          createdBy: 'Admin',
        },
        {
          id: 2,
          type: 'OUT',
          variantId: 1,
          variantSku: 'AT001-S-RED',
          productName: 'Áo thun nam cao cấp',
          quantity: -5,
          reason: 'Bán hàng',
          reference: 'SO-2024-001',
          createdAt: '2024-01-15 14:20:00',
          createdBy: 'System',
        },
        {
          id: 3,
          type: 'ADJUSTMENT',
          variantId: 3,
          variantSku: 'QJ002-28-BLUE',
          productName: 'Quần jean nữ slim fit',
          quantity: -2,
          reason: 'Kiểm kê phát hiện thiếu',
          reference: 'ADJ-2024-001',
          createdAt: '2024-01-14 16:45:00',
          createdBy: 'Admin',
        },
      ];

      setVariants(mockVariants);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = (type: 'IN' | 'OUT' | 'ADJUSTMENT') => {
    setTransactionType(type);
    setTransactionForm({
      variantId: '',
      quantity: '',
      reason: '',
      reference: '',
    });
    setShowTransactionModal(true);
  };

  const handleAdjustStock = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setAdjustmentForm({
      variantId: variant.id.toString(),
      newStock: variant.currentStock.toString(),
      reason: '',
    });
    setShowAdjustmentModal(true);
  };

  const handleSaveTransaction = () => {
    // Handle save logic here
    console.log('Saving transaction:', transactionForm, transactionType);
    setShowTransactionModal(false);
    fetchInventoryData(); // Refresh the data
  };

  const handleSaveAdjustment = () => {
    // Handle save logic here
    console.log('Saving adjustment:', adjustmentForm);
    setShowAdjustmentModal(false);
    fetchInventoryData(); // Refresh the data
  };

  const getStockStatus = (variant: ProductVariant) => {
    if (variant.currentStock === 0) {
      return { variant: 'danger', text: 'Out of Stock', icon: FaExclamationTriangle };
    } else if (variant.currentStock <= variant.minStock) {
      return { variant: 'warning', text: 'Sắp hết', icon: FaExclamationTriangle };
    } else if (variant.currentStock >= variant.maxStock * 0.9) {
      return { variant: 'info', text: 'Đầy kho', icon: FaCheckCircle };
    } else {
      return { variant: 'success', text: 'Normal', icon: FaCheckCircle };
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return <FaArrowUp className="text-success" />;
      case 'OUT':
        return <FaArrowDown className="text-danger" />;
      case 'ADJUSTMENT':
        return <FaEdit className="text-warning" />;
      default:
        return <FaBox />;
    }
  };

  const filteredVariants = variants.filter(variant => {
    const matchesSearch =
      variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) || variant.productName.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (stockFilter === 'low') {
      matchesFilter = variant.currentStock <= variant.minStock;
    } else if (stockFilter === 'out') {
      matchesFilter = variant.currentStock === 0;
    } else if (stockFilter === 'normal') {
      matchesFilter = variant.currentStock > variant.minStock && variant.currentStock < variant.maxStock * 0.9;
    }

    return matchesSearch && matchesFilter;
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
              <h2>Inventory Management</h2>
              <p className="text-muted">Track and manage product inventory</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="success" onClick={() => handleAddTransaction('IN')}>
                <FaArrowUp className="me-2" />
                Stock In
              </Button>
              <Button variant="danger" onClick={() => handleAddTransaction('OUT')}>
                <FaArrowDown className="me-2" />
                Stock Out
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
                  <div className="text-muted small">Total Products</div>
                  <div className="h4 mb-0">{variants.length}</div>
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
                  <div className="text-muted small">Total Stock</div>
                  <div className="h4 mb-0">{variants.reduce((sum, v) => sum + v.currentStock, 0)}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-success text-white rounded-circle p-3">
                    <FaWarehouse size={24} />
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
                  <div className="text-muted small">Low Stock</div>
                  <div className="h4 mb-0 text-warning">{variants.filter(v => v.currentStock <= v.minStock).length}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-warning text-white rounded-circle p-3">
                    <FaExclamationTriangle size={24} />
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
                  <div className="text-muted small">Out of Stock</div>
                  <div className="h4 mb-0 text-danger">{variants.filter(v => v.currentStock === 0).length}</div>
                </Col>
                <Col xs="auto">
                  <div className="bg-danger text-white rounded-circle p-3">
                    <FaExclamationTriangle size={24} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search SKU or product name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="normal">Normal</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="outline-secondary" className="w-100">
            <FaFilter className="me-2" />
            Advanced Filters
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k || 'stock')} className="mb-4">
        <Tab eventKey="stock" title="Current Stock">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Thuộc tính</th>
                    <th>Tồn kho</th>
                    <th>Reserved</th>
                    <th>Available</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVariants.map(variant => {
                    const status = getStockStatus(variant);
                    const StatusIcon = status.icon;

                    return (
                      <tr key={variant.id}>
                        <td>
                          <code>{variant.sku}</code>
                        </td>
                        <td>{variant.productName}</td>
                        <td>
                          <div>
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <Badge key={key} bg="secondary" className="me-1">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={variant.currentStock <= variant.minStock ? 'text-warning fw-bold' : ''}>
                            {variant.currentStock}
                          </span>
                          <small className="text-muted d-block">
                            Min: {variant.minStock} | Max: {variant.maxStock}
                          </small>
                        </td>
                        <td>{variant.reservedStock}</td>
                        <td>{variant.availableStock}</td>
                        <td>
                          <Badge bg={status.variant}>
                            <StatusIcon className="me-1" />
                            {status.text}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-warning" size="sm" title="Adjust Stock" onClick={() => handleAdjustStock(variant)}>
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              title="Transaction History"
                              onClick={() => setActiveTab('transactions')}
                            >
                              <FaHistory />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="transactions" title="Transaction History">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Stock Transaction History</h5>
                <Button variant="outline-primary" size="sm">
                  Export Report
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Reference</th>
                    <th>Created Date</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getTransactionIcon(transaction.type)}
                          <span className="ms-2">
                            {transaction.type === 'IN' ? 'In' : transaction.type === 'OUT' ? 'Out' : 'Adjustment'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <code>{transaction.variantSku}</code>
                      </td>
                      <td>{transaction.productName}</td>
                      <td>
                        <span className={transaction.quantity > 0 ? 'text-success' : 'text-danger'}>
                          {transaction.quantity > 0 ? '+' : ''}
                          {transaction.quantity}
                        </span>
                      </td>
                      <td>{transaction.reason}</td>
                      <td>
                        <code>{transaction.reference}</code>
                      </td>
                      <td>{transaction.createdAt}</td>
                      <td>{transaction.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Transaction Modal */}
      <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{transactionType === 'IN' ? 'Stock In' : transactionType === 'OUT' ? 'Stock Out' : 'Adjust Stock'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product *</Form.Label>
              <Form.Select
                value={transactionForm.variantId}
                onChange={e => setTransactionForm({ ...transactionForm, variantId: e.target.value })}
              >
                <option value="">Select Product</option>
                {variants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.sku} - {variant.productName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity *{transactionType === 'OUT' && <span className="text-muted"> (negative number)</span>}</Form.Label>
              <Form.Control
                type="number"
                value={transactionForm.quantity}
                onChange={e => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                placeholder={transactionType === 'OUT' ? '-10' : '10'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason *</Form.Label>
              <Form.Control
                type="text"
                value={transactionForm.reason}
                onChange={e => setTransactionForm({ ...transactionForm, reason: e.target.value })}
                placeholder="In lý do..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reference Code</Form.Label>
              <Form.Control
                type="text"
                value={transactionForm.reference}
                onChange={e => setTransactionForm({ ...transactionForm, reference: e.target.value })}
                placeholder="PO-2024-001, SO-2024-001..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveTransaction}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal show={showAdjustmentModal} onHide={() => setShowAdjustmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adjust Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVariant && (
            <Alert variant="info">
              <strong>Product:</strong> {selectedVariant.sku} - {selectedVariant.productName}
              <br />
              <strong>Current Stock:</strong> {selectedVariant.currentStock}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Stock *</Form.Label>
              <Form.Control
                type="number"
                value={adjustmentForm.newStock}
                onChange={e => setAdjustmentForm({ ...adjustmentForm, newStock: e.target.value })}
                placeholder="In số lượng tồn kho mới"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason điều chỉnh *</Form.Label>
              <Form.Control
                type="text"
                value={adjustmentForm.reason}
                onChange={e => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                placeholder="Kiểm kê, hỏng hóc, mất mát..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdjustmentModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveAdjustment}>
            Adjustment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InventoryManagement;
