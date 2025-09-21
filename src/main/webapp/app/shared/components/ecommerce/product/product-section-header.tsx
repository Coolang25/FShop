import React from 'react';

const ProductSectionHeader: React.FC = () => {
  return (
    <div className="row">
      <div className="col-lg-4 col-md-4">
        <div className="section-title">
          <h4>New product</h4>
        </div>
      </div>
      <div className="col-lg-8 col-md-8">
        <ul className="filter__controls">
          <li className="active" data-filter="*">
            All
          </li>
          <li data-filter=".women">Women’s</li>
          <li data-filter=".men">Men’s</li>
          <li data-filter=".kid">Kid’s</li>
          <li data-filter=".accessories">Accessories</li>
          <li data-filter=".cosmetic">Cosmetics</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductSectionHeader;
