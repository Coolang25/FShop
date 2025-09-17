import React from 'react';

interface CategoryItemProps {
  title: string;
  items: number;
  image: string;
  link: string;
  description?: string;
  isLarge?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ title, items, image, link, description, isLarge = false }) => {
  return (
    <div className={`categories__item set-bg ${isLarge ? 'categories__large__item' : ''}`} style={{ backgroundImage: `url(${image})` }}>
      <div className="categories__text">
        {isLarge ? <h1>{title}</h1> : <h4>{title}</h4>}
        {!isLarge && <p>{items} items</p>}
        <p>{description}</p>
        <a href={link}>Shop now</a>
      </div>
    </div>
  );
};

export default CategoryItem;
