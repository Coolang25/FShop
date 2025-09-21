import './index.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Alert, Col, Row } from 'reactstrap';

import { useAppSelector } from 'app/config/store';
import CategorySection from 'app/shared/components/ecommerce/category/category-section';
import ProductSection from 'app/shared/components/ecommerce/product/product-section';
import BannerSlider from 'app/shared/components/layout/banner/banner-slider';
import TrendSection from 'app/shared/components/sections/trend/trend-section';
import ServicesSection from 'app/shared/components/sections/service/service-section';

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
