import React, { useState } from 'react';
import './SecondNavbar.css';

const SecondNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="second-navbar">
      <div className="second-navbar-container">
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="second-nav-links">
          <a href="/products" className="second-nav-link">Products</a>
          <a href="/categories" className="second-nav-link">Categories</a>
          <a href="/deals" className="second-nav-link">Deals</a>
          <a href="/about" className="second-nav-link">About</a>
          <a href="/contact" className="second-nav-link">Contact</a>
        </div>

        <div className="second-contact-info">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>+1 (555) 123-4567</span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h2 className="text-xl font-bold">Menu</h2>
          <button className="mobile-menu-close" onClick={closeMobileMenu}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mobile-nav-links">
          <a href="/products" className="second-nav-link" onClick={closeMobileMenu}>Products</a>
          <a href="/categories" className="second-nav-link" onClick={closeMobileMenu}>Categories</a>
          <a href="/deals" className="second-nav-link" onClick={closeMobileMenu}>Deals</a>
          <a href="/about" className="second-nav-link" onClick={closeMobileMenu}>About</a>
          <a href="/contact" className="second-nav-link" onClick={closeMobileMenu}>Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default SecondNavbar;