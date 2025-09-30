import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import CategoryItem from './category-item';

const CategorySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.entities);
  const loading = useAppSelector(state => state.category.loading);

  useEffect(() => {
    dispatch(getCategories({ page: 0, size: 10, sort: 'id,asc' }));
  }, [dispatch]);

  // Fallback data nếu chưa có dữ liệu từ API
  const fallbackCategories = [
    {
      id: 1,
      name: "Women's fashion",
      image: 'content/img/categories/category-1.jpg',
      productCount: 358,
      isLarge: true,
    },
    {
      id: 2,
      name: "Men's fashion",
      image: 'content/img/categories/category-2.jpg',
      productCount: 100,
      isLarge: false,
    },
    {
      id: 3,
      name: "Kid's fashion",
      image: 'content/img/categories/category-3.jpg',
      productCount: 120,
      isLarge: false,
    },
    {
      id: 4,
      name: 'Cosmetics',
      image: 'content/img/categories/category-4.jpg',
      productCount: 80,
      isLarge: false,
    },
    {
      id: 5,
      name: 'Accessories',
      image: 'content/img/categories/category-5.jpg',
      productCount: 95,
      isLarge: false,
    },
  ];

  // Sử dụng dữ liệu từ API hoặc fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;
  const mainCategory = displayCategories[0];
  const subCategories = displayCategories.slice(1, 5);

  if (loading) {
    return (
      <section className="categories">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories">
      <div className="container-fluid">
        <div className="row">
          {/* Cột trái - Category chính */}
          <div className="col-lg-6 p-0">
            {mainCategory && (
              <CategoryItem
                title={mainCategory.name}
                items={mainCategory.productCount || 0}
                image={mainCategory.image || 'content/img/categories/category-1.jpg'}
                description="Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore magna aliquapendisse ultrices gravida."
                link={`/shop?category=${mainCategory.id}`}
                isLarge={true}
              />
            )}
          </div>

          {/* Cột phải - Sub categories */}
          <div className="col-lg-6">
            <div className="row">
              {subCategories.map((category, index) => (
                <div key={category.id} className="col-lg-6 col-md-6 p-0">
                  <CategoryItem
                    title={category.name}
                    items={category.productCount || 0}
                    image={category.image || `content/img/categories/category-${index + 2}.jpg`}
                    link={`/shop?category=${category.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
