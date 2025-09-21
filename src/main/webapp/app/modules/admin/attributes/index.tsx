import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Alert, Tabs, Tab, Pagination } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCogs, FaTag, FaList, FaSave } from 'react-icons/fa';

interface ProductAttribute {
  id: number;
  name: string;
  values: ProductAttributeValue[];
  isActive: boolean;
  createdAt: string;
}

interface ProductAttributeValue {
  id: number;
  value: string;
  attributeId: number;
  isActive: boolean;
  createdAt: string;
}

const AttributeManagement = () => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attributes');
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [showAttributeSelectionModal, setShowAttributeSelectionModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ProductAttribute | null>(null);
  const [editingValue, setEditingValue] = useState<ProductAttributeValue | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'attribute' | 'value'>('attribute');

  // Form states
  const [attributeForm, setAttributeForm] = useState({
    name: '',
    isActive: true,
  });

  const [valueForm, setValueForm] = useState({
    value: '',
    isActive: true,
  });

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = () => {
    try {
      // Mock data - replace with actual API call
      const mockAttributes: ProductAttribute[] = [
        {
          id: 1,
          name: 'Size',
          isActive: true,
          createdAt: '2024-01-15',
          values: [
            { id: 1, value: 'S', attributeId: 1, isActive: true, createdAt: '2024-01-15' },
            { id: 2, value: 'M', attributeId: 1, isActive: true, createdAt: '2024-01-15' },
            { id: 3, value: 'L', attributeId: 1, isActive: true, createdAt: '2024-01-15' },
            { id: 4, value: 'XL', attributeId: 1, isActive: true, createdAt: '2024-01-15' },
            { id: 5, value: 'XXL', attributeId: 1, isActive: true, createdAt: '2024-01-15' },
          ],
        },
        {
          id: 2,
          name: 'Color',
          isActive: true,
          createdAt: '2024-01-15',
          values: [
            { id: 6, value: 'Đỏ', attributeId: 2, isActive: true, createdAt: '2024-01-15' },
            { id: 7, value: 'Xanh', attributeId: 2, isActive: true, createdAt: '2024-01-15' },
            { id: 8, value: 'Đen', attributeId: 2, isActive: true, createdAt: '2024-01-15' },
            { id: 9, value: 'Trắng', attributeId: 2, isActive: true, createdAt: '2024-01-15' },
            { id: 10, value: 'Vàng', attributeId: 2, isActive: true, createdAt: '2024-01-15' },
          ],
        },
        {
          id: 3,
          name: 'Material',
          isActive: true,
          createdAt: '2024-01-15',
          values: [
            { id: 11, value: 'Cotton', attributeId: 3, isActive: true, createdAt: '2024-01-15' },
            { id: 12, value: 'Polyester', attributeId: 3, isActive: true, createdAt: '2024-01-15' },
            { id: 13, value: 'Denim', attributeId: 3, isActive: true, createdAt: '2024-01-15' },
            { id: 14, value: 'Silk', attributeId: 3, isActive: true, createdAt: '2024-01-15' },
          ],
        },
      ];

      setAttributes(mockAttributes);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = () => {
    setEditingAttribute(null);
    setAttributeForm({
      name: '',
      isActive: true,
    });
    setShowAttributeModal(true);
  };

  const handleEditAttribute = (attribute: ProductAttribute) => {
    setEditingAttribute(attribute);
    setAttributeForm({
      name: attribute.name,
      isActive: attribute.isActive,
    });
    setShowAttributeModal(true);
  };

  const handleSaveAttribute = () => {
    // Handle save logic here
    console.log('Saving attribute:', attributeForm);
    setShowAttributeModal(false);
    fetchAttributes(); // Refresh the list
  };

  const handleAddValue = (attribute: ProductAttribute | null) => {
    if (!attribute && attributes.length > 0) {
      // If no attribute selected, show attribute selection modal first
      setShowAttributeSelectionModal(true);
      return;
    }

    if (attribute) {
      setSelectedAttribute(attribute);
      setEditingValue(null);
      setValueForm({
        value: '',
        isActive: true,
      });
      setShowValueModal(true);
    }
  };

  const handleEditValue = (value: ProductAttributeValue) => {
    setEditingValue(value);
    setValueForm({
      value: value.value,
      isActive: value.isActive,
    });
    setShowValueModal(true);
  };

  const handleSaveValue = () => {
    // Handle save logic here
    console.log('Saving value:', valueForm);
    setShowValueModal(false);
    fetchAttributes(); // Refresh the list
  };

  const handleDeleteAttribute = (attribute: ProductAttribute) => {
    setItemToDelete(attribute);
    setDeleteType('attribute');
    setShowDeleteModal(true);
  };

  const handleDeleteValue = (value: ProductAttributeValue) => {
    setItemToDelete(value);
    setDeleteType('value');
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting:', itemToDelete, deleteType);
    setShowDeleteModal(false);
    setItemToDelete(null);
    fetchAttributes(); // Refresh the list
  };

  const filteredAttributes = attributes.filter(
    attribute =>
      attribute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attribute.values.some(value => value.value.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAttributes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttributes = filteredAttributes.slice(startIndex, endIndex);

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
              <h2>Attribute Management</h2>
              <p className="text-muted">Attribute Management và giá trị thuộc tính sản phẩm</p>
            </div>
            <Button variant="primary" onClick={handleAddAttribute}>
              <FaPlus className="me-2" />
              Add Attribute
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search attributes or values..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k || 'attributes')} className="mb-4">
        <Tab eventKey="attributes" title="Attributes">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Attribute Name</th>
                    <th>Number of Values</th>
                    <th>Trạng thái</th>
                    <th>Created Date</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttributes.map(attribute => (
                    <tr key={attribute.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCogs className="me-2 text-primary" />
                          <span className="fw-medium">{attribute.name}</span>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">{attribute.values.length} giá trị</Badge>
                      </td>
                      <td>
                        <Badge bg={attribute.isActive ? 'success' : 'danger'}>{attribute.isActive ? 'Hoạt động' : 'Tạm dừng'}</Badge>
                      </td>
                      <td>{attribute.createdAt}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="View Values"
                            onClick={() => {
                              setSelectedAttribute(attribute);
                              setActiveTab('values');
                            }}
                          >
                            <FaList />
                          </Button>
                          <Button variant="outline-warning" size="sm" title="Chỉnh sửa" onClick={() => handleEditAttribute(attribute)}>
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" title="Xóa" onClick={() => handleDeleteAttribute(attribute)}>
                            <FaTrash />
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

        <Tab eventKey="values" title="Attribute Values">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">{selectedAttribute ? `Values of "${selectedAttribute.name}"` : 'All Attribute Values'}</h5>
                  {selectedAttribute && (
                    <small className="text-muted">
                      <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => setSelectedAttribute(null)}>
                        ← Back to all attributes
                      </Button>
                    </small>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {!selectedAttribute && (
                    <Form.Select
                      size="sm"
                      style={{ width: '200px' }}
                      value={selectedAttribute?.id || ''}
                      onChange={e => {
                        const attrId = parseInt(e.target.value, 10);
                        const attr = attributes.find(a => a.id === attrId);
                        setSelectedAttribute(attr || null);
                      }}
                    >
                      <option value="">Filter by attribute...</option>
                      {attributes.map(attr => (
                        <option key={attr.id} value={attr.id}>
                          {attr.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  <Button variant="primary" size="sm" onClick={() => handleAddValue(selectedAttribute)} disabled={attributes.length === 0}>
                    <FaPlus className="me-2" />
                    Add Value
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {selectedAttribute ? (
                <Table responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Value</th>
                      <th>Trạng thái</th>
                      <th>Created Date</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAttribute.values.map(value => (
                      <tr key={value.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaTag className="me-2 text-secondary" />
                            <span className="fw-medium">{value.value}</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg={value.isActive ? 'success' : 'danger'}>{value.isActive ? 'Hoạt động' : 'Tạm dừng'}</Badge>
                        </td>
                        <td>{value.createdAt}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-warning" size="sm" title="Chỉnh sửa" onClick={() => handleEditValue(value)}>
                              <FaEdit />
                            </Button>
                            <Button variant="outline-danger" size="sm" title="Xóa" onClick={() => handleDeleteValue(value)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Table responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributes.flatMap(attribute =>
                      attribute.values.map(value => (
                        <tr key={`${attribute.id}-${value.id}`}>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaCogs className="me-2 text-primary" />
                              <span className="fw-medium">{attribute.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaTag className="me-2 text-secondary" />
                              <span className="fw-medium">{value.value}</span>
                            </div>
                          </td>
                          <td>
                            <Badge bg={value.isActive ? 'success' : 'danger'}>{value.isActive ? 'Active' : 'Inactive'}</Badge>
                          </td>
                          <td>{value.createdAt}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-info"
                                size="sm"
                                title="View Attribute"
                                onClick={() => {
                                  setSelectedAttribute(attribute);
                                  setActiveTab('values');
                                }}
                              >
                                <FaCogs />
                              </Button>
                              <Button variant="outline-warning" size="sm" title="Edit" onClick={() => handleEditValue(value)}>
                                <FaEdit />
                              </Button>
                              <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteValue(value)}>
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAttributes.length)} of {filteredAttributes.length} attributes
              </small>
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </Col>
        </Row>
      )}

      {/* Add/Edit Attribute Modal */}
      <Modal show={showAttributeModal} onHide={() => setShowAttributeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAttribute ? 'Edit Attribute' : 'Add Attribute mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Attribute Name *</Form.Label>
              <Form.Control
                type="text"
                value={attributeForm.name}
                onChange={e => setAttributeForm({ ...attributeForm, name: e.target.value })}
                placeholder="Ví dụ: Size, Color, Material..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Attributes hoạt động"
                checked={attributeForm.isActive}
                onChange={e => setAttributeForm({ ...attributeForm, isActive: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttributeModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveAttribute}>
            <FaSave className="me-2" />
            {editingAttribute ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Value Modal */}
      <Modal show={showValueModal} onHide={() => setShowValueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingValue ? 'Edit Value' : `Add Value cho "${selectedAttribute?.name}"`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Value *</Form.Label>
              <Form.Control
                type="text"
                value={valueForm.value}
                onChange={e => setValueForm({ ...valueForm, value: e.target.value })}
                placeholder="Enter attribute value"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Value hoạt động"
                checked={valueForm.isActive}
                onChange={e => setValueForm({ ...valueForm, isActive: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowValueModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveValue}>
            <FaSave className="me-2" />
            {editingValue ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Attribute Selection Modal */}
      <Modal show={showAttributeSelectionModal} onHide={() => setShowAttributeSelectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Attribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please select an attribute to add a value to:</p>
          <Form.Select
            onChange={e => {
              const attrId = parseInt(e.target.value, 10);
              const attr = attributes.find(a => a.id === attrId);
              if (attr) {
                setSelectedAttribute(attr);
                setShowAttributeSelectionModal(false);
                setEditingValue(null);
                setValueForm({
                  value: '',
                  isActive: true,
                });
                setShowValueModal(true);
              }
            }}
          >
            <option value="">Choose an attribute...</option>
            {attributes.map(attr => (
              <option key={attr.id} value={attr.id}>
                {attr.name}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttributeSelectionModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {deleteType === 'attribute' ? 'attribute' : 'value'} &quot;
          {deleteType === 'attribute' ? itemToDelete?.name : itemToDelete?.value}&quot;?
          {deleteType === 'attribute' && itemToDelete?.values?.length > 0 && (
            <Alert variant="warning" className="mt-2">
              <strong>Cảnh báo:</strong> Attributes này có {itemToDelete.values.length} giá trị. Tất cả giá trị cũng sẽ bị xóa.
            </Alert>
          )}
          Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AttributeManagement;
