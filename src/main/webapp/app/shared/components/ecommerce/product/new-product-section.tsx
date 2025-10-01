import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getNewProducts } from 'app/shared/reducers/home-products.reducer';
import ProductItem from './product-item';

const NewProductSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.homeProducts.newProducts);
  const loading = useAppSelector(state => state.homeProducts.loading);

  useEffect(() => {
    // Lấy 3 sản phẩm mới nhất cho trang home
    dispatch(getNewProducts(3));
  }, [dispatch]);

  // Fallback data nếu chưa có dữ liệu từ API
  const fallbackProducts = [
    {
      id: 1,
      name: 'Chain bucket bag',
      basePrice: 59.0,
      imageUrl: '/content/img/trend/ht-1.jpg',
      categories: [{ name: 'accessories' }],
    },
    {
      id: 2,
      name: 'Pendant earrings',
      basePrice: 59.0,
      imageUrl: '/content/img/trend/ht-2.jpg',
      categories: [{ name: 'accessories' }],
    },
    {
      id: 3,
      name: 'Cotton T-Shirt',
      basePrice: 59.0,
      imageUrl: '/content/img/trend/ht-3.jpg',
      categories: [{ name: 'women' }],
    },
  ];

  // Sử dụng dữ liệu từ API hoặc fallback
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  if (loading) {
    return (
      <section className="new-product spad">
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
    <section className="new-product spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-title">
              <h2>New Products</h2>
            </div>
          </div>
        </div>
        <div className="row property__gallery">
          {displayProducts.map((product, index) => {
            const categoryNames = product.categories?.map(cat => cat.name).join(' ') || 'general';
            const isSale = product.isSale || (product.oldPrice && product.oldPrice > product.basePrice);
            const label = isSale ? 'Sale' : 'New';

            return (
              <ProductItem
                key={product.id || index}
                id={product.id}
                title={product.name || 'Product'}
                price={`$${product.basePrice || 0}`}
                oldPrice={product.oldPrice ? `$${product.oldPrice}` : undefined}
                image={product.imageUrl || `/content/img/trend/ht-${index + 1}.jpg`}
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

export default NewProductSection;
