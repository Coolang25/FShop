import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/category">
        <Translate contentKey="global.menu.entities.category" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product">
        <Translate contentKey="global.menu.entities.product" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product-image">
        <Translate contentKey="global.menu.entities.productImage" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product-attribute">
        <Translate contentKey="global.menu.entities.productAttribute" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product-attribute-value">
        <Translate contentKey="global.menu.entities.productAttributeValue" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product-variant">
        <Translate contentKey="global.menu.entities.productVariant" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/variant-attribute-value">
        <Translate contentKey="global.menu.entities.variantAttributeValue" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product-review">
        <Translate contentKey="global.menu.entities.productReview" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/cart">
        <Translate contentKey="global.menu.entities.cart" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/cart-item">
        <Translate contentKey="global.menu.entities.cartItem" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/shop-order">
        <Translate contentKey="global.menu.entities.shopOrder" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/order-item">
        <Translate contentKey="global.menu.entities.orderItem" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/payment">
        <Translate contentKey="global.menu.entities.payment" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/chatbot-log">
        <Translate contentKey="global.menu.entities.chatbotLog" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
