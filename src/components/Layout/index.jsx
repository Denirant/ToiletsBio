import React, { useState, useEffect, useCallback } from 'react';
import pageLogo from '../../assets/logo.png';
import pageLogoBlack from '../../assets/logo_black.png'

import './PageLayout.css';

import MainBlock from '../MainScreen';

function PageLayout() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const menuItems = ['Главная', 'О нас', 'Связаться', 'Контакты', 'Подвал'];
 
  const menu = menuItems.map((item, index) => (
      <div
        key={index}
        className={`menu-item ${index === currentPage ? 'active' : ''}`}
        onClick={() => {
          if (index !== currentPage) {
            setCurrentPage(index);
            setIsTransitioning(true);
            setTimeout(() => {
              setIsTransitioning(false);
            }, 2000);
            setIsScrolling(true);
            setTimeout(() => {
              setIsScrolling(false);
            }, 300);
          }
        }}
      >
        {item}
      </div>
  ));

  return (
    <div className="page-layout">
      <div className='page-header'>
        <div className="logo">
          <img className='logo-image' src={pageLogoBlack} alt="log" />
          <p className='logo-text'><span>Bio</span>Cabines</p>
        </div>
        <div className="menu">{menu}</div>
      </div>
      <div className={`blocks ${isTransitioning ? 'transitioning' : ''}`} style={{ transform: `translateY(-${currentPage * 100}vh)` }}>
        
      </div>
    </div>
  );
}

export default PageLayout;
