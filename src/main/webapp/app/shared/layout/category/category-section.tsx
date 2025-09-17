import React from 'react';
import CategoryItem from './category-item';

const CategorySection: React.FC = () => {
  return (
    <section className="categories">
      <div className="container-fluid">
        <div className="row">
          {/* Cột trái */}
          <div className="col-lg-6 p-0">
            <CategoryItem
              title="Women’s fashion"
              items={358}
              image="content/img/categories/category-1.jpg"
              description="Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore magna aliquapendisse ultrices gravida."
              link="#"
              isLarge={true}
            />
          </div>

          {/* Cột phải */}
          <div className="col-lg-6">
            <div className="row">
              <div className="col-lg-6 col-md-6 p-0">
                <CategoryItem title="Men’s fashion" items={100} image="content/img/categories/category-2.jpg" link="#" />
              </div>
              <div className="col-lg-6 col-md-6 p-0">
                <CategoryItem title="Kid’s fashion" items={120} image="content/img/categories/category-3.jpg" link="#" />
              </div>
              <div className="col-lg-6 col-md-6 p-0">
                <CategoryItem title="Cosmetics" items={80} image="content/img/categories/category-4.jpg" link="#" />
              </div>
              <div className="col-lg-6 col-md-6 p-0">
                <CategoryItem title="Accessories" items={95} image="content/img/categories/category-5.jpg" link="#" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
