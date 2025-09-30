import React, { useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import PriceRangeFilter from '../../ui/price-range-filter';

const ShopSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.entities);
  const loading = useAppSelector(state => state.category.loading);

  useEffect(() => {
    dispatch(getCategories({ page: 0, size: 20, sort: 'id,asc' }));
  }, [dispatch]);

  // Fallback categories nếu chưa có dữ liệu từ API
  const fallbackCategories = [
    { id: 1, name: 'Women', subCategories: ['Coats', 'Jackets', 'Dresses', 'Shirts', 'T-shirts', 'Jeans'] },
    { id: 2, name: 'Men', subCategories: ['Coats', 'Jackets', 'Shirts', 'T-shirts', 'Jeans', 'Suits'] },
    { id: 3, name: 'Kids', subCategories: ['Coats', 'Jackets', 'Dresses', 'Shirts', 'T-shirts', 'Jeans'] },
    { id: 4, name: 'Accessories', subCategories: ['Bags', 'Shoes', 'Jewelry', 'Watches', 'Belts', 'Hats'] },
    { id: 5, name: 'Cosmetic', subCategories: ['Makeup', 'Skincare', 'Hair Care', 'Fragrance', 'Tools', 'Bath & Body'] },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="shop__sidebar">
      {/* Categories */}
      <div className="sidebar__categories">
        <div className="section-title">
          <h4>Categories</h4>
        </div>
        <div className="categories__accordion">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Accordion defaultActiveKey="0">
              {displayCategories.map((category, i) => (
                <Accordion.Item eventKey={i.toString()} key={category.id}>
                  <Accordion.Header>{category.name}</Accordion.Header>
                  <Accordion.Body className="card-body">
                    <ul>
                      {category.subCategories?.map((subCat, subIndex) => (
                        <li key={subIndex}>
                          <a href={`/shop?category=${category.id}&subcategory=${subCat}`}>{subCat}</a>
                        </li>
                      )) || (
                        // Fallback subcategories nếu không có dữ liệu
                        <>
                          <li>
                            <a href={`/shop?category=${category.id}`}>All {category.name}</a>
                          </li>
                          <li>
                            <a href={`/shop?category=${category.id}`}>New Arrivals</a>
                          </li>
                          <li>
                            <a href={`/shop?category=${category.id}`}>Best Sellers</a>
                          </li>
                        </>
                      )}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
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
