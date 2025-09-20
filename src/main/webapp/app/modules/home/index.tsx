import './index.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Alert, Col, Row } from 'reactstrap';

import { useAppSelector } from 'app/config/store';
import CategorySection from 'app/shared/layout/category/category-section';
import ProductSection from 'app/shared/layout/product/product-section';
import BannerSlider from 'app/shared/layout/banner/banner-slider';
import TrendSection from 'app/shared/layout/trend/trend-section';
import ServicesSection from 'app/shared/layout/service/service-section';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div>
      <CategorySection />
      <ProductSection />
      <BannerSlider />
      <TrendSection />
      <ServicesSection />
    </div>
  );
};

export default Home;
