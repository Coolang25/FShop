import React from 'react';
import ProductSectionHeader from './product-section-header';
import ProductItem from './product-item';

const ProductSection: React.FC = () => {
  return (
    <section className="product spad">
      <div className="container">
        <ProductSectionHeader />

        <div className="row property__gallery">
          <ProductItem title="Buttons tweed blazer" price="$59.0" image="content/img/product/product-1.jpg" categories="women" />
          <ProductItem title="Flowy striped skirt" price="$49.0" image="content/img/product/product-2.jpg" categories="men" />
          <ProductItem title="Cotton T-Shirt" price="$59.0" image="content/img/product/product-3.jpg" categories="accessories" />
          <ProductItem title="Slim striped pocket shirt" price="$59.0" image="content/img/product/product-4.jpg" categories="cosmetic" />
          <ProductItem title="Fit micro corduroy shirt" price="$59.0" image="content/img/product/product-5.jpg" categories="kid" />
          <ProductItem
            title="Tropical Kimono"
            price="$49.0"
            oldPrice="$59.0"
            image="content/img/product/product-6.jpg"
            categories="women men kid accessories cosmetic"
            isSale
          />
          <ProductItem
            title="Contrasting sunglasses"
            price="$59.0"
            image="content/img/product/product-7.jpg"
            categories="women men kid accessories cosmetic"
          />
          <ProductItem
            title="Water resistant backpack"
            price="$49.0"
            oldPrice="$59.0"
            image="content/img/product/product-8.jpg"
            categories="women men kid accessories cosmetic"
            isSale
          />
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
