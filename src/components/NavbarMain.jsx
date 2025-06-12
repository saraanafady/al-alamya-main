import React from 'react';
import logo from '../assets/images/logo.png'; // Use your actual logo path
import './NavbarMain.css';
import { useTheme } from '../context/ThemeContext';

const NavbarMain = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (e) => {
    e.preventDefault();
    toggleTheme();
  };

  const Link = ({ to, children, className, ...props }) => (
    <a href={to} className={className} {...props}>{children}</a>
  );

  return (
    <div className="main-navbar-wrapper w-full">
      {/* Top Banner */}
      <div className="main-top-banner">
        <p>Midseason Sale: 20% Off • Auto Applied at Checkout • Limited Time Only.</p>
      </div>

      {/* Main Header */}
      <header className={`main-navbar-header ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="main-navbar-container">
          {/* Logo & Shop Now */}
          <div className="main-navbar-logo">
            <Link to="/" className="main-logo-link">
              <img src={logo} alt="Alamia Logo" className="w-24 h-10 object-contain" />
            </Link>
            <button className="main-shop-now-btn flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Shop Now
            </button>
          </div>

          {/* Search Bar */}
          <div className="main-search-bar">
            <input
              type="text"
              placeholder="What are you looking for ..."
              className="main-search-input"
            />
            <button className="main-search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Navigation & Actions */}
          <div className="main-navbar-actions">
            <nav className="main-nav-links">
              <Link to="/catalog" className="main-nav-link">Catalog</Link>
              <Link to="/journal" className="main-nav-link">Journal</Link>
              <Link to="/about" className="main-nav-link">About</Link>
            </nav>
            <div className="main-dark-mode-toggle">
              <span>Dark Mode</span>
              <label className="main-switch">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={handleThemeToggle}
                  className="sr-only"
                  aria-label="Toggle dark mode"
                />
                <span className="main-slider">
                  <span className={`main-slider-dot${theme === 'dark' ? ' dark' : ''}`}></span>
                </span>
              </label>
            </div>
            <div className="main-language-selector">
              <button>AR</button>
              <span className="text-gray-400">|</span>
              <button className="main-lang-active">EN</button>
            </div>
            <button className="main-cart-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span>0</span>
            </button>
            <button className="login-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavbarMain;