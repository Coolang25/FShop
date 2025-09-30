import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getTrendProducts, getBestSellerProducts, getFeaturedProducts } from 'app/shared/reducers/home-products.reducer';

interface TrendItemProps {
  img: string;
  title: string;
  price: string;
}

const TrendItem: React.FC<TrendItemProps> = ({ img, title, price }) => (
  <div className="trend__item">
    <div className="trend__item__pic">
      <img src={img} alt={title} />
    </div>
    <div className="trend__item__text">
      <h6>{title}</h6>
      <div className="rating">
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
        <i className="fa fa-star"></i>
      </div>
      <div className="product__price">{price}</div>
    </div>
  </div>
);

interface TrendContentProps {
  title: string;
  items: TrendItemProps[];
  loading?: boolean;
}

const TrendContent: React.FC<TrendContentProps> = ({ title, items, loading }) => (
  <div className="trend__content">
    <div className="section-title">
      <h4>{title}</h4>
    </div>
    {loading ? (
      <div className="text-center">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      items.map((item, index) => <TrendItem key={index} {...item} />)
    )}
  </div>
);

const TrendSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const trendProducts = useAppSelector(state => state.homeProducts.trendProducts);
  const bestSellerProducts = useAppSelector(state => state.homeProducts.bestSellerProducts);
  const featuredProducts = useAppSelector(state => state.homeProducts.featuredProducts);
  const loading = useAppSelector(state => state.homeProducts.loading);

  useEffect(() => {
    // Load tất cả các loại sản phẩm cho trend section
    dispatch(getTrendProducts(3));
    dispatch(getBestSellerProducts(3));
    dispatch(getFeaturedProducts(3));
  }, [dispatch]);

  // Fallback data cho từng section
  const fallbackTrendItems = [
    { img: '/content/img/trend/ht-1.jpg', title: 'Chain bucket bag', price: '$ 59.0' },
    { img: '/content/img/trend/ht-2.jpg', title: 'Pendant earrings', price: '$ 59.0' },
    { img: '/content/img/trend/ht-3.jpg', title: 'Cotton T-Shirt', price: '$ 59.0' },
  ];

  const fallbackBestSellerItems = [
    { img: '/content/img/trend/bs-1.jpg', title: 'Cotton T-Shirt', price: '$ 59.0' },
    { img: '/content/img/trend/bs-2.jpg', title: 'Zip-pockets pebbled tote briefcase', price: '$ 59.0' },
    { img: '/content/img/trend/bs-3.jpg', title: 'Round leather bag', price: '$ 59.0' },
  ];

  const fallbackFeatureItems = [
    { img: '/content/img/trend/f-1.jpg', title: 'Bow wrap skirt', price: '$ 59.0' },
    { img: '/content/img/trend/f-2.jpg', title: 'Metallic earrings', price: '$ 59.0' },
    { img: '/content/img/trend/f-3.jpg', title: 'Flap cross-body bag', price: '$ 59.0' },
  ];

  // Convert products to trend items format
  const convertToTrendItems = (products: any[], fallbackItems: any[]) => {
    if (products.length === 0) return fallbackItems;

    return products.slice(0, 3).map((product, index) => ({
      img: product.imageUrl || fallbackItems[index]?.img || `/content/img/trend/ht-${index + 1}.jpg`,
      title: product.name || fallbackItems[index]?.title || 'Product',
      price: `$${product.basePrice || 59.0}`,
    }));
  };

  const trendItems = convertToTrendItems(trendProducts, fallbackTrendItems);
  const bestSellerItems = convertToTrendItems(bestSellerProducts, fallbackBestSellerItems);
  const featureItems = convertToTrendItems(featuredProducts, fallbackFeatureItems);

  return (
    <section className="trend spad">
      <Container>
        <Row>
          <Col lg={4} md={4} sm={6}>
            <TrendContent title="Hot Trend" items={trendItems} loading={loading} />
          </Col>
          <Col lg={4} md={4} sm={6}>
            <TrendContent title="Best seller" items={bestSellerItems} loading={loading} />
          </Col>
          <Col lg={4} md={4} sm={6}>
            <TrendContent title="Feature" items={featureItems} loading={loading} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TrendSection;
