import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  InputGroup,
  Dropdown,
  Alert,
  Tabs,
  Tab,
  Pagination,
  Spinner,
  ProgressBar,
} from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaUpload,
  FaImage,
  FaBox,
  FaTag,
  FaCogs,
  FaList,
  FaFolder,
  FaCheck,
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getEntitiesSimplified as getProductAttributesSimplified,
  AttributeWithValues,
} from 'app/entities/product-attribute/product-attribute.reducer';
import {
  uploadImage,
  setUploadProgress,
  clearUploadProgress,
  clearUploadedUrl,
  reset as resetUpload,
} from 'app/shared/reducers/upload.reducer';
import {
  getEntities as getProducts,
  getEntitiesWithVariants as getProductsWithVariants,
  createEntity as createProduct,
  updateEntity as updateProduct,
  deleteEntity as deleteProduct,
  activateEntity as activateProduct,
} from 'app/entities/product/product.reducer';
import {
  getEntities as getProductVariants,
  createEntity as createProductVariant,
  updateEntity as updateProductVariant,
  deleteEntity as deleteProductVariant,
} from 'app/entities/product-variant/product-variant.reducer';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';

interface Product {
  id?: number;
  name?: string;
  description?: string;
  basePrice?: number;
  imageUrl?: string;
  categories?: { id: number; name: string }[];
  variants?: ProductVariant[];
  isActive?: boolean;
  createdAt?: string;
}

interface ProductVariant {
  id?: number;
  sku?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
  product?: any;
  attributeValues?: { [attributeName: string]: { id: number; value: string } };
}

const ProductManagement = () => {
  const dispatch = useAppDispatch();
  const attributes = useAppSelector(state => state.productAttribute.entities);
  const attributesLoading = useAppSelector(state => state.productAttribute.loading);
  const products = useAppSelector(state => state.product.entities);
  const productsLoading = useAppSelector(state => state.product.loading);
  const productVariants = useAppSelector(state => state.productVariant.entities);
  const productVariantsLoading = useAppSelector(state => state.productVariant.loading);
  const categories = useAppSelector(state => state.category.entities);
  const categoriesLoading = useAppSelector(state => state.category.loading);
  const uploadState = useAppSelector(state => state.upload);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // File input refs
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const variantFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  // Convert attributes from Redux to the format needed by the UI
  const availableAttributes = React.useMemo(() => {
    const result: { [key: string]: string[] } = {};
    attributes.forEach(attr => {
      if (attr.values && attr.values.length > 0) {
        result[attr.name] = attr.values.map(v => v.value);
      }
    });
    return result;
  }, [attributes]);

  // Products now come with variants from BE, no need to map
  const productsWithVariants = products;
  const [showAttributeSelectionModal, setShowAttributeSelectionModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    imageUrl: '',
    categories: [] as number[],
    isActive: true,
  });

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    sku: '',
    price: '',
    stock: '',
    imageUrl: '',
    isActive: true,
    attributeValues: {} as { [attributeName: string]: { id: number; value: string } },
  });

  useEffect(() => {
    fetchProducts();
    fetchAvailableAttributes();
    fetchCategories();
    // Fetch all variants
    dispatch(getProductVariants({ page: 0, size: 1000, sort: 'id,asc' }));
  }, []);

  // Update loading state based on Redux
  useEffect(() => {
    setLoading(productsLoading || attributesLoading || categoriesLoading);
  }, [productsLoading, attributesLoading, categoriesLoading]);

  const fetchProducts = () => {
    // Use the new endpoint that includes variants
    dispatch(getProductsWithVariants({ page: 0, size: 100, sort: 'id,asc' }));
  };

  const fetchAvailableAttributes = () => {
    dispatch(getProductAttributesSimplified());
  };

  const fetchCategories = () => {
    dispatch(getCategories({}));
  };

  // Build category hierarchy for display
  const buildCategoryHierarchy = (categoriesData: any[]) => {
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create all categories
    categoriesData.forEach(cat => {
      const category = {
        ...cat,
        children: [],
      };
      categoryMap.set(cat.id, category);
    });

    // Second pass: build hierarchy
    categoriesData.forEach(cat => {
      const category = categoryMap.get(cat.id);
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId).children.push(category);
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  // Render category tree
  const renderCategoryTree = (categoryList: any[], level = 0) => {
    return categoryList.map(category => (
      <div key={category.id} className="mb-1">
        <Form.Check
          type="checkbox"
          id={`category-${category.id}`}
          label={
            <div className="d-flex align-items-center">
              {level > 0 && (
                <span className="me-2 text-muted" style={{ width: `${level * 16}px` }}>
                  {level === 1 ? '└─' : '  └─'}
                </span>
              )}
              {level === 0 ? <FaFolder className="me-2 text-primary" size={14} /> : <FaTag className="me-2 text-secondary" size={12} />}
              <span className={level === 0 ? 'fw-bold text-primary' : 'text-dark'}>{category.name}</span>
            </div>
          }
          checked={formData.categories.includes(category.id)}
          onChange={e => {
            if (e.target.checked) {
              setFormData({
                ...formData,
                categories: [...formData.categories, category.id],
              });
            } else {
              setFormData({
                ...formData,
                categories: formData.categories.filter(id => id !== category.id),
              });
            }
          }}
          className={`mb-1 ${level === 0 ? 'border-bottom pb-2 mb-2' : ''}`}
        />
        {category.children && category.children.length > 0 && (
          <div className="ms-2">{renderCategoryTree(category.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      imageUrl: '',
      categories: [],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      basePrice: product.basePrice?.toString() || '',
      imageUrl: product.imageUrl || '',
      categories: product.categories?.map(cat => cat.id) || [],
      isActive: product.isActive || true,
    });
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      basePrice: parseFloat(formData.basePrice),
      imageUrl: formData.imageUrl,
      categories: formData.categories.map(catId => ({ id: catId })),
    };

    if (editingProduct) {
      dispatch(updateProduct({ ...productData, id: editingProduct.id }));
    } else {
      dispatch(createProduct(productData));
    }

    setShowModal(false);
    // Products will be refreshed automatically via Redux
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleActivateProduct = (product: Product) => {
    if (product.id) {
      dispatch(activateProduct(product.id));
    }
  };

  const confirmDelete = () => {
    if (productToDelete?.id) {
      dispatch(deleteProduct(productToDelete.id));
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
    // Products will be refreshed automatically via Redux
  };

  // Image upload functions
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

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData({ ...formData, imageUrl: result.payload.fileUrl });
    } else if (uploadImage.rejected.match(result)) {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleVariantImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setVariantForm({ ...variantForm, imageUrl: result.payload.fileUrl });
    } else if (uploadImage.rejected.match(result)) {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleRemoveProductImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    dispatch(clearUploadedUrl());
  };

  const handleRemoveVariantImage = () => {
    setVariantForm({ ...variantForm, imageUrl: '' });
    dispatch(clearUploadedUrl());
  };

  // Variant management functions
  const handleAddVariant = (product: Product) => {
    setSelectedProduct(product);
    setEditingVariant(null);
    setVariantForm({
      sku: '',
      price: product.basePrice?.toString() || '0',
      stock: '0',
      imageUrl: '',
      isActive: true,
      attributeValues: {},
    });
    setShowVariantModal(true);
  };

  const handleEditVariant = (product: Product, variant: ProductVariant) => {
    setSelectedProduct(product);
    setEditingVariant(variant);
    setVariantForm({
      sku: variant.sku || '',
      price: variant.price?.toString() || '',
      stock: variant.stock?.toString() || '',
      imageUrl: variant.imageUrl || '',
      isActive: variant.isActive ?? true,
      attributeValues: { ...variant.attributeValues },
    });
    setShowVariantModal(true);
  };

  const handleSaveVariant = () => {
    if (!selectedProduct?.id) return;

    const variantData = {
      sku: variantForm.sku,
      price: parseFloat(variantForm.price),
      stock: parseInt(variantForm.stock, 10),
      imageUrl: variantForm.imageUrl,
      isActive: variantForm.isActive,
      product: { id: selectedProduct.id },
    };

    if (editingVariant?.id) {
      dispatch(updateProductVariant({ ...variantData, id: editingVariant.id }));
    } else {
      dispatch(createProductVariant(variantData));
    }

    setShowVariantModal(false);
    setSelectedProduct(null);
    setEditingVariant(null);
    // Variants will be refreshed automatically via Redux
  };

  const handleDeleteVariant = (product: Product, variant: ProductVariant) => {
    if (variant.id) {
      dispatch(deleteProductVariant(variant.id));
    }
    // Variants will be refreshed automatically via Redux
  };

  const filteredProducts = productsWithVariants.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      product.categories?.some(cat => (typeof cat === 'string' ? cat === selectedCategory : cat.name === selectedCategory));
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Product Management</h2>
              <p className="text-muted">Quản lý danh sách sản phẩm và biến thể</p>
            </div>
            <Button variant="primary" onClick={handleAddProduct}>
              <FaPlus className="me-2" />
              Add Product
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
            <Form.Control type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Men's Fashion">Men&apos;s Fashion</option>
            <option value="Women's Fashion">Women&apos;s Fashion</option>
            <option value="Accessories">Accessories</option>
            <option value="Denim">Denim</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="outline-secondary" className="w-100">
            <FaFilter className="me-2" />
            Filters
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k || 'products')} className="mb-4">
        <Tab eventKey="products" title="Products">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Categories</th>
                    <th>Base Price</th>
                    <th>Variants</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-image">
                          <img
                            src={product.imageUrl || '/content/images/no-image.png'}
                            alt={product.name || 'Product'}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-medium">{product.name || 'N/A'}</span>
                            {product.isActive === false && (
                              <Badge bg="secondary" className="text-uppercase">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <small className="text-muted">{product.description?.substring(0, 50) || 'No description'}...</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {product.categories?.map((category, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td>{formatCurrency(product.basePrice || 0)}</td>
                      <td>
                        <Badge bg="info">{product.variants?.length || 0} variants</Badge>
                      </td>
                      <td>
                        <Badge bg={product.isActive ? 'success' : 'danger'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            title="View Variants"
                            onClick={() => {
                              setSelectedProduct(product);
                              setActiveTab('variants');
                            }}
                          >
                            <FaList />
                          </Button>
                          <Button variant="outline-warning" size="sm" title="Edit" onClick={() => handleEditProduct(product)}>
                            <FaEdit />
                          </Button>
                          {product.isActive === false ? (
                            <Button variant="outline-success" size="sm" title="Activate" onClick={() => handleActivateProduct(product)}>
                              <FaCheck />
                            </Button>
                          ) : (
                            <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteProduct(product)}>
                              <FaTrash />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="variants" title="Product Variants">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{selectedProduct ? `Variants of "${selectedProduct.name}"` : 'Select a product to view variants'}</h5>
                {selectedProduct && (
                  <Button variant="primary" size="sm" onClick={() => handleAddVariant(selectedProduct)}>
                    <FaPlus className="me-2" />
                    Add Variant
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {selectedProduct ? (
                <Table responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>SKU</th>
                      <th>Attributes</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.variants?.map(variant => (
                      <tr key={variant.id}>
                        <td>
                          <div className="fw-medium">{variant.sku || 'N/A'}</div>
                        </td>
                        <td>
                          <div>
                            {Object.entries(variant.attributeValues || {}).map(([key, valueObj]) => (
                              <Badge key={key} bg="light" text="dark" className="me-1">
                                {key}: {valueObj.value}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">{variant.price?.toLocaleString() || '0'} VND</span>
                        </td>
                        <td>
                          <span className="fw-medium">{variant.stock || 0}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-warning"
                              size="sm"
                              title="Edit"
                              onClick={() => handleEditVariant(selectedProduct, variant)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Delete"
                              onClick={() => handleDeleteVariant(selectedProduct, variant)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <FaList size={48} className="text-muted mb-3" />
                  <p className="text-muted">Please select a product from the Products tab to view its variants</p>
                </div>
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
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
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

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit sản phẩm' : 'Add Product mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Base Price (VNĐ) *</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.basePrice}
                        onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                        placeholder="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Image</Form.Label>
                      <div className="border rounded p-3 mb-3" style={{ borderStyle: 'dashed' }}>
                        <div className="text-center">
                          <input
                            ref={productFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={e => void handleProductImageUpload(e)}
                            style={{ display: 'none' }}
                          />

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
                          ) : uploadState.uploadedUrl || formData.imageUrl ? (
                            <div className="py-2">
                              <img
                                src={uploadState.uploadedUrl || formData.imageUrl}
                                alt="Preview"
                                className="rounded border mb-2"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                onError={e => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => productFileInputRef.current?.click()}
                                  className="me-2"
                                >
                                  <FaUpload className="me-1" />
                                  Change Image
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={handleRemoveProductImage}>
                                  <FaTrash className="me-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-4">
                              <FaImage size={48} className="text-muted mb-3" />
                              <div>
                                <Button variant="outline-primary" onClick={() => productFileInputRef.current?.click()}>
                                  <FaUpload className="me-2" />
                                  Upload Image
                                </Button>
                              </div>
                              <small className="text-muted d-block mt-2">Click to select an image file (JPG, PNG, GIF - Max 5MB)</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaTag className="me-2" />
                    Categories
                  </Form.Label>
                  <div className="border rounded p-3 bg-light" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {categories.length === 0 ? (
                      <div className="text-muted text-center py-3">
                        <FaTag size={32} className="mb-2" />
                        <div>No categories available</div>
                        <small>Create categories first to assign to products</small>
                      </div>
                    ) : (
                      <div>
                        {renderCategoryTree(buildCategoryHierarchy(categories))}
                        {formData.categories.length > 0 && (
                          <div className="mt-3 pt-2 border-top">
                            <small className="text-muted">
                              <strong>Selected:</strong> {formData.categories.length} category(ies)
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editingProduct ? 'Update' : 'Add New'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Variant Modal */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingVariant ? 'Edit Variant' : 'Add Variant'}
            {selectedProduct && ` for "${selectedProduct.name}"`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU *</Form.Label>
                  <Form.Control
                    type="text"
                    value={variantForm.sku}
                    onChange={e => setVariantForm({ ...variantForm, sku: e.target.value })}
                    placeholder="Enter SKU"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    value={variantForm.price}
                    onChange={e => setVariantForm({ ...variantForm, price: e.target.value })}
                    placeholder="Enter price"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    value={variantForm.stock}
                    onChange={e => setVariantForm({ ...variantForm, stock: e.target.value })}
                    placeholder="Enter stock"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Variant Image</Form.Label>
              <div className="border rounded p-3 mb-3" style={{ borderStyle: 'dashed' }}>
                <div className="text-center">
                  <input
                    ref={variantFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={e => void handleVariantImageUpload(e)}
                    style={{ display: 'none' }}
                  />

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
                  ) : uploadState.uploadedUrl || variantForm.imageUrl ? (
                    <div className="py-2">
                      <img
                        src={uploadState.uploadedUrl || variantForm.imageUrl}
                        alt="Preview"
                        className="rounded border mb-2"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div>
                        <Button variant="outline-primary" size="sm" onClick={() => variantFileInputRef.current?.click()} className="me-2">
                          <FaUpload className="me-1" />
                          Change Image
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={handleRemoveVariantImage}>
                          <FaTrash className="me-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <FaImage size={48} className="text-muted mb-3" />
                      <div>
                        <Button variant="outline-primary" onClick={() => variantFileInputRef.current?.click()}>
                          <FaUpload className="me-2" />
                          Upload Image
                        </Button>
                      </div>
                      <small className="text-muted d-block mt-2">Click to select an image file (JPG, PNG, GIF - Max 5MB)</small>
                    </div>
                  )}
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="variantIsActive"
                label="Variant is active"
                checked={variantForm.isActive}
                onChange={e => setVariantForm({ ...variantForm, isActive: e.target.checked })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Attributes</Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const availableKeys = Object.keys(availableAttributes).filter(key => !variantForm.attributeValues[key]);
                    if (availableKeys.length === 0) {
                      alert('All available attributes have been added!');
                      return;
                    }
                    setShowAttributeSelectionModal(true);
                  }}
                >
                  <FaPlus className="me-1" />
                  Add Attribute
                </Button>
              </div>
              <div className="border rounded p-3">
                {Object.keys(variantForm.attributeValues).length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <FaTag className="mb-2" />
                    <p className="mb-0">No attributes selected. Click &quot;Add Attribute&quot; to select from available attributes.</p>
                    <small className="text-muted">Available: {Object.keys(availableAttributes).join(', ')}</small>
                  </div>
                ) : (
                  <div className="row g-2">
                    {Object.entries(variantForm.attributeValues).map(([key, valueObj]) => (
                      <div key={key} className="col-md-6">
                        <div className="d-flex gap-2">
                          <div className="flex-grow-1">
                            <Form.Label className="small">{key}</Form.Label>
                            <Form.Select
                              value={valueObj?.value || ''}
                              onChange={e => {
                                const selectedValue = e.target.value;
                                const attribute = attributes.find(attr => attr.name === key);
                                const attributeValue = attribute?.values.find(val => val.value === selectedValue);

                                setVariantForm({
                                  ...variantForm,
                                  attributeValues: {
                                    ...variantForm.attributeValues,
                                    [key]: attributeValue ? { id: attributeValue.id, value: attributeValue.value } : { id: 0, value: '' },
                                  },
                                });
                              }}
                            >
                              <option value="">Select {key}</option>
                              {availableAttributes[key]?.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                          <div className="d-flex align-items-end">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                const newAttributeValues = { ...variantForm.attributeValues };
                                delete newAttributeValues[key];
                                setVariantForm({
                                  ...variantForm,
                                  attributeValues: newAttributeValues,
                                });
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveVariant}>
            {editingVariant ? 'Update Variant' : 'Add Variant'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Attribute Selection Modal */}
      <Modal show={showAttributeSelectionModal} onHide={() => setShowAttributeSelectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Attribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose an attribute to add to this variant:</p>
          <div className="row g-2">
            {Object.keys(availableAttributes)
              .filter(key => !variantForm.attributeValues[key])
              .map(attributeKey => (
                <div key={attributeKey} className="col-md-6">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => {
                      setVariantForm({
                        ...variantForm,
                        attributeValues: { ...variantForm.attributeValues, [attributeKey]: { id: 0, value: '' } },
                      });
                      setShowAttributeSelectionModal(false);
                    }}
                  >
                    <FaTag className="me-2" />
                    {attributeKey}
                    <small className="d-block text-muted">{availableAttributes[attributeKey].length} values available</small>
                  </Button>
                </div>
              ))}
          </div>
          {Object.keys(availableAttributes).filter(key => !variantForm.attributeValues[key]).length === 0 && (
            <div className="text-center py-3">
              <p className="text-muted">All available attributes have been added!</p>
            </div>
          )}
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
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete product &quot;{productToDelete?.name}&quot;? This action cannot be undone.</Modal.Body>
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

export default ProductManagement;
