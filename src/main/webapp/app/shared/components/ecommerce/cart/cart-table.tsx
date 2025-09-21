import React from 'react';
import { Table } from 'react-bootstrap';

const CartTable: React.FC = () => {
  return (
    <div className="shop__cart__table">
      <Table responsive bordered={false} className="mb-0">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              img: 'content/img/shop-cart/cp-1.jpg',
              title: 'Chain bucket bag',
              price: 150,
              total: 300,
            },
            {
              img: 'content/img/shop-cart/cp-2.jpg',
              title: 'Zip-pockets pebbled tote briefcase',
              price: 170,
              total: 170,
            },
            {
              img: 'content/img/shop-cart/cp-3.jpg',
              title: 'Black jean',
              price: 85,
              total: 170,
            },
            {
              img: 'content/img/shop-cart/cp-4.jpg',
              title: 'Cotton Shirt',
              price: 55,
              total: 110,
            },
          ].map((item, idx) => (
            <tr key={idx}>
              <td className="cart__product__item">
                <img src={item.img} alt={item.title} />
                <div className="cart__product__item__title">
                  <h6>{item.title}</h6>
                  <div className="rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                </div>
              </td>
              <td className="cart__price">${item.price}.0</td>
              <td className="cart__quantity">
                <div className="pro-qty">
                  <input type="text" defaultValue="1" />
                </div>
              </td>
              <td className="cart__total">${item.total}.0</td>
              <td className="cart__close">
                <span className="icon_close"></span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CartTable;
