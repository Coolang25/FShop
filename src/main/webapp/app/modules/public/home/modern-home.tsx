import React from 'react';
import { useAppSelector } from 'app/config/store';
import HeroSection from 'app/shared/components/layout/hero/hero-section';
import FeaturedCategories from 'app/shared/components/ecommerce/category/featured-categories';
import ProductShowcase from 'app/shared/components/ecommerce/product/product-showcase';
import TestimonialsSection from 'app/shared/components/sections/testimonials/testimonials-section';
import NewsletterSection from 'app/shared/components/sections/newsletter/newsletter-section';

export const ModernHome = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default ModernHome;
