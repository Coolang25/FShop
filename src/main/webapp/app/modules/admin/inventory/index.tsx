import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Table, Modal, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IProductVariant } from 'app/shared/model/product-variant.model';
import { IInventoryTransaction, TransactionType } from 'app/shared/model/inventory-transaction.model';
import { getEntities as getProductVariants } from 'app/entities/product-variant/product-variant.reducer';
import {
  getEntities as getInventoryTransactions,
  createEntity as createInventoryTransaction,
} from 'app/entities/inventory-transaction/inventory-transaction.reducer';

const StockManagement = () => {
  const dispatch = useAppDispatch();
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  // Redux state
  const variants = useAppSelector(state => state.productVariant.entities);
  const variantsLoading = useAppSelector(state => state.productVariant.loading);
  const transactions = useAppSelector(state => state.inventoryTransaction.entities);
  const transactionsLoading = useAppSelector(state => state.inventoryTransaction.loading);
  const updating = useAppSelector(state => state.inventoryTransaction.updating);

  // Load data from API
  useEffect(() => {
    dispatch(getProductVariants({ page: 0, size: 1000, sort: 'id,desc' }));
    dispatch(getInventoryTransactions({ page: 0, size: 1000, sort: 'createdAt,desc' }));
  }, [dispatch]);

  const getTransactionTypeBadge = (type: string) => {
    const typeConfig = {
      IMPORT: { variant: 'success', text: 'Nhập kho', icon: 'fa-arrow-down' },
      EXPORT: { variant: 'danger', text: 'Xuất kho', icon: 'fa-arrow-up' },
      RETURN: { variant: 'warning', text: 'Trả hàng', icon: 'fa-undo' },
      ADJUSTMENT: { variant: 'info', text: 'Điều chỉnh', icon: 'fa-edit' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { variant: 'secondary', text: type, icon: 'fa-question' };
    return (
      <Badge bg={config.variant}>
        <i className={`fa ${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
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

  const refetchVariants = () => {
    dispatch(getProductVariants({ page: 0, size: 1000, sort: 'id,desc' }));
  };

  const computeAvailableToExport = (variant: IProductVariant | null) => {
    if (!variant) {
      return 0;
    }
    const stock = variant.stock ?? 0;
    const reserved = variant.reserved ?? 0;
    return Math.max(0, stock - reserved);
  };

  const availableToExportLimit = computeAvailableToExport(selectedVariant);

  const handleStockIn = async () => {
    if (!selectedVariant || quantity <= 0) {
      return;
    }

    const newTransaction: IInventoryTransaction = {
      type: TransactionType.IMPORT,
      quantity,
      note: note || 'Nhập kho',
      variant: selectedVariant,
    };

    try {
      await dispatch(createInventoryTransaction(newTransaction));
      refetchVariants();
      setShowStockInModal(false);
      setSelectedVariant(null);
      setQuantity(1);
      setNote('');
    } catch (error) {
      console.error('Nhập kho lỗi', error);
    }
  };

  const handleStockOut = async () => {
    if (!selectedVariant || quantity <= 0) {
      return;
    }

    const currentAvailableToExport = computeAvailableToExport(selectedVariant);
    if (quantity > currentAvailableToExport) {
      return;
    }

    const newTransaction: IInventoryTransaction = {
      type: TransactionType.EXPORT,
      quantity,
      note: note || 'Xuất kho',
      variant: selectedVariant,
    };

    try {
      await dispatch(createInventoryTransaction(newTransaction));
      refetchVariants();
      setShowStockOutModal(false);
      setSelectedVariant(null);
      setQuantity(1);
      setNote('');
    } catch (error) {
      console.error('Xuất kho lỗi', error);
    }
  };

  if (variantsLoading || transactionsLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải dữ liệu...</p>
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
                Quản lý Kho
              </h1>
              <p className="text-muted mb-0">Quản lý xuất nhập kho sản phẩm</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="success" onClick={() => setShowStockInModal(true)} className="px-4" style={{ borderRadius: '25px' }}>
                <i className="fa fa-arrow-down me-2"></i>
                Nhập Kho
              </Button>
              <Button variant="danger" onClick={() => setShowStockOutModal(true)} className="px-4" style={{ borderRadius: '25px' }}>
                <i className="fa fa-arrow-up me-2"></i>
                Xuất Kho
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
              <div className="text-success mb-2">
                <i className="fa fa-arrow-down fa-2x"></i>
              </div>
              <h4 className="mb-1">{transactions.filter(t => t.type === 'IMPORT').reduce((sum, t) => sum + t.quantity, 0)}</h4>
              <p className="text-muted mb-0">Tổng Nhập Kho</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <i className="fa fa-arrow-up fa-2x"></i>
              </div>
              <h4 className="mb-1">{transactions.filter(t => t.type === 'EXPORT').reduce((sum, t) => sum + t.quantity, 0)}</h4>
              <p className="text-muted mb-0">Tổng Xuất Kho</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="fa fa-cubes fa-2x"></i>
              </div>
              <h4 className="mb-1">{variants.length}</h4>
              <p className="text-muted mb-0">Sản Phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="fa fa-list fa-2x"></i>
              </div>
              <h4 className="mb-1">{transactions.length}</h4>
              <p className="text-muted mb-0">Giao Dịch</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Current Stock */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="fa fa-cubes me-2"></i>
                Tồn Kho Hiện Tại
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0 table-hover">
                <thead className="table-dark">
                  <tr>
                    <th className="border-0 p-3">Sản Phẩm</th>
                    <th className="border-0 p-3">SKU</th>
                    <th className="border-0 p-3 text-center">Tồn Kho</th>
                    <th className="border-0 p-3 text-center">Đặt chỗ</th>
                    <th className="border-0 p-3 text-end">Giá</th>
                    <th className="border-0 p-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(variant => (
                    <tr key={variant.id}>
                      <td className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            {variant.imageUrl ? (
                              <img
                                src={variant.imageUrl}
                                alt={variant.product?.name || 'Product'}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                onError={e => {
                                  (e.target as HTMLImageElement).src = '/content/images/placeholder-product.png';
                                }}
                              />
                            ) : (
                              <div
                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                style={{ width: '50px', height: '50px' }}
                              >
                                <i className="fa fa-image text-muted"></i>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="fw-bold">{variant.product?.name || 'Unknown Product'}</div>
                            <small className="text-muted">ID: {variant.id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="badge bg-secondary">{variant.sku || 'N/A'}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`badge ${(variant.stock || 0) > 10 ? 'bg-success' : (variant.stock || 0) > 0 ? 'bg-warning' : 'bg-danger'} fs-6`}
                        >
                          {variant.stock || 0}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`badge ${(variant.reserved || 0) > 0 ? 'bg-info' : 'bg-secondary'} fs-6`}>
                          {variant.reserved || 0}
                        </span>
                      </td>
                      <td className="p-3 text-end">
                        <span className="fw-bold">${variant.price || 0}</span>
                      </td>
                      <td className="p-3 text-center">
                        <Badge bg={variant.isActive ? 'success' : 'danger'}>{variant.isActive ? 'Hoạt động' : 'Ngừng'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction History */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <Card.Header className="bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="fa fa-history me-2"></i>
                Lịch Sử Giao Dịch
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {transactions.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fa fa-history fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">Chưa có giao dịch</h4>
                  <p className="text-muted">Chưa có giao dịch xuất nhập kho nào.</p>
                </div>
              ) : (
                <Table responsive className="mb-0 table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th className="border-0 p-3">Loại</th>
                      <th className="border-0 p-3">Sản Phẩm</th>
                      <th className="border-0 p-3">SKU</th>
                      <th className="border-0 p-3 text-center">Số Lượng</th>
                      <th className="border-0 p-3">Ghi Chú</th>
                      <th className="border-0 p-3">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="p-3">{getTransactionTypeBadge(transaction.type)}</td>
                        <td className="p-3">
                          <div className="fw-bold">{transaction.variant?.product?.name || 'Unknown Product'}</div>
                        </td>
                        <td className="p-3">
                          <span className="badge bg-secondary">{transaction.variant?.sku || 'N/A'}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`badge ${transaction.type === 'IMPORT' ? 'bg-success' : 'bg-danger'} fs-6`}>
                            {transaction.type === 'IMPORT' ? '+' : '-'}
                            {transaction.quantity}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-muted">{transaction.note || 'Không có ghi chú'}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-muted">{formatDate(transaction.createdAt || '')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stock In Modal */}
      <Modal show={showStockInModal} onHide={() => setShowStockInModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="fa fa-arrow-down me-2"></i>
            Nhập Kho
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Chọn Sản Phẩm</Form.Label>
              <Form.Select
                value={selectedVariant?.id || ''}
                onChange={e => {
                  const variant = variants.find(v => v.id === parseInt(e.target.value, 10));
                  setSelectedVariant(variant || null);
                }}
              >
                <option value="">Chọn sản phẩm...</option>
                {variants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.product?.name} - {variant.sku} (Tồn: {variant.stock || 0})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Số Lượng Nhập</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                placeholder="Nhập số lượng..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Ghi Chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Nhập ghi chú (tùy chọn)..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setShowStockInModal(false)} className="px-4">
            <i className="fa fa-times me-2"></i>
            Hủy
          </Button>
          <Button variant="success" onClick={() => void handleStockIn()} disabled={updating} className="px-4">
            {updating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="fa fa-check me-2"></i>
                Nhập Kho
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Stock Out Modal */}
      <Modal show={showStockOutModal} onHide={() => setShowStockOutModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="fa fa-arrow-up me-2"></i>
            Xuất Kho
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Chọn Sản Phẩm</Form.Label>
              <Form.Select
                value={selectedVariant?.id || ''}
                onChange={e => {
                  const variant = variants.find(v => v.id === parseInt(e.target.value, 10));
                  setSelectedVariant(variant || null);
                }}
              >
                <option value="">Chọn sản phẩm...</option>
                {variants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.product?.name} - {variant.sku} (Tồn: {variant.stock || 0})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Số Lượng Xuất</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={availableToExportLimit}
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                placeholder="Nhập số lượng..."
              />
              {selectedVariant && (
                <Form.Text className="text-muted">
                  Có thể xuất tối đa: {availableToExportLimit} (từ tổng {selectedVariant.stock || 0})
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Ghi Chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Nhập ghi chú (tùy chọn)..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="outline-secondary" onClick={() => setShowStockOutModal(false)} className="px-4">
            <i className="fa fa-times me-2"></i>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={() => void handleStockOut()}
            disabled={updating || quantity > availableToExportLimit}
            className="px-4"
          >
            {updating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="fa fa-check me-2"></i>
                Xuất Kho
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StockManagement;
