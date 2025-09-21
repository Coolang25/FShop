import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown, FaTag, FaBox } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  parentId?: number;
  children?: Category[];
  productCount: number;
  isActive: boolean;
  createdAt: string;
  level: number;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    try {
      // Mock data - replace with actual API call
      const mockCategories: Category[] = [
        {
          id: 1,
          name: "Men's Fashion",
          parentId: null,
          productCount: 45,
          isActive: true,
          createdAt: '2024-01-15',
          level: 0,
          children: [
            {
              id: 2,
              name: 'T-Shirts',
              parentId: 1,
              productCount: 15,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 3,
              name: 'Shirts',
              parentId: 1,
              productCount: 10,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 4,
              name: 'Jeans',
              parentId: 1,
              productCount: 12,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 5,
              name: 'Pants',
              parentId: 1,
              productCount: 8,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
          ],
        },
        {
          id: 6,
          name: "Women's Fashion",
          parentId: null,
          productCount: 67,
          isActive: true,
          createdAt: '2024-01-15',
          level: 0,
          children: [
            {
              id: 7,
              name: 'Dresses',
              parentId: 6,
              productCount: 25,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 8,
              name: 'Tops',
              parentId: 6,
              productCount: 20,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 9,
              name: 'Skirts',
              parentId: 6,
              productCount: 12,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 10,
              name: 'Pants',
              parentId: 6,
              productCount: 10,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
          ],
        },
        {
          id: 11,
          name: 'Accessories',
          parentId: null,
          productCount: 23,
          isActive: true,
          createdAt: '2024-01-15',
          level: 0,
          children: [
            {
              id: 12,
              name: 'Bags',
              parentId: 11,
              productCount: 8,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 13,
              name: 'Jewelry',
              parentId: 11,
              productCount: 10,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
            {
              id: 14,
              name: 'Watches',
              parentId: 11,
              productCount: 5,
              isActive: true,
              createdAt: '2024-01-15',
              level: 1,
            },
          ],
        },
      ];

      setCategories(mockCategories);
      setFlatCategories(flattenCategories(mockCategories));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const flattenCategories = (cats: Category[], level = 0): Category[] => {
    let result: Category[] = [];
    cats.forEach(category => {
      result.push({ ...category, level });
      if (category.children) {
        result = result.concat(flattenCategories(category.children, level + 1));
      }
    });
    return result;
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parentId: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId?.toString() || '',
      isActive: category.isActive,
    });
    setShowModal(true);
  };

  const handleSaveCategory = () => {
    // Handle save logic here
    console.log('Saving category:', formData);
    setShowModal(false);
    fetchCategories(); // Refresh the list
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting category:', categoryToDelete);
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    fetchCategories(); // Refresh the list
  };

  const toggleNode = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderParentCategories = () => {
    const filteredParentCategories = categories.filter(
      category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.children && category.children.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))),
    );

    return filteredParentCategories.map(category => (
      <Card key={category.id} className="mb-3 border-0 shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaFolder className="me-2" />
            <div>
              <h6 className="mb-0">{category.name}</h6>
              <small>{category.productCount} products</small>
            </div>
          </div>
          <div className="d-flex gap-1">
            <Button variant="outline-light" size="sm" title="Edit" onClick={() => handleEditCategory(category)}>
              <FaEdit />
            </Button>
            <Button variant="outline-light" size="sm" title="Delete" onClick={() => handleDeleteCategory(category)}>
              <FaTrash />
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {category.children && category.children.length > 0 ? (
            <div className="p-3">
              <div className="row g-2">
                {category.children
                  .filter(child => !searchTerm || child.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(child => (
                    <div key={child.id} className="col-md-6 col-lg-4">
                      <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-light">
                        <div className="d-flex align-items-center">
                          <FaTag className="me-2 text-secondary" />
                          <div>
                            <div className="fw-medium">{child.name}</div>
                            <small className="text-muted">{child.productCount} products</small>
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                          <Button variant="outline-warning" size="sm" title="Edit" onClick={() => handleEditCategory(child)}>
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteCategory(child)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="p-3 text-center text-muted">
              <FaBox className="mb-2" />
              <p className="mb-0">No subcategories</p>
            </div>
          )}
        </Card.Body>
      </Card>
    ));
  };

  const filteredCategories = flatCategories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
              <h2>Category Management</h2>
              <p className="text-muted">Quản lý cấu trúc danh mục sản phẩm</p>
            </div>
            <Button variant="primary" onClick={handleAddCategory}>
              <FaPlus className="me-2" />
              Add Category
            </Button>
          </div>
        </Col>
      </Row>

      {/* Category Overview */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3">
                  <FaFolder size={24} />
                </div>
                <div>
                  <h4 className="mb-1">{categories.length}</h4>
                  <p className="text-muted mb-0">Parent Categories</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <FaTag size={24} />
                </div>
                <div>
                  <h4 className="mb-1">{flatCategories.length}</h4>
                  <p className="text-muted mb-0">Total Categories</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-info text-white rounded-circle p-3 me-3">
                  <FaBox size={24} />
                </div>
                <div>
                  <h4 className="mb-1">{flatCategories.reduce((total, cat) => total + cat.productCount, 0)}</h4>
                  <p className="text-muted mb-0">Total Products</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Hierarchy - 2 Levels Only */}
      <Row>
        <Col>
          <Row>
            <Col>
              <div className="mb-3">
                <h5>Category Hierarchy</h5>
                <p className="text-muted">Parent categories with their subcategories (2 levels maximum)</p>
              </div>
            </Col>
            <Col>
              {/* Search */}
              <Row className="mb-4">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          {renderParentCategories()}
        </Col>
      </Row>

      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? 'Edit Category' : 'Add Category mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parent Category</Form.Label>
              <Form.Select value={formData.parentId} onChange={e => setFormData({ ...formData, parentId: e.target.value })}>
                <option value="">None (Root Category - Level 1)</option>
                {categories
                  .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} (Parent Category)
                    </option>
                  ))}
              </Form.Select>
              <Form.Text className="text-muted">Only 2 levels allowed: Root categories (Level 1) and Subcategories (Level 2)</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Active Categories"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveCategory}>
            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete category &quot;{categoryToDelete?.name}&quot;?
          {categoryToDelete?.children && categoryToDelete.children.length > 0 && (
            <Alert variant="warning" className="mt-2">
              <strong>Warning:</strong> Danh mục này có {categoryToDelete.children.length} subcategories. Tất cả subcategories cũng sẽ bị
              xóa.
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

export default CategoryManagement;
