import category from 'app/entities/category/category.reducer';
import product from 'app/entities/product/product.reducer';
import productImage from 'app/entities/product-image/product-image.reducer';
import productAttribute from 'app/entities/product-attribute/product-attribute.reducer';
import productAttributeValue from 'app/entities/product-attribute-value/product-attribute-value.reducer';
import productVariant from 'app/entities/product-variant/product-variant.reducer';
import variantAttributeValue from 'app/entities/variant-attribute-value/variant-attribute-value.reducer';
import productReview from 'app/entities/product-review/product-review.reducer';
import cart from 'app/entities/cart/cart.reducer';
import cartItem from 'app/entities/cart-item/cart-item.reducer';
import shopOrder from 'app/entities/shop-order/shop-order.reducer';
import orderItem from 'app/entities/order-item/order-item.reducer';
import payment from 'app/entities/payment/payment.reducer';
import chatbotLog from 'app/entities/chatbot-log/chatbot-log.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  category,
  product,
  productImage,
  productAttribute,
  productAttributeValue,
  productVariant,
  variantAttributeValue,
  productReview,
  cart,
  cartItem,
  shopOrder,
  orderItem,
  payment,
  chatbotLog,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
