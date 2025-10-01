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
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
  FaUndo,
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../config/store';
import {
  uploadImage,
  setUploadProgress,
  clearUploadProgress,
  clearUploadedUrl,
  reset as resetUpload,
} from '../../../shared/reducers/upload.reducer';
import {
  createEntity,
  updateEntity,
  getEntities,
  getAllEntities,
  deleteEntity,
  activateEntity,
} from '../../../entities/category/category.reducer';
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
    if (categoryState.entities) {
      console.log('Category entities received:', categoryState.entities);
      // Transform flat entities to hierarchical structure
      const hierarchicalCategories = buildCategoryHierarchy(categoryState.entities);
      console.log('Hierarchical categories built:', hierarchicalCategories);
      setCategories(hierarchicalCategories);
      setFlatCategories(categoryState.entities);
    }
  }, [categoryState.entities]);

  const buildCategoryHierarchy = (categoriesData: ICategory[]): Category[] => {
    console.log('Building hierarchy from data:', categoriesData);
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create all categories
    categoriesData.forEach(cat => {
      console.log('Processing category:', cat);
      const category: Category = {
        ...cat,
        parentId: cat.parentId,
        children: [],
        productCount: 0, // Products will be managed separately
        isActive: cat.isActive !== undefined ? cat.isActive : true,
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
          console.log(`Category ${cat.name} has parentId: ${cat.parentId}`);
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            parent.children.push(category);
            category.level = parent.level + 1;
            console.log(`Added ${cat.name} as child of ${parent.name}`);
          } else {
            console.log(`Parent with id ${cat.parentId} not found for category ${cat.name}`);
          }
        } else {
          console.log(`Category ${cat.name} is a root category`);
          rootCategories.push(category);
        }
      }
    });

    console.log('Final hierarchy:', rootCategories);
    return rootCategories;
  };

  const fetchCategories = () => {
    // Fetch all categories (including inactive ones) for admin management
    // Use the admin-specific API endpoint
    console.log('Fetching categories...');
    dispatch(getAllEntities());
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
      isActive: formData.isActive,
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

  const handleActivateCategory = async (category: Category) => {
    try {
      await dispatch(activateEntity(category.id));
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error activating category:', error);
    }
  };

  const handleActivateCategoryWrapper = (category: Category) => {
    handleActivateCategory(category).catch(error => {
      console.error('Activate category error:', error);
    });
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

    if (filteredParentCategories.length === 0) {
      return (
        <div className="text-center py-5">
          <div className="mb-4">
            <div
              className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: '80px', height: '80px' }}
            >
              <FaFolder size={40} className="text-muted" />
            </div>
          </div>
          <h4 className="text-muted mb-3">No categories found</h4>
          <p className="text-muted mb-4">
            {searchTerm ? 'No categories match your search criteria.' : 'No categories have been created yet.'}
          </p>
          {!searchTerm && (
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)} className="px-4">
              <FaPlus className="me-2" />
              Create First Category
            </Button>
          )}
        </div>
      );
    }

    return filteredParentCategories.map(category => (
      <Card key={category.id} className="mb-4 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Card.Header
          className="text-white d-flex justify-content-between align-items-center position-relative"
          style={{
            background: category.isActive
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            padding: '1.25rem 1.5rem',
          }}
        >
          <div className="d-flex align-items-center">
            <div className="me-3">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="rounded shadow-sm"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded d-flex align-items-center justify-content-center text-white"
                  style={{ width: '50px', height: '50px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <FaFolder size={24} />
                </div>
              )}
            </div>
            <div>
              <h5 className="mb-1 fw-bold">
                {category.name}
                <Badge bg={category.isActive ? 'success' : 'danger'} className="ms-2" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </h5>
              <div className="d-flex align-items-center">
                <FaTag className="me-1" style={{ fontSize: '0.8rem' }} />
                <span style={{ fontSize: '0.9rem', opacity: '0.9' }}>{category.productCount} products</span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-light"
              size="sm"
              title="Edit"
              onClick={() => handleEditCategory(category)}
              className="border-0"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaEdit />
            </Button>
            {category.isActive ? (
              <Button
                variant="outline-light"
                size="sm"
                title="Deactivate"
                onClick={() => handleDeleteCategory(category)}
                className="border-0"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FaTrash />
              </Button>
            ) : (
              <Button
                variant="outline-light"
                size="sm"
                title="Activate"
                onClick={() => handleActivateCategoryWrapper(category)}
                className="border-0"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FaPlus />
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {category.children && category.children.length > 0 ? (
            <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="mb-3">
                <h6 className="text-muted mb-0 d-flex align-items-center">
                  <FaTag className="me-2" />
                  Subcategories ({category.children.length})
                </h6>
              </div>
              <div className="row g-3">
                {category.children
                  .filter(child => !searchTerm || child.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(child => (
                    <div key={child.id} className="col-md-6 col-lg-4">
                      <div
                        className="d-flex align-items-center justify-content-between p-3 border rounded bg-white shadow-sm"
                        style={{
                          transition: 'all 0.3s ease',
                          borderRadius: '8px',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {child.image ? (
                            <img
                              src={child.image}
                              alt={child.name}
                              className="me-3 rounded"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="me-3 rounded d-flex align-items-center justify-content-center"
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#e9ecef',
                                color: '#6c757d',
                              }}
                            >
                              <FaTag size={16} />
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold mb-1">
                              {child.name}
                              <Badge
                                bg={child.isActive ? 'success' : 'danger'}
                                className="ms-2"
                                style={{ fontSize: '0.6rem', fontWeight: '500' }}
                              >
                                {child.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <small className="text-muted d-flex align-items-center">
                              <FaBox className="me-1" style={{ fontSize: '0.7rem' }} />
                              {child.productCount} products
                            </small>
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            title="Edit"
                            onClick={() => handleEditCategory(child)}
                            className="border-0"
                            style={{
                              backgroundColor: '#fff3cd',
                              color: '#856404',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = '#ffeaa7';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = '#fff3cd';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <FaEdit />
                          </Button>
                          {child.isActive ? (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Deactivate"
                              onClick={() => handleDeleteCategory(child)}
                              className="border-0"
                              style={{
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#f5c6cb';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#f8d7da';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <FaTrash />
                            </Button>
                          ) : (
                            <Button
                              variant="outline-success"
                              size="sm"
                              title="Activate"
                              onClick={() => handleActivateCategoryWrapper(child)}
                              className="border-0"
                              style={{
                                backgroundColor: '#d1edff',
                                color: '#0c5460',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#bee5eb';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#d1edff';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <FaPlus />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-muted" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="mb-3">
                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px' }}
                >
                  <FaBox size={24} className="text-muted" />
                </div>
              </div>
              <h6 className="text-muted mb-1">No subcategories</h6>
              <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                This category doesn&apos;t have any subcategories yet
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    ));
  };

  const filteredCategories = flatCategories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (categoryState.loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-2">Loading categories...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4">
      {/* Header Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
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
              Category Management
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
              Quản lý cấu trúc danh mục sản phẩm
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddCategory}
            className="px-4 py-2"
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            <FaPlus className="me-2" />
            Add Category
          </Button>
        </div>

        {/* Category Overview */}
        <Row className="g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="text-white rounded-circle p-3 me-3"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: '60px',
                      height: '60px',
                    }}
                  >
                    <FaFolder size={28} />
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                      {categories.length}
                    </h3>
                    <p className="text-muted mb-0 fw-medium">Parent Categories</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="text-white rounded-circle p-3 me-3"
                    style={{
                      background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
                      width: '60px',
                      height: '60px',
                    }}
                  >
                    <FaTag size={28} />
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                      {flatCategories.length}
                    </h3>
                    <p className="text-muted mb-0 fw-medium">Total Categories</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="text-white rounded-circle p-3 me-3"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      width: '60px',
                      height: '60px',
                    }}
                  >
                    <FaBox size={28} />
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '2rem' }}>
                      {flatCategories.reduce((total, cat) => total + cat.productCount, 0)}
                    </h3>
                    <p className="text-muted mb-0 fw-medium">Total Products</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Category Hierarchy Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-2 fw-bold" style={{ color: '#2c3e50' }}>
              Category Hierarchy
            </h3>
            <p className="text-muted mb-0">Parent categories with their subcategories (2 levels maximum)</p>
          </div>
          <div className="d-flex align-items-center">
            <div className="position-relative">
              <InputGroup style={{ minWidth: '300px' }}>
                <InputGroup.Text
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRight: 'none',
                  }}
                >
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    border: '1px solid #e9ecef',
                    borderLeft: 'none',
                    borderRadius: '0 8px 8px 0',
                    padding: '12px 16px',
                    fontSize: '0.95rem',
                  }}
                />
              </InputGroup>
              {searchTerm && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px',
                    color: '#6c757d',
                    textDecoration: 'none',
                  }}
                >
                  <FaTimes />
                </Button>
              )}
            </div>
          </div>
        </div>
        {renderParentCategories()}
      </div>

      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
          }}
        >
          <Modal.Title className="fw-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">Category Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '12px 16px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
                }}
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

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">Parent Category</Form.Label>
              <Form.Select
                value={formData.parentId}
                onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '12px 16px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
                }}
              >
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

            <Form.Group className="mb-4">
              <div className="d-flex align-items-center p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="me-3"
                  style={{ transform: 'scale(1.2)' }}
                />
                <div>
                  <Form.Label htmlFor="isActive" className="fw-semibold mb-1">
                    Active Category
                  </Form.Label>
                  <small className="text-muted d-block">
                    Inactive categories will not be displayed to users and will be excluded from product listings.
                  </small>
                </div>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="p-4" style={{ borderTop: '1px solid #e9ecef' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '8px', padding: '10px 24px' }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCategoryWrapper}
            style={{
              borderRadius: '8px',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            border: 'none',
          }}
        >
          <Modal.Title className="fw-bold">
            <FaTrash className="me-2" />
            Confirm Deactivation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
              }}
            >
              <FaTrash size={24} />
            </div>
            <h5 className="fw-bold mb-2">Deactivate Category</h5>
            <p className="text-muted mb-0">
              Are you sure you want to deactivate category <strong>&quot;{categoryToDelete?.name}&quot;</strong>?
            </p>
          </div>

          <Alert variant="info" className="border-0" style={{ backgroundColor: '#d1ecf1' }}>
            <div className="d-flex align-items-start">
              <FaInfoCircle className="me-2 mt-1" style={{ color: '#0c5460' }} />
              <div>
                <strong>Note:</strong> This will perform a soft delete. The category will be marked as inactive and hidden from users, but
                the data will be preserved.
              </div>
            </div>
          </Alert>

          {categoryToDelete?.children && categoryToDelete.children.length > 0 && (
            <Alert variant="warning" className="border-0 mt-3" style={{ backgroundColor: '#fff3cd' }}>
              <div className="d-flex align-items-start">
                <FaExclamationTriangle className="me-2 mt-1" style={{ color: '#856404' }} />
                <div>
                  <strong>Warning:</strong> This category has {categoryToDelete.children.length} subcategories. All subcategories will also
                  be deactivated.
                </div>
              </div>
            </Alert>
          )}

          <div className="text-center mt-3">
            <small className="text-muted">
              <FaUndo className="me-1" />
              You can reactivate this category later if needed.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="p-4" style={{ borderTop: '1px solid #e9ecef' }}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} style={{ borderRadius: '8px', padding: '10px 24px' }}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeleteWrapper}
            style={{
              borderRadius: '8px',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              border: 'none',
            }}
          >
            <FaTrash className="me-2" />
            Deactivate Category
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
