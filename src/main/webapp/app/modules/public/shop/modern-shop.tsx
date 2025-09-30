import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Pagination, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import axios from 'axios';
import './modern-shop.scss';

interface CategoryWithCount {
  id: number;
  name: string;
  image?: string;
  productCount: number;
}

const ModernShop: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // Function to fetch products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: (currentPage - 1).toString(),
        size: itemsPerPage.toString(),
        sort:
          sortBy === 'newest'
            ? 'id,desc'
            : sortBy === 'price-low'
              ? 'basePrice,asc'
              : sortBy === 'price-high'
                ? 'basePrice,desc'
                : sortBy === 'name-asc'
                  ? 'name,asc'
                  : sortBy === 'name-desc'
                    ? 'name,desc'
                    : 'id,desc',
      });

      // Use ProductCriteria format for filtering
      if (selectedCategory !== 'all') {
        params.append('categoriesId.equals', selectedCategory);
      }

      if (debouncedSearchTerm) {
        params.append('name.contains', debouncedSearchTerm);
      }

      const response = await axios.get(`/api/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, selectedCategory, sortBy, debouncedSearchTerm]);

  // Function to fetch total count with current filters
  const fetchTotalCount = async () => {
    try {
      const params = new URLSearchParams();

      if (selectedCategory !== 'all') {
        params.append('categoriesId.equals', selectedCategory);
      }

      if (debouncedSearchTerm) {
        params.append('name.contains', debouncedSearchTerm);
      }

      const response = await axios.get(`/api/products/count?${params.toString()}`);
      setTotalProducts(response.data);
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  useEffect(() => {
    // Fetch parent categories
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get('/api/categories/parent');
        setCategories(response.data);

        // Calculate total products for "All Products"
        const totalResponse = await axios.get('/api/products/count');
        setTotalProducts(totalResponse.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
        // Fallback categories
        setCategories([
          { id: 1, name: 'Electronics', productCount: 50 },
          { id: 2, name: 'Clothing', productCount: 30 },
          { id: 3, name: 'Accessories', productCount: 20 },
          { id: 4, name: 'Home & Living', productCount: 25 },
        ]);
        setTotalProducts(125);
      }
    };

    fetchParentCategories();
  }, []);

  // Update total count when filters change
  useEffect(() => {
    fetchTotalCount();
  }, [selectedCategory, debouncedSearchTerm]);

  // Products are already filtered and sorted by API
  const displayProducts = products;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa fa-star ${i < Math.floor(rating) ? 'text-warning' : 'text-muted'}`} style={{ fontSize: '0.9rem' }} />
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-shop">
      {/* Page Header */}
      <div className="page-header py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row>
            <Col>
              <h1 className="page-title mb-3" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                Shop
              </h1>
              <p className="page-subtitle text-muted" style={{ fontSize: '1.1rem' }}>
                Discover our amazing collection of products
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {/* Sidebar */}
          <Col lg={3} md={4} className="mb-4">
            <div className="shop-sidebar">
              {/* Search Bar */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header style={{ backgroundColor: '#667eea', color: 'white', fontWeight: '600' }}>Search</Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '10px' }}
                  />
                </Card.Body>
              </Card>

              {/* Categories Filter */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header style={{ backgroundColor: '#667eea', color: 'white', fontWeight: '600' }}>Categories</Card.Header>
                <Card.Body>
                  <div className="category-filters">
                    <div
                      className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory('all');
                        setCurrentPage(1);
                      }}
                      style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>All Products</span>
                        <Badge bg="secondary">{totalProducts}</Badge>
                      </div>
                    </div>
                    {categories.map(category => (
                      <div
                        key={category.id}
                        className={`category-filter ${selectedCategory === category.id?.toString() ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category.id?.toString() || '');
                          setCurrentPage(1);
                        }}
                        style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{category.name}</span>
                          <Badge bg="secondary">{category.productCount}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Sort Options */}
              <Card className="border-0 shadow-sm">
                <Card.Header style={{ backgroundColor: '#667eea', color: 'white', fontWeight: '600' }}>Sort By</Card.Header>
                <Card.Body>
                  <Form.Select
                    value={sortBy}
                    onChange={e => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Products Grid */}
          <Col lg={9} md={8}>
            <div className="products-section">
              {/* Results Header */}
              <div className="results-header mb-4">
                <h5 className="mb-0">
                  Showing {displayProducts.length} of {totalProducts} products
                </h5>
              </div>

              {/* Products Grid */}
              <Row>
                {displayProducts.map((product, index) => {
                  const isSale = product.isSale || (product.oldPrice && product.oldPrice > product.basePrice);
                  const discount =
                    isSale && product.oldPrice ? Math.round(((product.oldPrice - product.basePrice) / product.oldPrice) * 100) : 0;

                  return (
                    <Col lg={4} md={6} className="mb-4" key={product.id || index}>
                      <Card
                        className="product-card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: '15px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="product-image-container position-relative">
                          <div
                            className="product-image"
                            style={{
                              height: '250px',
                              backgroundImage: `url(${product.imageUrl || `/content/img/products/product-${index + 1}.jpg`})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />

                          {isSale && (
                            <Badge
                              bg="danger"
                              className="position-absolute top-0 start-0 m-2"
                              style={{ borderRadius: '20px', padding: '6px 12px' }}
                            >
                              -{discount}%
                            </Badge>
                          )}

                          <div className="product-actions position-absolute top-0 end-0 m-2">
                            <Button
                              variant="light"
                              size="sm"
                              className="rounded-circle me-1 mb-1"
                              style={{ width: '35px', height: '35px' }}
                            >
                              <i className="fa fa-heart-o" />
                            </Button>
                            <Button variant="light" size="sm" className="rounded-circle" style={{ width: '35px', height: '35px' }}>
                              <i className="fa fa-eye" />
                            </Button>
                          </div>
                        </div>

                        <Card.Body className="p-3">
                          <h6
                            className="product-name mb-2"
                            style={{
                              fontWeight: '600',
                              color: '#2c3e50',
                              fontSize: '1rem',
                              lineHeight: '1.3',
                            }}
                          >
                            {product.name}
                          </h6>

                          <div className="product-rating mb-2">
                            <div className="d-flex align-items-center">
                              <div className="me-2">{renderStars(4.5)}</div>
                              <small className="text-muted">({Math.floor(Math.random() * 100) + 20})</small>
                            </div>
                          </div>

                          <div className="product-price mb-3">
                            <span
                              className="current-price"
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: '#e74c3c',
                              }}
                            >
                              ${product.basePrice || 0}
                            </span>
                            {isSale && product.oldPrice && (
                              <span
                                className="old-price ms-2"
                                style={{
                                  fontSize: '1rem',
                                  color: '#95a5a6',
                                  textDecoration: 'line-through',
                                }}
                              >
                                ${product.oldPrice}
                              </span>
                            )}
                          </div>

                          <Button
                            variant="primary"
                            className="w-100"
                            style={{
                              borderRadius: '25px',
                              padding: '10px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* Pagination */}
              <div className="pagination-wrapper mt-5">
                <Pagination className="justify-content-center">
                  <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => setCurrentPage(pageNumber)}>
                        {pageNumber}
                      </Pagination.Item>
                    );
                  })}
                  <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
                </Pagination>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ModernShop;
