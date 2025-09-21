import React from 'react';
import { Form, Button } from 'react-bootstrap';

const OrderSummary: React.FC = () => (
  <div className="checkout__order">
    <h5>Your order</h5>
    <div className="checkout__order__product">
      <ul>
        <li>
          <span className="top__text">Product</span>
          <span className="top__text__right">Total</span>
        </li>
        <li>
          01. Chain buck bag <span>$ 300.0</span>
        </li>
        <li>
          02. Zip-pockets pebbled tote briefcase <span>$ 170.0</span>
        </li>
        <li>
          03. Black jean <span>$ 170.0</span>
        </li>
        <li>
          04. Cotton shirt <span>$ 110.0</span>
        </li>
      </ul>
    </div>
    <div className="checkout__order__total">
      <ul>
        <li>
          Subtotal <span>$ 750.0</span>
        </li>
        <li>
          Total <span>$ 750.0</span>
        </li>
      </ul>
    </div>
    <div className="checkout__order__widget">
      <Form.Check id="o-acc" type="checkbox" label="Create an account?" />
      <p>Create an account by entering the information below. If you are a returning customer login at the top of the page.</p>
      <Form.Check id="check-payment" type="checkbox" label="Cheque payment" />
      <Form.Check id="paypal" type="checkbox" label="PayPal" />
    </div>
    <Button type="submit" className="site-btn">
      Place order
    </Button>
  </div>
);

export default OrderSummary;
