import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import SearchDropdown from '../SearchDropdown/SearchDropdown';

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
  const isRTL = i18n.language === 'ar';

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.setAttribute('lang', lng);
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
    closeMobileMenu();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      navigate('/search');
      setIsSearchDropdownOpen(false);
      setIsMobileSearchDropdownOpen(false);
      closeMobileMenu();
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearchDropdownOpen(value.length > 0);
  };

  const handleMobileSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsMobileSearchDropdownOpen(value.length > 0);
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

  const cartCount = getCartCount();

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-3 px-4 text-sm font-semibold tracking-wide">
        <p className="m-0 drop-shadow-sm">{t('navbar.topBanner')}</p>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 w-full shadow-[0_2px_8px_rgba(37,99,235,0.1)]">
        <div className={`max-w-[1400px] mx-auto px-4 flex items-center justify-between h-[75px] gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="h-11 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer p-0 z-[101]"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="w-6 h-0.5 bg-slate-900 dark:bg-white rounded-sm transition-all duration-300 origin-[1px] hover:bg-blue-600"></span>
            <span className="w-6 h-0.5 bg-slate-900 dark:bg-white rounded-sm transition-all duration-300 origin-[1px] hover:bg-blue-600"></span>
            <span className="w-6 h-0.5 bg-slate-900 dark:bg-white rounded-sm transition-all duration-300 origin-[1px] hover:bg-blue-600"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-10 items-center">
            <a 
              href="/" 
              className="text-slate-900 dark:text-white no-underline font-semibold text-base transition-all duration-300 py-3 relative hover:text-blue-600 hover:-translate-y-0.5"
            >
              {t('navigation.home')}
            </a>
            <a 
              href="/products" 
              className="text-slate-900 dark:text-white no-underline font-semibold text-base transition-all duration-300 py-3 relative hover:text-blue-600 hover:-translate-y-0.5"
            >
              {t('navigation.products')}
            </a>
            <a 
              href="/categories" 
              className="text-slate-900 dark:text-white no-underline font-semibold text-base transition-all duration-300 py-3 relative hover:text-blue-600 hover:-translate-y-0.5"
            >
              {t('navigation.categories')}
            </a>
            <a 
              href="/about" 
              className="text-slate-900 dark:text-white no-underline font-semibold text-base transition-all duration-300 py-3 relative hover:text-blue-600 hover:-translate-y-0.5"
            >
              {t('navigation.about')}
            </a>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder={t('navbar.searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full py-3 px-4 pr-12 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-base bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                dir="ltr"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            {/* Desktop Search Dropdown */}
            {isSearchDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <SearchDropdown 
                  onClose={() => setIsSearchDropdownOpen(false)}
                  onSearchSelect={(query) => {
                    setSearchQuery(query);
                    setIsSearchDropdownOpen(false);
                    performSearch(query);
                    navigate('/search');
                  }}
                />
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className={`hidden lg:flex gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="relative bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-900 dark:text-white hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-900 dark:text-white hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600"
                aria-label="Switch language"
              >
                <span className="text-sm font-medium">{i18n.language === 'en' ? 'العربية' : 'EN'}</span>
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className="relative bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-900 dark:text-white hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600 flex items-center justify-center"
              aria-label="Shopping cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white leading-none p-0 m-0 box-border">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Button */}
            <button
              className="relative bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors duration-200 text-slate-900 dark:text-white hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600 flex items-center justify-center"
              aria-label="User account"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[998] opacity-100 animate-[fadeIn_0.3s_ease]"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu */}
        <div className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} w-full max-w-sm h-screen bg-white dark:bg-slate-800 z-[999] transform transition-transform duration-300 overflow-y-auto shadow-[2px_0_10px_rgba(0,0,0,0.1)] ${isMobileMenuOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}`}>
          
          {/* Mobile Menu Header */}
          <div className={`flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src="/logo.jpg" alt="Logo" className="h-8 w-auto" />
            <button
              onClick={closeMobileMenu}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700" ref={mobileSearchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('navbar.searchPlaceholder')}
                value={searchQuery}
                onChange={handleMobileSearchInputChange}
                className="w-full py-3 px-4 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                dir="ltr"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            {/* Mobile Search Dropdown */}
            {isMobileSearchDropdownOpen && (
              <div className="mt-2">
                <SearchDropdown 
                  onClose={() => setIsMobileSearchDropdownOpen(false)}
                  onSearchSelect={(query) => {
                    setSearchQuery(query);
                    setIsMobileSearchDropdownOpen(false);
                    performSearch(query);
                    navigate('/search');
                    closeMobileMenu();
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile Navigation Links */}
          <div className="p-6">
            <div className="space-y-4">
              <a 
                href="/" 
                className="block py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                {t('navigation.home')}
              </a>
              <a 
                href="/products" 
                className="block py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                {t('navigation.products')}
              </a>
              <a 
                href="/categories" 
                className="block py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                {t('navigation.categories')}
              </a>
              <a 
                href="/about" 
                className="block py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                {t('navigation.about')}
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
              
              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className="flex items-center gap-3 w-full py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
              >
                {theme === 'light' ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                    </svg>
                    {t('navbar.darkMode')}
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                    </svg>
                    {t('navbar.lightMode')}
                  </>
                )}
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-3 w-full py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                </svg>
                <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => {
                  navigate('/cart');
                  closeMobileMenu();
                }}
                className="flex items-center gap-3 w-full py-3 text-slate-900 dark:text-white font-medium text-lg hover:text-blue-600 transition-colors duration-200"
              >
                <div className="relative">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>{t('navbar.cart')} {cartCount > 0 && `(${cartCount})`}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarMain;