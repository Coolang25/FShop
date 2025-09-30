import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getBestSellerProducts } from 'app/shared/reducers/home-products.reducer';
import ProductItem from './product-item';

const BestSellerSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.homeProducts.bestSellerProducts);
  const loading = useAppSelector(state => state.homeProducts.loading);

  useEffect(() => {
    // Lấy 4 sản phẩm bán chạy nhất cho trang home
    dispatch(getBestSellerProducts(4));
  }, [dispatch]);

  // Fallback data nếu chưa có dữ liệu từ API
  const fallbackProducts = [
    {
      id: 1,
      name: 'Cotton T-Shirt',
      basePrice: 59.0,
      imageUrl: '/content/img/trend/bs-1.jpg',
      categories: [{ name: 'women' }],
    },
    {
      id: 2,
      name: 'Zip-pockets pebbled tote briefcase',
      basePrice: 59.0,
      imageUrl: '/content/img/trend/bs-2.jpg',
      categories: [{ name: 'accessories' }],
    },
    {
      id: 3,
      name: 'Round leather bag',
      basePrice: 59.0,
      imageUrl: '/content/img/trend/bs-3.jpg',
      categories: [{ name: 'accessories' }],
    },
    {
      id: 4,
      name: 'Premium leather jacket',
      basePrice: 89.0,
      imageUrl: '/content/img/trend/bs-4.jpg',
      categories: [{ name: 'men' }],
    },
  ];

  // Sử dụng dữ liệu từ API hoặc fallback
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  if (loading) {
    return (
      <section className="best-seller spad">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="best-seller spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-title">
              <h2>Best Sellers</h2>
              <p>Our most popular products this season</p>
            </div>
          </div>
        </div>
        <div className="row property__gallery">
          {displayProducts.map((product, index) => {
            const categoryNames = product.categories?.map(cat => cat.name).join(' ') || 'general';
            const isSale = product.isSale || (product.oldPrice && product.oldPrice > product.basePrice);
            const label = isSale ? 'Sale' : 'Best Seller';

            return (
              <ProductItem
                key={product.id || index}
                title={product.name || 'Product'}
                price={`$${product.basePrice || 0}`}
                oldPrice={product.oldPrice ? `$${product.oldPrice}` : undefined}
                image={product.imageUrl || `/content/img/trend/bs-${index + 1}.jpg`}
                categories={categoryNames}
                isSale={isSale}
                label={label}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
