import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.png';
import './NavbarMain.css';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import SearchDropdown from './SearchDropdown';

const NavbarMain = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { getCartCount } = useCart();
  const { searchQuery, setSearchQuery, performSearch } = useSearch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isMobileSearchDropdownOpen, setIsMobileSearchDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchDropdownOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  // Search functionality
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchDropdownOpen(false);
    }
  };

  const handleMobileSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setIsMobileSearchDropdownOpen(true);
    } else {
      setIsMobileSearchDropdownOpen(false);
    }
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchDropdownOpen(false);
      closeMobileMenu();
    }
  };

  const handleSearchFocus = () => {
    setIsSearchDropdownOpen(true);
  };

  const handleSearchBlur = (e) => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setIsSearchDropdownOpen(false);
      }
    }, 200);
  };

  const handleMobileSearchFocus = () => {
    setIsMobileSearchDropdownOpen(true);
  };

  const handleMobileSearchBlur = (e) => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      if (!mobileSearchRef.current?.contains(document.activeElement)) {
        setIsMobileSearchDropdownOpen(false);
      }
    }, 200);
  };

  const closeSearchDropdown = () => {
    setIsSearchDropdownOpen(false);
  };

  const closeMobileSearchDropdown = () => {
    setIsMobileSearchDropdownOpen(false);
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsMobileSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top Banner */}
      <div className="top-banner">
        <p>{t('header.topBanner')}</p>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="navbar-container">
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Alamia" />
          </div>

          {/* Search Bar */}
          <div className="search-container" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder={t('header.searchPlaceholder')}
                className="search-input"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <button type="submit" className="search-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            </form>
            <SearchDropdown 
              isOpen={isSearchDropdownOpen} 
              onClose={closeSearchDropdown}
            />
          </div>

          {/* Desktop Actions */}
          <div className="desktop-actions">
            <a href="/catalog">{t('navigation.catalog')}</a>
            <a href="/journal">{t('navigation.journal')}</a>
            <a href="/about">{t('navigation.about')}</a>
            
            <div className="theme-toggle">
              <span>{t('header.darkMode')}</span>
              <button 
                className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                onClick={handleThemeToggle}
                aria-label="Toggle dark mode"
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            <div className="language-switcher">
              <span 
                className={`lang-option ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('en')}
                style={{
                  color: i18n.language === 'en' ? '#ff7d1a' : '#666',
                  cursor: 'pointer',
                  padding: '10px',
                  fontWeight: i18n.language === 'en' ? '600' : '500',
                  fontSize: '0.875rem',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ff7d1a'}
                onMouseLeave={(e) => e.target.style.color = i18n.language === 'en' ? '#ff7d1a' : '#666'}
              >
                EN
              </span>
              <span className="lang-separator" style={{ color: '#d1d5db', margin: '0 0.5rem' }}>|</span>
              <span 
                className={`lang-option ${i18n.language === 'ar' ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage('ar')}
                style={{
                  color: i18n.language === 'ar' ? '#ff7d1a' : '#666',
                  cursor: 'pointer',
                  padding: '10px',
                  fontWeight: i18n.language === 'ar' ? '600' : '500',
                  fontSize: '0.875rem',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ff7d1a'}
                onMouseLeave={(e) => e.target.style.color = i18n.language === 'ar' ? '#ff7d1a' : '#666'}
              >
                AR
              </span>
            </div>

            <button className="cart-button" onClick={() => navigate('/cart')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
              </svg>
              <span className="cart-count" data-count={getCartCount() || 5}>{getCartCount() || 5}</span>
            </button>

            <button className="user-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img 
            src={logo} 
            alt="Alamia" 
            className="mobile-logo" 
            onClick={() => { navigate('/'); closeMobileMenu(); }}
            style={{ cursor: 'pointer' }}
          />
          <button 
            className="mobile-close-button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mobile-menu-content">
          {/* Mobile Search */}
          <div className="mobile-search" ref={mobileSearchRef}>
            <form onSubmit={handleMobileSearchSubmit}>
              <input 
                type="text" 
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={handleMobileSearchChange}
                onFocus={handleMobileSearchFocus}
                onBlur={handleMobileSearchBlur}
              />
              <button type="submit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            </form>
            <SearchDropdown 
              isOpen={isMobileSearchDropdownOpen} 
              onClose={closeMobileSearchDropdown}
            />
          </div>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-section">
            <h3>Shop</h3>
            <a href="/phones" onClick={closeMobileMenu}>{t('navigation.phones')}</a>
            <a href="/laptops" onClick={closeMobileMenu}>{t('navigation.laptops')}</a>
            <a href="/headphones" onClick={closeMobileMenu}>{t('navigation.headphones')}</a>
            <a href="/speakers" onClick={closeMobileMenu}>{t('navigation.speakers')}</a>
            <a href="/smartwatches" onClick={closeMobileMenu}>{t('navigation.smartwatches')}</a>
            <a href="/gaming" onClick={closeMobileMenu}>{t('navigation.gaming')}</a>
            <a href="/features" onClick={closeMobileMenu}>{t('navigation.features')}</a>
          </div>

          <div className="mobile-nav-section">
            <h3>Explore</h3>
            <a href="/catalog" onClick={closeMobileMenu}>{t('navigation.catalog')}</a>
            <a href="/journal" onClick={closeMobileMenu}>{t('navigation.journal')}</a>
            <a href="/about" onClick={closeMobileMenu}>{t('navigation.about')}</a>
          </div>

          {/* Mobile Settings */}
          <div className="mobile-settings">
            <div className="mobile-theme-toggle">
              <span>{t('header.darkMode')}</span>
              <button 
                className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                onClick={handleThemeToggle}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            <div className="mobile-language">
              <span>{t('header.language')}</span>
              <div className="mobile-language-switcher">
                <span 
                  className={`mobile-lang-option ${i18n.language === 'en' ? 'active' : ''}`}
                  onClick={() => i18n.changeLanguage('en')}
                >
                  EN
                </span>
                <span className="mobile-lang-separator">|</span>
                <span 
                  className={`mobile-lang-option ${i18n.language === 'ar' ? 'active' : ''}`}
                  onClick={() => i18n.changeLanguage('ar')}
                >
                  AR
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            <button className="mobile-cart" onClick={() => { navigate('/cart'); closeMobileMenu(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
              </svg>
              <span>{t('header.cart')} <span className="mobile-cart-count">({getCartCount()})</span></span>
            </button>

            <button className="mobile-account" onClick={closeMobileMenu}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>My Account</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="mobile-contact">
            <p>Need help? Call us</p>
            <a href="tel:+84250088833">+84 2500 888 33</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMain;