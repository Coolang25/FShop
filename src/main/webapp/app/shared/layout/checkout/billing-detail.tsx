import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const BillingDetails: React.FC = () => (
  <div>
    <h5>Billing detail</h5>
    <Row>
      <Col lg={6} md={6} sm={6}>
        <div className="checkout__form__input">
          <p>
            First Name <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
      </Col>
      <Col lg={6} md={6} sm={6}>
        <div className="checkout__form__input">
          <p>
            Last Name <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
      </Col>
      <Col lg={12}>
        <div className="checkout__form__input">
          <p>
            Country <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
        <div className="checkout__form__input">
          <p>
            Address <span>*</span>
          </p>
          <Form.Control type="text" placeholder="Street Address" />
          <Form.Control type="text" placeholder="Apartment. suite, unite etc (optional)" />
        </div>
        <div className="checkout__form__input">
          <p>
            Town/City <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
        <div className="checkout__form__input">
          <p>
            Country/State <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
        <div className="checkout__form__input">
          <p>
            Postcode/Zip <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
      </Col>
      <Col lg={6} md={6} sm={6}>
        <div className="checkout__form__input">
          <p>
            Phone <span>*</span>
          </p>
          <Form.Control type="text" />
        </div>
      </Col>
      <Col lg={6} md={6} sm={6}>
        <div className="checkout__form__input">
          <p>
            Email <span>*</span>
          </p>
          <Form.Control type="email" />
        </div>
      </Col>
      <Col lg={12}>
        <div className="checkout__form__checkbox">
          <Form.Check id="acc" type="checkbox" label="Create an account?" />
          <p>Create an account by entering the information below. If you are a returning customer login at the top of the page.</p>
        </div>
        <div className="checkout__form__input">
          <p>
            Account Password <span>*</span>
          </p>
          <Form.Control type="password" />
        </div>
        <div className="checkout__form__checkbox">
          <Form.Check id="note" type="checkbox" label="Note about your order, e.g, special note for delivery" />
        </div>
        <div className="checkout__form__input">
          <p>
            Order notes <span>*</span>
          </p>
          <Form.Control type="text" placeholder="Note about your order, e.g, special note for delivery" />
        </div>
      </Col>
    </Row>
  </div>
);

export default BillingDetails;
