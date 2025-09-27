import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, InputGroup, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCogs, FaTag, FaList, FaSave } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getEntitiesSimplified as getProductAttributesSimplified,
  createEntity as createProductAttribute,
  updateEntity as updateProductAttribute,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  AttributeWithValues,
  AttributeValue,
} from 'app/entities/product-attribute/product-attribute.reducer';

const AttributeManagement = () => {
  const dispatch = useAppDispatch();

  // Redux state
  const productAttributeList = useAppSelector(state => state.productAttribute.entities);
  const loading = useAppSelector(state => state.productAttribute.loading);
  const updating = useAppSelector(state => state.productAttribute.updating);
  const updateSuccess = useAppSelector(state => state.productAttribute.updateSuccess);
  const errorMessage = useAppSelector(state => state.productAttribute.errorMessage);

  // Convert to simplified format
  const attributes: AttributeWithValues[] = productAttributeList as AttributeWithValues[];

  // Local state
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<AttributeWithValues | null>(null);
  const [editingValue, setEditingValue] = useState<AttributeValue | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeWithValues | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [savingValue, setSavingValue] = useState(false);

  // Form states
  const [attributeForm, setAttributeForm] = useState({
    name: '',
  });

  const [valueForm, setValueForm] = useState({
    value: '',
    attributeId: null as number | null,
  });

  // Load data on mount
  useEffect(() => {
    dispatch(getProductAttributesSimplified());
  }, []);

  // Auto-select first attribute when attributes change
  useEffect(() => {
    if (attributes.length > 0) {
      // If no attribute selected, select the first one
      if (!selectedAttribute) {
        setSelectedAttribute(attributes[0]);
      } else {
        // Find the updated attribute from the new attributes array
        const updatedAttribute = attributes.find(attr => attr.id === selectedAttribute.id);
        if (updatedAttribute) {
          // Update selectedAttribute with the fresh data from Redux
          setSelectedAttribute(updatedAttribute);
        } else {
          // If current selected attribute no longer exists, select the first one
          setSelectedAttribute(attributes[0]);
        }
      }
    } else {
      // If no attributes, clear selection
      setSelectedAttribute(null);
    }
  }, [attributes]);

  const handleAddAttribute = () => {
    setEditingAttribute(null);
    setAttributeForm({
      name: '',
    });
    setErrors({});
    setShowAttributeModal(true);
  };

  const handleEditAttribute = (attribute: AttributeWithValues) => {
    setEditingAttribute(attribute);
    setAttributeForm({
      name: attribute.name || '',
    });
    setErrors({});
    setShowAttributeModal(true);
  };

  const handleSaveAttribute = () => {
    const newErrors: { [key: string]: string } = {};

    if (!attributeForm.name.trim()) {
      newErrors.name = 'Attribute name is required';
    } else if (attributeForm.name.length > 100) {
      newErrors.name = 'Attribute name cannot exceed 100 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingAttribute) {
      // Update existing attribute
      dispatch(updateProductAttribute({ ...editingAttribute, name: attributeForm.name.trim() }));
    } else {
      // Create new attribute
      dispatch(createProductAttribute({ name: attributeForm.name.trim() }));
    }
    setShowAttributeModal(false);
    setErrors({});
  };

  const handleAddValue = () => {
    if (selectedAttribute) {
      setEditingValue(null);
      setValueForm({
        value: '',
        attributeId: selectedAttribute.id,
      });
      setErrors({});
      setShowValueModal(true);
    }
  };

  const handleEditValue = (value: AttributeValue) => {
    setEditingValue(value);
    setValueForm({
      value: value.value || '',
      attributeId: selectedAttribute?.id || null,
    });
    setErrors({});
    setShowValueModal(true);
  };

  const handleSaveValue = () => {
    const newErrors: { [key: string]: string } = {};

    if (!valueForm.value.trim()) {
      newErrors.value = 'Attribute value is required';
    } else if (valueForm.value.length > 100) {
      newErrors.value = 'Attribute value cannot exceed 100 characters';
    }

    if (!valueForm.attributeId) {
      newErrors.attributeId = 'Please select an attribute';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSavingValue(true);
    if (editingValue) {
      // Update existing value
      dispatch(
        updateAttributeValue({
          id: editingValue.id,
          value: valueForm.value.trim(),
          attributeId: valueForm.attributeId,
        }),
      );
    } else {
      // Create new value
      dispatch(
        createAttributeValue({
          value: valueForm.value.trim(),
          attributeId: valueForm.attributeId,
        }),
      );
    }
    // Close modal and clear errors after successful save
    setShowValueModal(false);
    setErrors({});
    setSavingValue(false);
  };

  const handleDeleteValue = (value: AttributeValue) => {
    setItemToDelete(value);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteAttributeValue(itemToDelete.id));
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const filteredAttributes = attributes.filter(
    attribute =>
      attribute.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attribute.values?.some(value => value.value?.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading && attributes.length === 0) {
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
      {/* Error Alert */}
      {errorMessage && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible>
              <strong>Error:</strong> {errorMessage}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Attribute Management</h2>
              <p className="text-muted">Manage product attributes and their values</p>
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
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control type="text" placeholder="Search attributes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Col>
      </Row>

      {/* Two Column Layout */}
      <Row>
        {/* Left Column - Attributes List */}
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Attributes</h5>
            </Card.Header>
            <Card.Body className="p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredAttributes.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-muted">
                    <FaCogs className="mb-2" style={{ fontSize: '2rem' }} />
                    {searchTerm ? (
                      <>
                        <p className="mb-0">No results found</p>
                        <small>Try searching with different keywords</small>
                      </>
                    ) : (
                      <>
                        <p className="mb-0">No attributes yet</p>
                        <small>Click &quot;Add Attribute&quot; to create your first attribute</small>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredAttributes.map(attribute => (
                    <div
                      key={attribute.id}
                      className={`list-group-item list-group-item-action cursor-pointer ${
                        selectedAttribute?.id === attribute.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedAttribute(attribute)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex align-items-center">
                            <FaCogs className="me-2 text-primary" />
                            <span className="fw-medium">{attribute.name}</span>
                          </div>
                          <small className="text-muted">{attribute.values?.length || 0} values</small>
                        </div>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            title="Edit"
                            onClick={e => {
                              e.stopPropagation();
                              handleEditAttribute(attribute);
                            }}
                          >
                            <FaEdit />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Values List */}
        <Col md={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{selectedAttribute ? `Values for "${selectedAttribute.name}"` : 'Select an attribute'}</h5>
                {selectedAttribute && (
                  <Button variant="outline-primary" size="sm" onClick={handleAddValue}>
                    <FaPlus className="me-2" />
                    Add Value
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {!selectedAttribute ? (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <FaList className="mb-2" style={{ fontSize: '2rem' }} />
                    <p className="mb-0">Select an attribute to view its values</p>
                  </div>
                </div>
              ) : selectedAttribute.values?.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <FaTag className="mb-2" style={{ fontSize: '2rem' }} />
                    <p className="mb-0">No values for this attribute yet</p>
                    <small>Click &quot;Add Value&quot; to create the first value</small>
                  </div>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {selectedAttribute.values?.map(value => (
                    <div key={value.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <FaTag className="me-2 text-secondary" />
                          <span className="fw-medium">{value.value}</span>
                        </div>
                        <div className="d-flex gap-1">
                          <Button variant="outline-warning" size="sm" title="Edit" onClick={() => handleEditValue(value)}>
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteValue(value)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Attribute Modal */}
      <Modal show={showAttributeModal} onHide={() => setShowAttributeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Attribute Name *</Form.Label>
              <Form.Control
                type="text"
                value={attributeForm.name}
                onChange={e => {
                  setAttributeForm({ ...attributeForm, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }}
                placeholder="e.g. Size, Color, Material..."
                isInvalid={!!errors.name}
              />
              {errors.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttributeModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleSaveAttribute()} disabled={updating}>
            <FaSave className="me-2" />
            {updating ? 'Saving...' : editingAttribute ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Value Modal */}
      <Modal show={showValueModal} onHide={() => setShowValueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingValue ? 'Edit Value' : `Add Value for "${selectedAttribute?.name}"`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Attribute *</Form.Label>
              <Form.Control
                type="text"
                value={selectedAttribute?.name || ''}
                disabled
                placeholder="Selected attribute"
                isInvalid={!!errors.attributeId}
              />
              {errors.attributeId && <Form.Control.Feedback type="invalid">{errors.attributeId}</Form.Control.Feedback>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Value *</Form.Label>
              <Form.Control
                type="text"
                value={valueForm.value}
                onChange={e => {
                  setValueForm({ ...valueForm, value: e.target.value });
                  if (errors.value) {
                    setErrors({ ...errors, value: '' });
                  }
                }}
                placeholder="Enter attribute value"
                isInvalid={!!errors.value}
              />
              {errors.value && <Form.Control.Feedback type="invalid">{errors.value}</Form.Control.Feedback>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowValueModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleSaveValue()} disabled={savingValue}>
            <FaSave className="me-2" />
            {savingValue ? 'Saving...' : editingValue ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete value &quot;{itemToDelete?.value}&quot;? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AttributeManagement;
