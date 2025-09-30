import React from 'react';
import ModernHeader from './header/modern-header';
import ModernFooter from './footer/modern-footer';

interface ModernLayoutProps {
  children: React.ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="modern-layout">
      <ModernHeader />
      <main className="main-content">{children}</main>
      <ModernFooter />
    </div>
  );
};

export default ModernLayout;
