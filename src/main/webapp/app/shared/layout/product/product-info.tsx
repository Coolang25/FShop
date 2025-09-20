import React from 'react';
import { Col, Button, Form } from 'react-bootstrap';

const ProductInfo: React.FC = () => {
  return (
    <Col lg={6}>
      <div className="product__details__text">
        <h3>
          Essential structured blazer <span>Brand: SKMEIMore Men Watches from SKMEI</span>
        </h3>
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fa fa-star"></i>
          ))}
          <span>( 138 reviews )</span>
        </div>
        <div className="product__details__price">
          $ 75.0 <span>$ 83.0</span>
        </div>
        <p>
          Nemo enim ipsam voluptatem quia aspernatur aut odit aut loret fugit, sed quia consequuntur magni lores eos qui ratione voluptatem
          sequi nesciunt.
        </p>

        <div className="product__details__button">
          <div className="quantity">
            <span>Quantity:</span>
            <div className="pro-qty">
              <Form.Control type="text" defaultValue="1" />
            </div>
          </div>
          <Button className="cart-btn">
            <span className="icon_bag_alt"></span> Add to cart
          </Button>
          <ul>
            <li>
              <a href="#">
                <span className="icon_heart_alt"></span>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="icon_adjust-horiz"></span>
              </a>
            </li>
          </ul>
        </div>

        <div className="product__details__widget">
          <ul>
            <li>
              <span>Availability:</span>
              <div className="stock__checkbox">
                <Form.Check type="checkbox" id="stockin" label="In Stock" />
              </div>
            </li>
            <li>
              <span>Available color:</span>
              <div className="color__checkbox">
                <Form.Check type="radio" name="color__radio" id="red" defaultChecked />
                <Form.Check type="radio" name="color__radio" id="black" />
                <Form.Check type="radio" name="color__radio" id="grey" />
              </div>
            </li>
            <li>
              <span>Available size:</span>
              <div className="size__btn">
                {['xs', 's', 'm', 'l'].map(size => (
                  <label key={size} htmlFor={`${size}-btn`} className={size === 'xs' ? 'active' : ''}>
                    <input type="radio" id={`${size}-btn`} /> {size}
                  </label>
                ))}
              </div>
            </li>
            <li>
              <span>Promotions:</span>
              <p>Free shipping</p>
            </li>
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default ProductInfo;
