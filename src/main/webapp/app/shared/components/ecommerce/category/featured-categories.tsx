import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

interface CategoryWithCount {
  id: number;
  name: string;
  image?: string;
  productCount: number;
  description?: string;
}

const FeaturedCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/categories/parent');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
        // Use fallback data if API fails
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchParentCategories();
  }, []);

  // Fallback data
  const fallbackCategories: CategoryWithCount[] = [
    {
      id: 1,
      name: "Women's Fashion",
      image: '/content/img/categories/women-fashion.jpg',
      productCount: 150,
      description: 'Trendy and elegant fashion for women',
    },
    {
      id: 2,
      name: "Men's Style",
      image: '/content/img/categories/men-style.jpg',
      productCount: 120,
      description: "Modern and sophisticated men's clothing",
    },
    {
      id: 3,
      name: 'Accessories',
      image: '/content/img/categories/accessories.jpg',
      productCount: 80,
      description: 'Complete your look with our accessories',
    },
    {
      id: 4,
      name: 'Electronics',
      image: '/content/img/categories/electronics.jpg',
      productCount: 200,
      description: 'Latest technology and gadgets',
    },
    {
      id: 5,
      name: 'Home & Living',
      image: '/content/img/categories/home-living.jpg',
      productCount: 90,
      description: 'Beautiful home decor and furniture',
    },
    {
      id: 6,
      name: 'Sports & Fitness',
      image: '/content/img/categories/sports-fitness.jpg',
      productCount: 75,
      description: 'Gear up for your active lifestyle',
    },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  if (loading) {
    return (
      <section className="featured-categories py-5">
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
    <section className="featured-categories py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title mb-3" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              Shop by Category
            </h2>
            <p className="section-subtitle text-muted" style={{ fontSize: '1.1rem' }}>
              Explore our wide range of categories and find exactly what you&apos;re looking for
            </p>
          </Col>
        </Row>

        <Row>
          {displayCategories.slice(0, 6).map((category, index) => (
            <Col lg={4} md={6} className="mb-4" key={category.id || index}>
              <Card
                className="category-card h-100 border-0 shadow-sm"
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
                <div
                  className="category-image"
                  style={{
                    height: '200px',
                    backgroundImage: `url(${category.image || `/content/img/categories/category-${index + 1}.jpg`})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    className="category-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
                    }}
                  />
                </div>

                <Card.Body className="text-center p-4">
                  <h5 className="category-name mb-2" style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {category.name}
                  </h5>
                  <p className="category-description text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    {category.description || 'Explore our amazing collection'}
                  </p>
                  <div className="category-stats">
                    <span
                      className="badge bg-primary"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {category.productCount || 0} Products
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedCategories;
