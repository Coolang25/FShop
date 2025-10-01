import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';
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
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Authentication state
  const account = useAppSelector(state => state.authentication.account);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const navigate = useNavigate();

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

    // Check if user is authenticated
    if (!isAuthenticated || !account?.id) {
      // Save current URL and redirect to login page
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post('/api/product-reviews', {
        rating: newReview.rating,
        comment: newReview.comment,
        product: { id: productId },
        user: { id: account.id }, // Use current logged-in user ID
      });

      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Error submitting review. Please try again!');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitReviewClick = () => {
    handleSubmitReview();
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !account?.id) {
      // Save current URL and redirect to login page
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Check if variant is selected
    if (!selectedVariant) {
      setCartMessage({ type: 'error', text: 'Please select product options!' });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    // Check stock availability
    if (selectedVariant.stock < quantity) {
      setCartMessage({ type: 'error', text: 'Not enough stock available!' });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    try {
      setAddingToCart(true);

      // Use optimized single API call to add item to cart
      const response = await axios.post('/api/carts/add-item', null, {
        params: {
          userId: account.id,
          variantId: selectedVariant.id,
          quantity,
        },
      });

      setCartMessage({ type: 'success', text: 'Product added to cart successfully!' });
      setTimeout(() => setCartMessage(null), 3000);

      // Trigger cart count refresh in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Error adding to cart:', err);
      console.error('Error details:', err.response?.data);
      setCartMessage({ type: 'error', text: 'Error adding product to cart. Please try again!' });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return totalRating / reviews.length;
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
                  <div className="me-2">{renderStars(calculateAverageRating())}</div>
                  <span className="text-muted">
                    ({calculateAverageRating().toFixed(1)}) • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
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
                        onClick={() => {
                          handleAddToCart();
                        }}
                        disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
                        style={{
                          borderRadius: '25px',
                          padding: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background:
                            !selectedVariant || selectedVariant.stock === 0 || addingToCart
                              ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {addingToCart ? (
                          <>
                            <i className="fa fa-spinner fa-spin me-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-shopping-cart me-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      {/* Cart Message */}
                      {cartMessage && (
                        <div
                          className={`alert ${cartMessage.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}
                          style={{
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                          }}
                        >
                          <i className={`fa ${cartMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`} />
                          {cartMessage.text}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Product Features */}
              <div className="product-features mt-4">
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
                      <div className="reviews-chat-container">
                        {/* Reviews Header */}
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <h5 className="mb-0" style={{ fontWeight: '700', color: '#2c3e50' }}>
                            <i className="fa fa-comments me-2 text-primary"></i>
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

                        {/* Reviews Chat Area */}
                        <div
                          className="reviews-chat-area"
                          style={{
                            maxHeight: '600px',
                            overflowY: 'auto',
                            border: '1px solid #e9ecef',
                            borderRadius: '15px',
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            marginBottom: '20px',
                          }}
                        >
                          {reviews.length > 0 ? (
                            <div className="reviews-messages">
                              {reviews.map((review, index) => (
                                <div
                                  key={index}
                                  className="review-message mb-4"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                  }}
                                >
                                  {/* User Avatar */}
                                  <div className="flex-shrink-0">
                                    <div
                                      className="user-avatar rounded-circle d-flex align-items-center justify-content-center"
                                      style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                                      }}
                                    >
                                      U{review.userId}
                                    </div>
                                  </div>

                                  {/* Message Content */}
                                  <div className="flex-grow-1">
                                    <div
                                      className="message-bubble"
                                      style={{
                                        backgroundColor: 'white',
                                        borderRadius: '18px 18px 18px 4px',
                                        padding: '12px 16px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #e9ecef',
                                        maxWidth: '80%',
                                      }}
                                    >
                                      {/* User Info & Rating */}
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                          <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                            User {review.userId}
                                          </span>
                                          <div className="rating d-inline-block ms-2">
                                            {Array.from({ length: 5 }, (_, i) => (
                                              <i
                                                key={i}
                                                className={`fa fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                                                style={{
                                                  fontSize: '0.8rem',
                                                  filter: i < review.rating ? 'drop-shadow(0 1px 2px rgba(255, 193, 7, 0.3))' : 'none',
                                                }}
                                              />
                                            ))}
                                            <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                              {review.rating}/5
                                            </span>
                                          </div>
                                        </div>
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                          {new Date(review.lastModifiedDate || review.createdDate).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                          })}{' '}
                                          {new Date(review.lastModifiedDate || review.createdDate).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                          })}
                                        </small>
                                      </div>

                                      {/* Review Text */}
                                      <div
                                        className="review-text"
                                        style={{
                                          color: '#2c3e50',
                                          fontSize: '0.95rem',
                                          lineHeight: '1.5',
                                          margin: 0,
                                        }}
                                      >
                                        {review.comment}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-5">
                              <div
                                className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  fontSize: '1.5rem',
                                }}
                              >
                                <i className="fa fa-comment-o"></i>
                              </div>
                              <h6 className="text-muted mb-2" style={{ fontWeight: '600' }}>
                                Chưa có đánh giá nào
                              </h6>
                              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này!
                              </p>
                            </div>
                          )}
                        </div>

                        {/* New Review Input - Like Message Input */}
                        <div className="new-review-input">
                          {isAuthenticated && account ? (
                            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                              <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-3">
                                  <div
                                    className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      color: 'white',
                                      fontSize: '1.1rem',
                                      fontWeight: '700',
                                    }}
                                  >
                                    {account.firstName ? account.firstName.charAt(0).toUpperCase() : account.login.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h6 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                                      Write a Review
                                    </h6>
                                    <small className="text-muted">Share your experience ({account.firstName || account.login})</small>
                                  </div>
                                </div>

                                {/* Rating Input */}
                                <div className="mb-3">
                                  <label className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.9rem' }}>
                                    Your Rating:
                                  </label>
                                  <div className="rating-input">
                                    <div className="d-flex align-items-center gap-1">
                                      {Array.from({ length: 5 }, (_, i) => {
                                        const starValue = i + 1;
                                        const isSelected = starValue <= newReview.rating;

                                        return (
                                          <button
                                            key={i}
                                            type="button"
                                            className="btn p-0 border-0 bg-transparent"
                                            onClick={() => {
                                              setNewReview({ ...newReview, rating: starValue });
                                            }}
                                            style={{
                                              fontSize: '1.8rem',
                                              color: isSelected ? '#ffc107' : '#dee2e6',
                                              cursor: 'pointer',
                                              transition: 'all 0.2s ease',
                                              padding: '2px',
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
                                      <span className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                        {newReview.rating}/5 stars
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Message Input */}
                                <div className="input-group">
                                  <textarea
                                    className="form-control"
                                    rows={3}
                                    value={newReview.comment}
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Write your review about this product..."
                                    style={{
                                      resize: 'none',
                                      borderRadius: '15px 0 0 15px',
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
                                  <Button
                                    variant="primary"
                                    onClick={handleSubmitReviewClick}
                                    disabled={submittingReview || !newReview.comment.trim() || newReview.rating < 1}
                                    style={{
                                      borderRadius: '0 15px 15px 0',
                                      padding: '12px 20px',
                                      fontWeight: '600',
                                      background:
                                        newReview.rating < 1 || !newReview.comment.trim()
                                          ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      border: 'none',
                                      transition: 'all 0.3s ease',
                                    }}
                                  >
                                    {submittingReview ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-paper-plane"></i>}
                                  </Button>
                                </div>

                                <div className="mt-2 d-flex justify-content-between align-items-center">
                                  <small className="text-muted">{newReview.comment.length}/500 characters</small>
                                  {newReview.rating < 1 && (
                                    <small className="text-warning">
                                      <i className="fa fa-exclamation-triangle me-1"></i>
                                      Please select a rating
                                    </small>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          ) : (
                            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                              <Card.Body className="p-4 text-center">
                                <div className="mb-3">
                                  <div
                                    className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      color: 'white',
                                      fontSize: '1.5rem',
                                    }}
                                  >
                                    <i className="fa fa-lock"></i>
                                  </div>
                                  <h6 className="mb-2" style={{ fontWeight: '600', color: '#2c3e50' }}>
                                    Login to Write a Review
                                  </h6>
                                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                    You need to login to share your review about this product
                                  </p>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}>
                                      <Button
                                        variant="primary"
                                        style={{
                                          borderRadius: '25px',
                                          padding: '8px 20px',
                                          fontWeight: '600',
                                        }}
                                      >
                                        <i className="fa fa-sign-in me-2"></i>
                                        Login
                                      </Button>
                                    </Link>
                                    <Link to="/register">
                                      <Button
                                        variant="outline-primary"
                                        style={{
                                          borderRadius: '25px',
                                          padding: '8px 20px',
                                          fontWeight: '600',
                                        }}
                                      >
                                        <i className="fa fa-user-plus me-2"></i>
                                        Sign Up
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          )}
                        </div>
                      </div>
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
