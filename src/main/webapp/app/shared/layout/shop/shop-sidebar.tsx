import React from 'react';
import { Accordion } from 'react-bootstrap';
import PriceRangeFilter from '../price-range-filter';

const ShopSidebar: React.FC = () => {
  return (
    <div className="shop__sidebar">
      {/* Categories */}
      <div className="sidebar__categories">
        <div className="section-title">
          <h4>Categories</h4>
        </div>
        <div className="categories__accordion">
          <Accordion defaultActiveKey="0">
            {['Women', 'Men', 'Kids', 'Accessories', 'Cosmetic'].map((cat, i) => (
              <Accordion.Item eventKey={i.toString()} key={cat}>
                <Accordion.Header>{cat}</Accordion.Header>
                <Accordion.Body className="card-body">
                  <ul>
                    <li>
                      <a href="#">Coats</a>
                    </li>
                    <li>
                      <a href="#">Jackets</a>
                    </li>
                    <li>
                      <a href="#">Dresses</a>
                    </li>
                    <li>
                      <a href="#">Shirts</a>
                    </li>
                    <li>
                      <a href="#">T-shirts</a>
                    </li>
                    <li>
                      <a href="#">Jeans</a>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Price filter */}
      <div className="sidebar__filter">
        <div className="section-title">
          <h4>Shop by price</h4>
        </div>
        {/* <div className="filter-range-wrap">
          <div
            className="price-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content"
            data-min="33"
            data-max="99"
          />
          <div className="range-slider">
            <div className="price-input">
              <p>Price:</p>
              <input type="text" id="minamount" />
              <input type="text" id="maxamount" />
            </div>
          </div>
        </div>
        <a href="#">Filter</a> */}
        <PriceRangeFilter />
      </div>

      {/* Size filter */}
      <div className="sidebar__sizes">
        <div className="section-title">
          <h4>Shop by size</h4>
        </div>
        <div className="size__list">
          {['xxs', 'xs', 'xss', 's', 'm', 'ml', 'l', 'xl'].map(size => (
            <label key={size} htmlFor={size}>
              {size}
              <input type="checkbox" id={size} />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
      </div>

      {/* Color filter */}
      <div className="sidebar__color">
        <div className="section-title">
          <h4>Shop by color</h4>
        </div>
        <div className="size__list color__list">
          {['black', 'whites', 'reds', 'greys', 'blues', 'beige', 'greens', 'yellows'].map(color => (
            <label key={color} htmlFor={color}>
              {color}
              <input type="checkbox" id={color} />
              <span className="checkmark"></span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
