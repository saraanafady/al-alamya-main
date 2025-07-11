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
    <nav className={`bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 relative z-[90] transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-[95] shadow-[0_2px_10px_rgba(0,0,0,0.1)] bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-[10px] animate-[slideDown_0.3s_ease-out]' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between min-h-[60px] gap-8">
        {/* Categories Navigation */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth relative" style={{ WebkitOverflowScrolling: 'touch' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`relative flex items-center gap-2 py-3 px-4 bg-transparent border border-slate-200 dark:border-slate-600 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap text-sm font-medium min-w-fit focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 ${
                  activeCategory === category.id
                    ? 'border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/20 font-semibold -translate-y-0.5 shadow-[0_4px_12px_rgba(255,125,26,0.2)]'
                    : 'text-slate-600 dark:text-slate-400 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,125,26,0.15)] hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                }`}
              >
                <span className="text-base flex items-center justify-center">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
                {activeCategory === category.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-sm animate-[slideIn_0.3s_ease]"></span>
                )}
              </button>
            ))}
            {/* Gradient fade for scrollable categories */}
            <span className="pointer-events-none absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-50 dark:from-slate-800 to-transparent z-10 hidden md:block" />
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-500 transition-all duration-200 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800">
            Filter
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-500 transition-all duration-200 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800">
            Sort
          </button>
        </div>
      </div>
      {/* Mobile: Hide on small screens, add mobile version if needed */}
    </nav>
  );
};

export default SecondNavbar;