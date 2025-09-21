import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFolder,
  FaFolderOpen,
  FaChevronRight,
  FaChevronDown,
  FaTag,
  FaBox,
  FaUpload,
  FaImage,
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import {
  uploadImage,
  setUploadProgress,
  clearUploadProgress,
  clearUploadedUrl,
  reset as resetUpload,
} from '../../../shared/reducers/upload.reducer';
import { createEntity, updateEntity, getEntities, deleteEntity } from '../../../entities/category/category.reducer';
import { ICategory } from '../../../shared/model/category.model';

interface Category extends ICategory {
  parentId?: number;
  children?: Category[];
  productCount: number;
  isActive: boolean;
  createdAt: string;
  level: number;
}

const CategoryManagement = () => {
  const dispatch = useAppDispatch();

  // Redux state
  const uploadState = useAppSelector(state => state.upload);
  const categoryState = useAppSelector(state => state.category);

  // Local state
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    parentId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryState.entities && categoryState.entities.length > 0) {
      // Transform flat entities to hierarchical structure
      const hierarchicalCategories = buildCategoryHierarchy(categoryState.entities);
      setCategories(hierarchicalCategories);
      setFlatCategories(categoryState.entities);
      setLoading(false);
    }
  }, [categoryState.entities]);

  const buildCategoryHierarchy = (categoriesData: ICategory[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create all categories
    categoriesData.forEach(cat => {
      const category: Category = {
        ...cat,
        parentId: cat.parentId,
        children: [],
        productCount: 0, // Products will be managed separately
        isActive: true,
        createdAt: new Date().toISOString(),
        level: 0,
      };
      categoryMap.set(cat.id, category);
    });

    // Second pass: build hierarchy
    categoriesData.forEach(cat => {
      const category = categoryMap.get(cat.id);
      if (category) {
        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            parent.children.push(category);
            category.level = parent.level + 1;
          }
        } else {
          rootCategories.push(category);
        }
      }
    });

    return rootCategories;
  };

  const fetchCategories = () => {
    setLoading(true);
    dispatch(getEntities({}));
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
      image: '',
      parentId: '',
      isActive: true,
    });
    dispatch(resetUpload());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: category.image || '',
      parentId: category.parentId?.toString() || '',
      isActive: category.isActive,
    });
    dispatch(resetUpload());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowModal(true);
  };

  const handleSaveCategory = async () => {
    const categoryData: ICategory = {
      name: formData.name,
      image: formData.image,
      parentId: formData.parentId ? parseInt(formData.parentId, 10) : undefined,
    };

    try {
      if (editingCategory) {
        await dispatch(updateEntity({ ...categoryData, id: editingCategory.id }));
      } else {
        await dispatch(createEntity(categoryData));
      }
      setShowModal(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleSaveCategoryWrapper = () => {
    handleSaveCategory().catch(error => {
      console.error('Save category error:', error);
    });
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await dispatch(deleteEntity(categoryToDelete.id));
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        fetchCategories(); // Refresh the list
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const confirmDeleteWrapper = () => {
    confirmDelete().catch(error => {
      console.error('Delete category error:', error);
    });
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

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select an image file' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'Only JPG, PNG, GIF, and WebP files are allowed' };
    }

    return { valid: true };
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Upload file using Redux thunk
    const result = await dispatch(uploadImage(file));

    if (uploadImage.fulfilled.match(result)) {
      setFormData({ ...formData, image: result.payload.fileUrl });
    } else if (uploadImage.rejected.match(result)) {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleFileSelectWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event).catch(error => {
      console.error('File upload error:', error);
    });
  };

  const handleRemoveImage = () => {
    dispatch(clearUploadedUrl());
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="me-3 rounded"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
            ) : (
              <FaFolder className="me-2" />
            )}
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
                          {child.image ? (
                            <img
                              src={child.image}
                              alt={child.name}
                              className="me-2 rounded"
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            />
                          ) : (
                            <FaTag className="me-2 text-secondary" />
                          )}
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
              <Form.Label>Category Image</Form.Label>

              {/* File Upload Area */}
              <div className="border rounded p-3 mb-3" style={{ borderStyle: 'dashed' }}>
                <div className="text-center">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelectWrapper} style={{ display: 'none' }} />

                  {uploadState.loading ? (
                    <div className="py-4">
                      <Spinner animation="border" size="sm" className="me-2" />
                      <span>Uploading image...</span>
                      {uploadState.uploadProgress && (
                        <div className="mt-2">
                          <ProgressBar
                            now={uploadState.uploadProgress.percentage}
                            label={`${uploadState.uploadProgress.percentage}%`}
                            variant="primary"
                          />
                          <small className="text-muted">
                            {Math.round(uploadState.uploadProgress.loaded / 1024)} KB /{' '}
                            {Math.round(uploadState.uploadProgress.total / 1024)} KB
                          </small>
                        </div>
                      )}
                    </div>
                  ) : uploadState.uploadedUrl || formData.image ? (
                    <div className="py-2">
                      <img
                        src={uploadState.uploadedUrl || formData.image}
                        alt="Preview"
                        className="rounded border mb-2"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div>
                        <Button variant="outline-primary" size="sm" onClick={() => fileInputRef.current?.click()} className="me-2">
                          <FaUpload className="me-1" />
                          Change Image
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
                          <FaTrash className="me-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <FaImage size={48} className="text-muted mb-3" />
                      <div>
                        <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
                          <FaUpload className="me-2" />
                          Upload Image
                        </Button>
                      </div>
                      <small className="text-muted d-block mt-2">Click to select an image file (JPG, PNG, GIF - Max 5MB)</small>
                    </div>
                  )}
                </div>
              </div>

              <Form.Text className="text-muted">
                Upload an image for this category. The image will be displayed as a thumbnail in the category list.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parent Category</Form.Label>
              <Form.Select value={formData.parentId} onChange={e => setFormData({ ...formData, parentId: e.target.value })}>
                <option value="">None (Root Category - Level 1)</option>
                {categoryState.entities
                  .filter(cat => !cat.parentId && (!editingCategory || cat.id !== editingCategory.id))
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
          <Button variant="primary" onClick={handleSaveCategoryWrapper}>
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
          <Button variant="danger" onClick={confirmDeleteWrapper}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
