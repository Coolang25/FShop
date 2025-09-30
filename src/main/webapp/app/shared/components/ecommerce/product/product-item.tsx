import React from 'react';

interface ProductItemProps {
  title: string;
  price: string;
  image: string;
  categories: string;
  isSale?: boolean;
  oldPrice?: string;
  label?: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ title, price, oldPrice, image, categories, isSale, label }) => {
  return (
    <div className={`col-lg-3 col-md-4 col-sm-6 mix ${categories}`}>
      <div className={`product__item ${isSale ? 'sale' : ''}`}>
        <div className="product__item__pic set-bg" style={{ backgroundImage: `url(${image})` }}>
          {(label || isSale) && <div className={`label ${(label || 'sale').toLowerCase()}`}>{label || 'Sale'}</div>}
          <ul className="product__hover">
            <li>
              <a href={image} className="image-popup">
                <span className="arrow_expand"></span>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="icon_heart_alt"></span>
              </a>
            </li>
            <li>
              <a href="#">
                <span className="icon_bag_alt"></span>
              </a>
            </li>
          </ul>
        </div>
        <div className="product__item__text">
          <h6>
            <a href="#">{title}</a>
          </h6>
          <div className="rating">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
          </div>
          <div className="product__price">
            {price} {oldPrice && <span>{oldPrice}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
