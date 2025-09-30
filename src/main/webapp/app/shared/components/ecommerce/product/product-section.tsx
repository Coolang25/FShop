import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getFeaturedProducts } from 'app/shared/reducers/home-products.reducer';
import ProductSectionHeader from './product-section-header';
import ProductItem from './product-item';

const ProductSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.homeProducts.featuredProducts);
  const loading = useAppSelector(state => state.homeProducts.loading);

  useEffect(() => {
    // Lấy 8 sản phẩm nổi bật cho trang home
    dispatch(getFeaturedProducts(8));
  }, [dispatch]);

  // Fallback data nếu chưa có dữ liệu từ API
  const fallbackProducts = [
    {
      id: 1,
      name: 'Buttons tweed blazer',
      basePrice: 59.0,
      imageUrl: '/content/img/product/product-1.jpg',
      categories: [{ name: 'women' }],
    },
    {
      id: 2,
      name: 'Flowy striped skirt',
      basePrice: 49.0,
      imageUrl: '/content/img/product/product-2.jpg',
      categories: [{ name: 'men' }],
    },
    {
      id: 3,
      name: 'Cotton T-Shirt',
      basePrice: 59.0,
      imageUrl: '/content/img/product/product-3.jpg',
      categories: [{ name: 'accessories' }],
    },
    {
      id: 4,
      name: 'Slim striped pocket shirt',
      basePrice: 59.0,
      imageUrl: '/content/img/product/product-4.jpg',
      categories: [{ name: 'cosmetic' }],
    },
    {
      id: 5,
      name: 'Fit micro corduroy shirt',
      basePrice: 59.0,
      imageUrl: '/content/img/product/product-5.jpg',
      categories: [{ name: 'kid' }],
    },
    {
      id: 6,
      name: 'Tropical Kimono',
      basePrice: 49.0,
      imageUrl: '/content/img/product/product-6.jpg',
      categories: [{ name: 'women' }],
      isSale: true,
      oldPrice: 59.0,
    },
    {
      id: 7,
      name: 'Contrasting sunglasses',
      basePrice: 59.0,
      imageUrl: '/content/img/product/product-7.jpg',
      categories: [{ name: 'accessories' }],
    },
    {
      id: 8,
      name: 'Water resistant backpack',
      basePrice: 49.0,
      imageUrl: '/content/img/product/product-8.jpg',
      categories: [{ name: 'accessories' }],
      isSale: true,
      oldPrice: 59.0,
    },
  ];

  // Sử dụng dữ liệu từ API hoặc fallback
  const displayProducts = products.length > 0 ? products : fallbackProducts;

  console.log('ProductSection - products:', products);
  console.log('ProductSection - displayProducts:', displayProducts);

  if (loading) {
    return (
      <section className="product spad">
        <div className="container">
          <ProductSectionHeader />
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
    <section className="product spad">
      <div className="container">
        <ProductSectionHeader />

        <div className="row property__gallery">
          {displayProducts.map((product, index) => {
            const categoryNames = product.categories?.map(cat => cat.name).join(' ') || 'general';
            const isSale = product.isSale || (product.oldPrice && product.oldPrice > product.basePrice);
            const label = isSale ? 'Sale' : undefined;

            return (
              <ProductItem
                key={product.id || index}
                title={product.name || 'Product'}
                price={`$${product.basePrice || 0}`}
                oldPrice={product.oldPrice ? `$${product.oldPrice}` : undefined}
                image={product.imageUrl || `/content/img/product/product-${index + 1}.jpg`}
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

export default ProductSection;
