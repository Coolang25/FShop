import React, { useState, useEffect } from 'react';
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
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaUpload, FaImage, FaBox, FaTag, FaCogs, FaList } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  categories: string[];
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: string;
}

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  attributes: { [key: string]: string };
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [availableAttributes, setAvailableAttributes] = useState<{ [key: string]: string[] }>({});
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
    categories: [] as string[],
    isActive: true,
  });

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    sku: '',
    price: '',
    attributes: {} as { [key: string]: string },
  });

  useEffect(() => {
    fetchProducts();
    fetchAvailableAttributes();
  }, []);

  const fetchProducts = () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Premium Men's T-Shirt",
          description: 'High-quality cotton t-shirt, comfortable and easy to wash',
          basePrice: 250000,
          imageUrl: '/content/images/product1.jpg',
          categories: ["Men's Fashion", 'T-Shirts'],
          variants: [
            { id: 1, sku: 'TS001-S-RED', price: 250000, attributes: { Size: 'S', Color: 'Red' } },
            { id: 2, sku: 'TS001-M-RED', price: 250000, attributes: { Size: 'M', Color: 'Red' } },
            { id: 3, sku: 'TS001-L-BLUE', price: 250000, attributes: { Size: 'L', Color: 'Blue' } },
            { id: 4, sku: 'TS001-XL-BLACK', price: 250000, attributes: { Size: 'XL', Color: 'Black' } },
          ],
          isActive: true,
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: "Women's Slim Fit Jeans",
          description: 'Slim fit jeans for women, premium denim material',
          basePrice: 450000,
          imageUrl: '/content/images/product2.jpg',
          categories: ["Women's Fashion", 'Jeans'],
          variants: [
            { id: 5, sku: 'WJ002-28-BLUE', price: 450000, attributes: { Size: '28', Color: 'Blue' } },
            { id: 6, sku: 'WJ002-30-BLUE', price: 450000, attributes: { Size: '30', Color: 'Blue' } },
            { id: 7, sku: 'WJ002-32-BLACK', price: 450000, attributes: { Size: '32', Color: 'Black' } },
          ],
          isActive: true,
          createdAt: '2024-01-14',
        },
        {
          id: 3,
          name: 'Leather Handbag',
          description: 'Genuine leather handbag, perfect for daily use',
          basePrice: 800000,
          imageUrl: '/content/images/product3.jpg',
          categories: ['Accessories', 'Bags'],
          variants: [
            { id: 8, sku: 'LB003-BROWN', price: 800000, attributes: { Color: 'Brown', Material: 'Leather' } },
            { id: 9, sku: 'LB003-BLACK', price: 800000, attributes: { Color: 'Black', Material: 'Leather' } },
          ],
          isActive: true,
          createdAt: '2024-01-13',
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAttributes = () => {
    try {
      // Mock data - replace with actual API call to Attribute Management
      const mockAttributes = {
        Size: ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'],
        Color: ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Brown', 'Gray', 'Pink', 'Purple'],
        Material: ['Cotton', 'Polyester', 'Denim', 'Leather', 'Silk', 'Wool', 'Linen', 'Rayon'],
        Brand: ['Nike', 'Adidas', 'Puma', 'Uniqlo', 'Zara', 'H&M', 'Gap', "Levi's"],
        Style: ['Casual', 'Formal', 'Sport', 'Vintage', 'Modern', 'Classic'],
        Gender: ['Men', 'Women', 'Unisex', 'Kids'],
        Season: ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'],
      };
      setAvailableAttributes(mockAttributes);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
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
      name: product.name,
      description: product.description,
      basePrice: product.basePrice.toString(),
      imageUrl: product.imageUrl,
      categories: product.categories,
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    // Handle save logic here
    console.log('Saving product:', formData);
    setShowModal(false);
    fetchProducts(); // Refresh the list
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting product:', productToDelete);
    setShowDeleteModal(false);
    setProductToDelete(null);
    fetchProducts(); // Refresh the list
  };

  // Variant management functions
  const handleAddVariant = (product: Product) => {
    setSelectedProduct(product);
    setEditingVariant(null);
    setVariantForm({
      sku: '',
      price: product.basePrice.toString(),
      attributes: {},
    });
    setShowVariantModal(true);
  };

  const handleEditVariant = (product: Product, variant: ProductVariant) => {
    setSelectedProduct(product);
    setEditingVariant(variant);
    setVariantForm({
      sku: variant.sku,
      price: variant.price.toString(),
      attributes: { ...variant.attributes },
    });
    setShowVariantModal(true);
  };

  const handleSaveVariant = () => {
    if (!selectedProduct) return;

    // Handle save logic here
    console.log('Saving variant:', variantForm, 'for product:', selectedProduct.name);
    setShowVariantModal(false);
    setSelectedProduct(null);
    setEditingVariant(null);
    fetchProducts(); // Refresh the list
  };

  const handleDeleteVariant = (product: Product, variant: ProductVariant) => {
    // Handle delete logic here
    console.log('Deleting variant:', variant.sku, 'from product:', product.name);
    fetchProducts(); // Refresh the list
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categories.includes(selectedCategory);
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
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{product.name}</div>
                          <small className="text-muted">{product.description.substring(0, 50)}...</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {product.categories.map((category, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td>{formatCurrency(product.basePrice)}</td>
                      <td>
                        <Badge bg="info">{product.variants.length} variants</Badge>
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
                          <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteProduct(product)}>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.variants.map(variant => (
                      <tr key={variant.id}>
                        <td>
                          <div className="fw-medium">{variant.sku}</div>
                        </td>
                        <td>
                          <div>
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <Badge key={key} bg="light" text="dark" className="me-1">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">{variant.price.toLocaleString()} VND</span>
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
                      <Form.Label>URL hình ảnh</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          value={formData.imageUrl}
                          onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://..."
                        />
                        <Button variant="outline-secondary">
                          <FaUpload />
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image xem trước</Form.Label>
                  <div className="border rounded p-3 text-center">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    ) : (
                      <div className="text-muted">
                        <FaImage size={48} />
                        <div>Chưa có hình ảnh</div>
                      </div>
                    )}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="isActive"
                    label="Sản phẩm hoạt động"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
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
              <Col md={6}>
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
              <Col md={6}>
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
            </Row>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Attributes</Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const availableKeys = Object.keys(availableAttributes).filter(key => !variantForm.attributes[key]);
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
                {Object.keys(variantForm.attributes).length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <FaTag className="mb-2" />
                    <p className="mb-0">No attributes selected. Click &quot;Add Attribute&quot; to select from available attributes.</p>
                    <small className="text-muted">Available: {Object.keys(availableAttributes).join(', ')}</small>
                  </div>
                ) : (
                  <div className="row g-2">
                    {Object.entries(variantForm.attributes).map(([key, value]) => (
                      <div key={key} className="col-md-6">
                        <div className="d-flex gap-2">
                          <div className="flex-grow-1">
                            <Form.Label className="small">{key}</Form.Label>
                            <Form.Select
                              value={value}
                              onChange={e =>
                                setVariantForm({
                                  ...variantForm,
                                  attributes: { ...variantForm.attributes, [key]: e.target.value },
                                })
                              }
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
                                const newAttributes = { ...variantForm.attributes };
                                delete newAttributes[key];
                                setVariantForm({
                                  ...variantForm,
                                  attributes: newAttributes,
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
              .filter(key => !variantForm.attributes[key])
              .map(attributeKey => (
                <div key={attributeKey} className="col-md-6">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => {
                      setVariantForm({
                        ...variantForm,
                        attributes: { ...variantForm.attributes, [attributeKey]: '' },
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
          {Object.keys(availableAttributes).filter(key => !variantForm.attributes[key]).length === 0 && (
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
