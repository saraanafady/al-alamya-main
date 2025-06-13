import React, { useState, useEffect } from 'react';
import './SecondNavbar.css';

const SecondNavbar = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsSticky(scrollTop > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', label: 'All Products', icon: '🏪' },
    { id: 'phones', label: 'Phones', icon: '📱' },
    { id: 'laptops', label: 'Laptops', icon: '💻' },
    { id: 'headphones', label: 'Headphones', icon: '🎧' },
    { id: 'speakers', label: 'Speakers', icon: '🔊' },
    { id: 'smartwatches', label: 'Smart Watches', icon: '⌚' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'accessories', label: 'Accessories', icon: '🔌' }
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    // Add your category filtering logic here
    console.log('Selected category:', categoryId);
  };

  return (
    <nav className={`second-navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="second-navbar-container">
        {/* Categories Navigation */}
        <div className="categories-nav">
          <div className="categories-scroll">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn filter-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            <span>Filter</span>
          </button>

          <button className="quick-action-btn sort-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M7 12h10m-7 6h4"/>
            </svg>
            <span>Sort</span>
          </button>

          <button className="quick-action-btn view-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Mobile Category Selector */}
      <div className="mobile-category-selector">
        <select 
          value={activeCategory} 
          onChange={(e) => handleCategoryClick(e.target.value)}
          className="mobile-category-select"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        
        <div className="mobile-quick-actions">
          <button className="mobile-quick-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
          </button>
          <button className="mobile-quick-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M7 12h10m-7 6h4"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SecondNavbar;