import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './modern-product-detail.scss';

interface ProductDetailProps {
  productId: number;
}

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  attributeValues: Array<{
    id: number;
    value: string;
    attributeId: number;
    attributeName: string;
  }>;
}

interface ProductDetail {
  product: {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    imageUrl?: string;
    isActive: boolean;
  };
  variants: ProductVariant[];
  images: string[];
  attributes: Record<string, string[]>;
}

const ModernProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [availableAttributes, setAvailableAttributes] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProductDetail();
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/product-reviews?productId.equals=${productId}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return;

    try {
      setSubmittingReview(true);
      await axios.post('/api/product-reviews', {
        rating: newReview.rating,
        comment: newReview.comment,
        product: { id: productId },
        user: { id: 2 }, // Fixed user ID for now
      });

      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitReviewClick = () => {
    handleSubmitReview();
  };

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}/detail`);
      setProductDetail(response.data);

      // Initialize available attributes with all possible values
      setAvailableAttributes(response.data.attributes || {});
    } catch (err) {
      console.error('Error fetching product detail:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelectedAttributes = { ...selectedAttributes };

    // If clicking on already selected value, unselect it
    if (selectedAttributes[attributeName] === value) {
      delete newSelectedAttributes[attributeName];
    } else {
      // Otherwise, select the new value
      newSelectedAttributes[attributeName] = value;
    }

    setSelectedAttributes(newSelectedAttributes);

    // Find matching variant
    const matchingVariant = productDetail?.variants.find(variant => {
      return Object.entries(newSelectedAttributes).every(([attrName, attrValue]) => {
        return variant.attributeValues.some(av => av.attributeName === attrName && av.value === attrValue);
      });
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    } else {
      setSelectedVariant(null);
    }

    // Update available attributes based on current selection
    updateAvailableAttributes(newSelectedAttributes);
  };

  const updateAvailableAttributes = (currentSelection: Record<string, string>) => {
    if (!productDetail) return;

    const newAvailableAttributes: Record<string, string[]> = {};

    // For each attribute, find available values based on current selection
    Object.keys(productDetail.attributes).forEach(attrName => {
      if (currentSelection[attrName]) {
        // If this attribute is already selected, only show the selected value
        newAvailableAttributes[attrName] = [currentSelection[attrName]];
      } else {
        // Find all variants that match current selection
        const matchingVariants = productDetail.variants.filter(variant => {
          return Object.entries(currentSelection).every(([selectedAttrName, selectedValue]) => {
            return variant.attributeValues.some(av => av.attributeName === selectedAttrName && av.value === selectedValue);
          });
        });

        // Get unique values for this attribute from matching variants
        const availableValues = new Set<string>();
        matchingVariants.forEach(variant => {
          variant.attributeValues.forEach(av => {
            if (av.attributeName === attrName) {
              availableValues.add(av.value);
            }
          });
        });

        newAvailableAttributes[attrName] = Array.from(availableValues).sort();
      }
    });

    setAvailableAttributes(newAvailableAttributes);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa fa-star ${i < Math.floor(rating) ? 'text-warning' : 'text-muted'}`} />
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  const { product, variants, images, attributes } = productDetail;
  const currentImage = selectedVariant?.imageUrl || product.imageUrl;

  return (
    <div className="modern-product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb-section py-3" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" style={{ textDecoration: 'none', color: '#667eea' }}>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/shop" style={{ textDecoration: 'none', color: '#667eea' }}>
                  Shop
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="gx-5">
          {/* Product Images */}
          <Col lg={6} md={6} className="mb-4">
            <div className="product-images">
              {/* Main Image */}
              <div className="main-image">
                <div
                  className="image-container"
                  style={{
                    width: '100%',
                    height: '500px',
                    backgroundImage: `url(${currentImage || '/content/img/products/product-1.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6} md={6} className="mb-4">
            <div className="product-info">
              <h1 className="product-title mb-3" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2c3e50' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="product-rating mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-2">{renderStars(4.5)}</div>
                  <span className="text-muted">(4.5) • 128 reviews</span>
                </div>
              </div>

              {/* Price */}
              <div className="product-price mb-4">
                <span
                  className="current-price"
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#e74c3c',
                  }}
                >
                  ${selectedVariant?.price || product.basePrice}
                </span>
                {product.basePrice > (selectedVariant?.price || product.basePrice) && (
                  <span
                    className="old-price ms-3"
                    style={{
                      fontSize: '1.5rem',
                      color: '#95a5a6',
                      textDecoration: 'line-through',
                    }}
                  >
                    ${product.basePrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="product-description mb-4">
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#5a6c7d' }}>
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Attributes */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="product-attributes mb-4">
                  {Object.entries(availableAttributes).map(([attributeName, values]) => (
                    <div key={attributeName} className="attribute-group mb-3">
                      <h6 className="attribute-name mb-2" style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {attributeName}:
                      </h6>
                      <div className="attribute-values d-flex flex-wrap gap-2">
                        {values.map(value => {
                          const isSelected = selectedAttributes[attributeName] === value;
                          const isAvailable = values.includes(value);

                          return (
                            <Button
                              key={value}
                              variant={isSelected ? 'primary' : 'outline-secondary'}
                              size="sm"
                              onClick={() => handleAttributeChange(attributeName, value)}
                              disabled={!isAvailable}
                              style={{
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                opacity: isAvailable ? 1 : 0.5,
                              }}
                            >
                              {value}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock Status - Only show when all attributes are selected */}
              {Object.keys(availableAttributes).length > 0 &&
                Object.keys(selectedAttributes).length === Object.keys(availableAttributes).length && (
                  <div className="stock-status mb-4">
                    {selectedVariant ? (
                      <div>
                        <Badge bg={selectedVariant.stock > 0 ? 'success' : 'danger'} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                          {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock} available)` : 'Out of Stock'}
                        </Badge>
                        <div className="mt-2">
                          <small className="text-muted">SKU: {selectedVariant.sku}</small>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Badge bg="warning" style={{ fontSize: '1rem', padding: '8px 16px' }}>
                          Variant not available
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

              {/* Quantity and Add to Cart */}
              <div className="add-to-cart-section">
                <Row className="align-items-center">
                  <Col xs={4}>
                    <div className="quantity-selector">
                      <label className="form-label">Quantity:</label>
                      <div className="input-group">
                        <Button
                          variant="outline-secondary"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={!selectedVariant || selectedVariant.stock === 0}
                        >
                          -
                        </Button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={quantity}
                          onChange={e => setQuantity(Math.max(1, Math.min(selectedVariant?.stock || 1, parseInt(e.target.value, 10) || 1)))}
                          min="1"
                          max={selectedVariant?.stock || 1}
                          disabled={!selectedVariant || selectedVariant.stock === 0}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                          disabled={!selectedVariant || selectedVariant.stock === 0}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col xs={8}>
                    <div className="cart-actions">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-100"
                        style={{
                          borderRadius: '25px',
                          padding: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                      >
                        <i className="fa fa-shopping-cart me-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Product Features */}
              <div className="product-features mt-5">
                <Row>
                  <Col md={4} className="text-center mb-3">
                    <div className="feature-item">
                      <i className="fa fa-truck fa-2x text-primary mb-2" />
                      <h6>Free Shipping</h6>
                      <small className="text-muted">On orders over $50</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="feature-item">
                      <i className="fa fa-undo fa-2x text-primary mb-2" />
                      <h6>Easy Returns</h6>
                      <small className="text-muted">30-day return policy</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="feature-item">
                      <i className="fa fa-shield fa-2x text-primary mb-2" />
                      <h6>Secure Payment</h6>
                      <small className="text-muted">100% secure checkout</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Tabs */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <ul className="nav nav-tabs card-header-tabs" role="tablist">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                      onClick={() => setActiveTab('description')}
                      type="button"
                      role="tab"
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reviews')}
                      type="button"
                      role="tab"
                    >
                      Reviews ({reviews.length})
                    </button>
                  </li>
                </ul>
              </Card.Header>
              <Card.Body>
                <div className="tab-content">
                  {activeTab === 'description' && (
                    <div className="tab-pane fade show active" role="tabpanel">
                      <p>{product.description || 'No description available.'}</p>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div className="tab-pane fade show active" role="tabpanel">
                      <Row>
                        {/* Reviews List - Left Column */}
                        <Col lg={8} md={7}>
                          <div className="reviews-section">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                              <h5 className="mb-0" style={{ fontWeight: '700', color: '#2c3e50' }}>
                                Customer Reviews
                              </h5>
                              <Badge
                                bg="primary"
                                style={{
                                  fontSize: '0.9rem',
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  fontWeight: '600',
                                }}
                              >
                                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                              </Badge>
                            </div>

                            {reviews.length > 0 ? (
                              <div className="reviews-list">
                                {reviews.map((review, index) => (
                                  <Card
                                    key={index}
                                    className="review-item mb-4 border-0 shadow-sm"
                                    style={{
                                      borderRadius: '15px',
                                      overflow: 'hidden',
                                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                    }}
                                  >
                                    <Card.Body className="p-4">
                                      <div className="d-flex align-items-start">
                                        {/* User Avatar */}
                                        <div className="me-3">
                                          <div
                                            className="user-avatar rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                            style={{
                                              width: '60px',
                                              height: '60px',
                                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                              color: 'white',
                                              fontSize: '1.3rem',
                                              fontWeight: '700',
                                              border: '3px solid #fff',
                                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                            }}
                                          >
                                            U{review.userId}
                                          </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-grow-1">
                                          <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                              <h6 className="mb-1" style={{ fontWeight: '600', color: '#2c3e50' }}>
                                                User {review.userId}
                                              </h6>
                                              <div className="rating mb-2">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                  <i
                                                    key={i}
                                                    className={`fa fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                                                    style={{
                                                      fontSize: '1.1rem',
                                                      filter: i < review.rating ? 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3))' : 'none',
                                                      cursor: 'pointer',
                                                      transition: 'all 0.2s ease',
                                                    }}
                                                    onClick={() => {
                                                      // For now, just show the rating, later can add edit functionality
                                                      console.log(`Selected rating: ${i + 1}`);
                                                    }}
                                                    onMouseEnter={e => {
                                                      if (i < review.rating) {
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                      }
                                                    }}
                                                    onMouseLeave={e => {
                                                      e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                  />
                                                ))}
                                                <span className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                                  {review.rating}/5
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-end">
                                              <div className="d-flex flex-column align-items-end">
                                                <small className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                                  {new Date(review.lastModifiedDate || review.createdDate).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                  })}
                                                </small>
                                                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                  {new Date(review.lastModifiedDate || review.createdDate).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                  })}
                                                </small>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className="review-comment"
                                            style={{
                                              lineHeight: '1.6',
                                              color: '#5a6c7d',
                                              fontSize: '1rem',
                                              backgroundColor: '#f8f9fa',
                                              padding: '15px',
                                              borderRadius: '10px',
                                              border: '1px solid #e9ecef',
                                            }}
                                          >
                                            &ldquo;{review.comment}&rdquo;
                                          </div>
                                        </div>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <Card.Body className="text-center py-5">
                                  <div className="mb-4">
                                    <div
                                      className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
                                      style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontSize: '2rem',
                                      }}
                                    >
                                      <i className="fa fa-comment-o"></i>
                                    </div>
                                  </div>
                                  <h6 className="text-muted mb-2" style={{ fontWeight: '600' }}>
                                    No reviews yet
                                  </h6>
                                  <p className="text-muted mb-0">Be the first to share your thoughts about this product!</p>
                                </Card.Body>
                              </Card>
                            )}
                          </div>
                        </Col>

                        {/* Add Review Form - Right Column */}
                        <Col lg={4} md={5}>
                          <div className="add-review-section">
                            <div className="sticky-top" style={{ top: '20px' }}>
                              <Card
                                className="border-0 shadow-lg"
                                style={{
                                  borderRadius: '20px',
                                  overflow: 'hidden',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                              >
                                <Card.Header
                                  className="text-white border-0"
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '20px',
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        fontSize: '1.2rem',
                                      }}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </div>
                                    <div>
                                      <h6 className="mb-0" style={{ fontWeight: '700' }}>
                                        Write a Review
                                      </h6>
                                      <small style={{ opacity: '0.9' }}>Share your experience</small>
                                    </div>
                                  </div>
                                </Card.Header>
                                <Card.Body className="p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                                  <div className="review-form">
                                    <div className="mb-4">
                                      <label className="form-label fw-bold" style={{ color: '#2c3e50' }}>
                                        Your Rating:
                                      </label>
                                      <div className="rating-input text-center mb-3">
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                          {Array.from({ length: 5 }, (_, i) => {
                                            const starValue = i + 1;
                                            const isSelected = starValue <= newReview.rating;

                                            return (
                                              <button
                                                key={i}
                                                type="button"
                                                className="btn p-0 border-0 bg-transparent"
                                                onClick={() => {
                                                  console.log('Clicking star:', starValue);
                                                  setNewReview({ ...newReview, rating: starValue });
                                                }}
                                                style={{
                                                  fontSize: '2.5rem',
                                                  color: isSelected ? '#ffc107' : '#dee2e6',
                                                  cursor: 'pointer',
                                                  transition: 'all 0.2s ease',
                                                  padding: '5px',
                                                  borderRadius: '50%',
                                                }}
                                                onMouseEnter={e => {
                                                  e.currentTarget.style.transform = 'scale(1.1)';
                                                  e.currentTarget.style.color = '#ffc107';
                                                }}
                                                onMouseLeave={e => {
                                                  e.currentTarget.style.transform = 'scale(1)';
                                                  e.currentTarget.style.color = isSelected ? '#ffc107' : '#dee2e6';
                                                }}
                                              >
                                                <i className="fa fa-star" />
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      <div className="text-center mt-2">
                                        <small className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
                                          {newReview.rating} out of 5 stars
                                        </small>
                                        <div className="mt-1">
                                          <small className="text-info" style={{ fontSize: '0.8rem' }}>
                                            Current rating: {newReview.rating} (Click stars to change)
                                          </small>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-4">
                                      <label className="form-label fw-bold" style={{ color: '#2c3e50' }}>
                                        Your Comment:
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={4}
                                        value={newReview.comment}
                                        onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                        placeholder="Share your thoughts about this product..."
                                        style={{
                                          resize: 'vertical',
                                          borderRadius: '15px',
                                          border: '2px solid #e9ecef',
                                          fontSize: '0.95rem',
                                          lineHeight: '1.5',
                                          transition: 'border-color 0.3s ease',
                                        }}
                                        onFocus={e => {
                                          e.target.style.borderColor = '#667eea';
                                        }}
                                        onBlur={e => {
                                          e.target.style.borderColor = '#e9ecef';
                                        }}
                                      />
                                      <div className="mt-1">
                                        <small className="text-muted">{newReview.comment.length}/500 characters</small>
                                      </div>
                                    </div>

                                    <Button
                                      variant="primary"
                                      className="w-100"
                                      onClick={handleSubmitReviewClick}
                                      disabled={submittingReview || !newReview.comment.trim() || newReview.rating < 1}
                                      style={{
                                        borderRadius: '25px',
                                        padding: '12px',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        background:
                                          newReview.rating < 1 || !newReview.comment.trim()
                                            ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        boxShadow:
                                          newReview.rating < 1 || !newReview.comment.trim()
                                            ? '0 4px 15px rgba(108, 117, 125, 0.4)'
                                            : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.3s ease',
                                      }}
                                      onMouseEnter={e => {
                                        if (newReview.rating >= 1 && newReview.comment.trim()) {
                                          e.currentTarget.style.transform = 'translateY(-2px)';
                                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                                        }
                                      }}
                                      onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow =
                                          newReview.rating < 1 || !newReview.comment.trim()
                                            ? '0 4px 15px rgba(108, 117, 125, 0.4)'
                                            : '0 4px 15px rgba(102, 126, 234, 0.4)';
                                      }}
                                    >
                                      {submittingReview ? (
                                        <>
                                          <i className="fa fa-spinner fa-spin me-2"></i>
                                          Submitting...
                                        </>
                                      ) : newReview.rating < 1 ? (
                                        <>
                                          <i className="fa fa-star me-2"></i>
                                          Please select a rating
                                        </>
                                      ) : !newReview.comment.trim() ? (
                                        <>
                                          <i className="fa fa-comment me-2"></i>
                                          Please write a comment
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-paper-plane me-2"></i>
                                          Submit Review
                                        </>
                                      )}
                                    </Button>

                                    <div className="mt-4 text-center">
                                      <div
                                        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                                        style={{
                                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                          border: '1px solid rgba(102, 126, 234, 0.2)',
                                        }}
                                      >
                                        <i className="fa fa-shield-alt me-2" style={{ color: '#667eea' }}></i>
                                        <small style={{ color: '#667eea', fontWeight: '600' }}>Your review helps other customers</small>
                                      </div>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ModernProductDetail;
