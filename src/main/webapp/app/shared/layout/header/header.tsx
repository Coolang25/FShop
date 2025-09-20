import './header.scss';

import React, { useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
// import { Collapse, Nav, Navbar, NavbarToggler } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { AccountMenu, AdminMenu, EntitiesMenu, LocaleMenu } from '../menus';
import { Brand, Home } from './header-components';
import { Container, Row, Col } from 'react-bootstrap';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
}

export interface IMenuProps {
  isMobile: boolean;
}

const Menu: React.FC<IMenuProps> = ({ isMobile }) => (
  <nav className={isMobile ? 'slicknav_nav slicknav_hidden' : 'header__menu'}>
    <ul>
      <li className="active">
        <a href="/">Home</a>
      </li>
      <li>
        <a href="#">Women’s</a>
      </li>
      <li>
        <a href="#">Men’s</a>
      </li>
      <li>
        <a href="/shop">Shop</a>
      </li>
      <li>
        <a href="#">Pages</a>
        <ul className="dropdown">
          <li>
            <a href="/product-details">Product Details</a>
          </li>
          <li>
            <a href="/shop-cart">Shop Cart</a>
          </li>
          <li>
            <a href="/checkout">Checkout</a>
          </li>
          <li>
            <a href="/blog-details">Blog Details</a>
          </li>
        </ul>
      </li>
      <li>
        <a href="/blog">Blog</a>
      </li>
      <li>
        <a href="/contact">Contact</a>
      </li>
    </ul>
  </nav>
);

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const toggleMenu = () => {
    console.log('Toggle menu', menuOpen);
    setMenuOpen(pre => !pre);
  };

  const renderMobileMenu = () => (
    <>
      <div className={`offcanvas-menu-overlay ${menuOpen ? 'active' : ''}`} />
      <div className={`offcanvas-menu-wrapper ${menuOpen ? 'active' : ''}`}>
        <div className="offcanvas__close" onClick={toggleMenu}>
          +
        </div>
        <ul className="offcanvas__widget">
          <li>
            <span className="icon_search search-switch" />
          </li>
          <li>
            <a href="#">
              <span className="icon_heart_alt" />
              <div className="tip">2</div>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon_bag_alt" />
              <div className="tip">2</div>
            </a>
          </li>
        </ul>
        <div className="offcanvas__logo">
          <a href="./index.html">
            <img src="content/img/logo.png" alt="" />
          </a>
        </div>
        <div id="mobile-menu-wrap" className="slicknav_menu">
          <Menu isMobile={true} />
        </div>
        <div className="offcanvas__auth">
          <a href="#">Login</a>
          <a href="#">Register</a>
        </div>
      </div>
    </>
  );

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  // return (
  //   <div id="app-header">
  //     {renderDevRibbon()}
  //     <LoadingBar className="loading-bar" />
  //     <Navbar data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
  //       <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
  //       <Brand />
  //       <Collapse isOpen={menuOpen} navbar>
  //         <Nav id="header-tabs" className="ms-auto" navbar>
  //           <Home />
  //           {props.isAuthenticated && <EntitiesMenu />}
  //           {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
  //           <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
  //           <AccountMenu isAuthenticated={props.isAuthenticated} />
  //         </Nav>
  //       </Collapse>
  //     </Navbar>
  //   </div>
  // );

  return (
    <>
      {renderMobileMenu()}
      <header className="header">
        <Container fluid>
          <Row>
            <Col xl={3} lg={2}>
              <div className="header__logo">
                <a href="/">
                  <img src="content/img/logo.png" alt="Logo" />
                </a>
              </div>
            </Col>
            <Col xl={6} lg={7}>
              <Menu isMobile={false} />
            </Col>
            <Col lg={3}>
              <div className="header__right">
                <div className="header__right__auth">
                  <a href="#">Login</a>
                  <a href="#">Register</a>
                </div>
                <ul className="header__right__widget">
                  <li>
                    <span className="icon_search search-switch" />
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon_heart_alt" />
                      <div className="tip">2</div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="icon_bag_alt" />
                      <div className="tip">2</div>
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="canvas__open" onClick={toggleMenu}>
            <i className="fa fa-bars" />
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;
