import React, { useState, useEffect } from 'react';

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
    <nav className={`border-b relative z-[90] transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-[95] backdrop-blur-[10px] animate-[slideDown_0.3s_ease-out]' : ''}`}
      style={{
        background: isSticky ? 'var(--card-bg)' : 'var(--primary-bg)',
        borderColor: 'var(--card-border)',
        boxShadow: isSticky ? 'var(--shadow-lg)' : 'none'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between min-h-[60px] gap-8">
        {/* Categories Navigation */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth relative" style={{ WebkitOverflowScrolling: 'touch' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`relative flex items-center gap-2 py-3 px-4 bg-transparent border rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap text-sm font-medium min-w-fit focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 ${
                  activeCategory === category.id
                    ? 'font-semibold -translate-y-0.5'
                    : 'hover:-translate-y-0.5'
                }`}
                style={{
                  background: activeCategory === category.id ? 'var(--accent-text)' : 'transparent',
                  color: activeCategory === category.id ? 'white' : 'var(--secondary-text)',
                  borderColor: activeCategory === category.id ? 'var(--accent-text)' : 'var(--card-border)',
                  borderWidth: '1px',
                  boxShadow: activeCategory === category.id ? 'var(--shadow-md)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== category.id) {
                    e.target.style.background = 'var(--tertiary-bg)';
                    e.target.style.color = 'var(--primary-text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category.id) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--secondary-text)';
                  }
                }}
              >
                <span className="text-base flex items-center justify-center">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
                {activeCategory === category.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-sm animate-[slideIn_0.3s_ease]"
                    style={{ background: 'white' }}
                  />
                )}
              </button>
            ))}
            {/* Gradient fade for scrollable categories */}
            <span className="pointer-events-none absolute top-0 right-0 w-8 h-full z-10 hidden md:block"
              style={{
                background: 'linear-gradient(to left, var(--primary-bg), transparent)'
              }}
            />
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="px-4 py-2 border rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:scale-105 theme-button-secondary"
            style={{
              color: 'var(--secondary-text)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent-text)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--card-bg)';
              e.target.style.color = 'var(--secondary-text)';
            }}
          >
            Filter
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:scale-105 theme-button-secondary"
            style={{
              color: 'var(--secondary-text)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent-text)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--card-bg)';
              e.target.style.color = 'var(--secondary-text)';
            }}
          >
            Sort
          </button>
        </div>
      </div>
      {/* Mobile: Hide on small screens, add mobile version if needed */}
    </nav>
  );
};

export default SecondNavbar;