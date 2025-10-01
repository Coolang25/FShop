import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getNewProducts, getBestSellerProducts } from 'app/shared/reducers/home-products.reducer';
import ProductRating from './product-rating';

const ProductShowcase: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const newProducts = useAppSelector(state => state.homeProducts.newProducts);
  const bestSellerProducts = useAppSelector(state => state.homeProducts.bestSellerProducts);
  const loading = useAppSelector(state => state.homeProducts.loading);

  const [activeFilter, setActiveFilter] = useState('new');

  useEffect(() => {
    // Fetch only new and best seller products
    dispatch(getNewProducts(12));
    dispatch(getBestSellerProducts(12));
  }, [dispatch]);

  // Fallback data with different products for each category
  const fallbackNewProducts = [
    {
      id: 1,
      name: 'Latest iPhone 15 Pro',
      basePrice: 999.99,
      imageUrl: '/content/img/products/iphone15.jpg',
      categories: [{ name: 'electronics' }],
      isSale: true,
      oldPrice: 1099.99,
      rating: 4.9,
      reviews: 256,
    },
    {
      id: 2,
      name: 'New MacBook Air M3',
      basePrice: 1299.99,
      imageUrl: '/content/img/products/macbook.jpg',
      categories: [{ name: 'electronics' }],
      rating: 4.8,
      reviews: 189,
    },
    {
      id: 3,
      name: 'Fresh Spring Collection Dress',
      basePrice: 89.99,
      imageUrl: '/content/img/products/dress.jpg',
      categories: [{ name: 'clothing' }],
      rating: 4.7,
      reviews: 78,
    },
    {
      id: 4,
      name: 'New Gaming Headset',
      basePrice: 149.99,
      imageUrl: '/content/img/products/gaming-headset.jpg',
      categories: [{ name: 'electronics' }],
      isSale: true,
      oldPrice: 179.99,
      rating: 4.6,
      reviews: 134,
    },
  ];

  const fallbackBestSellerProducts = [
    {
      id: 5,
      name: 'Classic White Sneakers',
      basePrice: 79.99,
      imageUrl: '/content/img/products/sneakers.jpg',
      categories: [{ name: 'clothing' }],
      rating: 4.8,
      reviews: 445,
    },
    {
      id: 6,
      name: 'Best Seller Handbag',
      basePrice: 129.99,
      imageUrl: '/content/img/products/handbag.jpg',
      categories: [{ name: 'accessories' }],
      rating: 4.7,
      reviews: 389,
    },
    {
      id: 7,
      name: 'Popular Wireless Earbuds',
      basePrice: 99.99,
      imageUrl: '/content/img/products/earbuds.jpg',
      categories: [{ name: 'electronics' }],
      rating: 4.6,
      reviews: 567,
    },
    {
      id: 8,
      name: 'Top Rated Coffee Maker',
      basePrice: 199.99,
      imageUrl: '/content/img/products/coffee-maker.jpg',
      categories: [{ name: 'home' }],
      rating: 4.9,
      reviews: 234,
    },
  ];

  const filters = [
    { key: 'new', label: 'New Products' },
    { key: 'best-seller', label: 'Best Sellers' },
  ];

  // Get products based on active filter
  const getProductsForFilter = () => {
    switch (activeFilter) {
      case 'new':
        return newProducts.length > 0 ? newProducts : fallbackNewProducts;
      case 'best-seller':
        return bestSellerProducts.length > 0 ? bestSellerProducts : fallbackBestSellerProducts;
      default:
        return newProducts.length > 0 ? newProducts : fallbackNewProducts;
    }
  };

  const filteredProducts = getProductsForFilter();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa fa-star ${i < Math.floor(rating) ? 'text-warning' : 'text-muted'}`} style={{ fontSize: '0.9rem' }} />
    ));
  };

  if (loading) {
    return (
      <section className="product-showcase py-5">
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="product-showcase py-5">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title mb-3" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              Featured Products
            </h2>
            <p className="section-subtitle text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              Discover our handpicked selection of premium products
            </p>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <Row className="mb-4">
          <Col className="text-center">
            <ButtonGroup className="flex-wrap">
              {filters.map(filter => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveFilter(filter.key)}
                  className="me-2 mb-2"
                  style={{
                    borderRadius: '25px',
                    padding: '8px 20px',
                    fontWeight: '500',
                  }}
                >
                  {filter.label}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>

        {/* Products Grid */}
        <Row>
          {filteredProducts.map((product, index) => {
            const isSale = product.isSale || (product.oldPrice && product.oldPrice > product.basePrice);
            const discount = isSale && product.oldPrice ? Math.round(((product.oldPrice - product.basePrice) / product.oldPrice) * 100) : 0;

            return (
              <Col lg={3} md={6} className="mb-4" key={product.id || index}>
                <Card
                  className="product-card h-100 border-0 shadow-sm"
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                  }}
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
                      <ProductRating productId={product.id} showReviewsCount={true} size="sm" />
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
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{
                        borderRadius: '25px',
                        padding: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default ProductShowcase;
