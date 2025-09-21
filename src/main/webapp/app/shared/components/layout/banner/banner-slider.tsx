import React from 'react';
import { Carousel } from 'react-bootstrap';

interface BannerItem {
  subtitle: string;
  title: string;
  link: string;
  background: string;
}

const BannerSlider: React.FC = () => {
  const bannerData: BannerItem[] = [
    {
      subtitle: 'The Chloe Collection',
      title: 'The Project Jacket',
      link: '#',
      background: 'content/img/banner/banner-1.jpg',
    },
    {
      subtitle: 'New Arrivals',
      title: 'Summer 2025',
      link: '#',
      background: 'content/img/banner/banner-2.jpg',
    },
    {
      subtitle: 'Limited Edition',
      title: 'Autumn Trends',
      link: '#',
      background: 'content/img/banner/banner-3.jpg',
    },
  ];

  return (
    <section className="banner">
      <Carousel interval={3000} pause="hover">
        {bannerData.map((item, index) => (
          <Carousel.Item key={index} className="banner__item">
            <img src={item.background} alt={item.title} style={{ height: '500px', objectFit: 'cover' }} />
            <Carousel.Caption className="banner__text" style={{ top: '150px' }}>
              <span>{item.subtitle}</span>
              <h1>{item.title}</h1>
              <a href={item.link}>Shop now</a>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default BannerSlider;
