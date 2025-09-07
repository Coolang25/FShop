import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Category from './category';
import Product from './product';
import ProductImage from './product-image';
import ProductAttribute from './product-attribute';
import ProductAttributeValue from './product-attribute-value';
import ProductVariant from './product-variant';
import VariantAttributeValue from './variant-attribute-value';
import ProductReview from './product-review';
import Cart from './cart';
import CartItem from './cart-item';
import ShopOrder from './shop-order';
import OrderItem from './order-item';
import Payment from './payment';
import ChatbotLog from './chatbot-log';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="category/*" element={<Category />} />
        <Route path="product/*" element={<Product />} />
        <Route path="product-image/*" element={<ProductImage />} />
        <Route path="product-attribute/*" element={<ProductAttribute />} />
        <Route path="product-attribute-value/*" element={<ProductAttributeValue />} />
        <Route path="product-variant/*" element={<ProductVariant />} />
        <Route path="variant-attribute-value/*" element={<VariantAttributeValue />} />
        <Route path="product-review/*" element={<ProductReview />} />
        <Route path="cart/*" element={<Cart />} />
        <Route path="cart-item/*" element={<CartItem />} />
        <Route path="shop-order/*" element={<ShopOrder />} />
        <Route path="order-item/*" element={<OrderItem />} />
        <Route path="payment/*" element={<Payment />} />
        <Route path="chatbot-log/*" element={<ChatbotLog />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
