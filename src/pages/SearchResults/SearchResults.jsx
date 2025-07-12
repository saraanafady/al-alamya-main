import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { addToFavorites, isInFavorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  // Remove products, loading, and fetch logic for search
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // On mount, set searchQuery from URL if present
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== searchQuery) setSearchQuery(q);
  }, [searchParams, setSearchQuery, searchQuery]);

  // Optionally, fetch categories for filter (keep this logic)
  useEffect(() => {
    fetch('https://dummyjson.com/products/category-list')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Filtering and sorting logic on searchResults
  const getFilteredAndSortedProducts = () => {
    let filtered = searchResults.filter(r => r.type === 'product');

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: `$${product.price}`,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand
    };
    
    addToCart(cartProduct);
    toast.success(`${product.title} added to cart!`, {
      icon: '🛒',
      style: {
        background: '#10b981',
        color: '#ffffff',
      },
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleToggleFavorite = (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to favorites');
      return;
    }

    const favoriteProduct = {
      id: product.id,
      name: product.title,
      price: `$${product.price}`,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand,
      description: product.description
    };

    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id, product.title);
    } else {
      addToFavorites(favoriteProduct);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
      >
        ★
      </span>
    ));
  };

  if (isSearching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-16"
        style={{ background: 'var(--page-bg)' }}
      >
        <div className="w-12 h-12 border-4 rounded-full animate-spin mb-6"
          style={{
            borderColor: 'var(--accent-bg, rgba(37, 99, 235, 0.1))',
            borderTopColor: 'var(--accent-text, #2563eb)'
          }}
        />
        <p className="text-lg"
          style={{ color: 'var(--secondary-text)' }}
        >Searching for products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen"
      style={{ background: 'var(--page-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl shadow-lg border p-6 mb-8"
          style={{
            background: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2"
                style={{ color: 'var(--primary-text)' }}
              >
                {searchQuery ? (
                  <>Search Results for "{searchQuery}"</>
                ) : (
                  <>All Products</>
                )}
              </h1>
              <p style={{ color: 'var(--secondary-text)' }}>
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-lg"
                style={{ background: 'var(--primary-bg)' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'shadow-md scale-105' 
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: viewMode === 'grid' ? 'var(--accent-bg, rgba(37, 99, 235, 0.1))' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--accent-text, #2563eb)' : 'var(--secondary-text)'
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'shadow-md scale-105' 
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: viewMode === 'list' ? 'var(--accent-bg, rgba(37, 99, 235, 0.1))' : 'transparent',
                    color: viewMode === 'list' ? 'var(--accent-text, #2563eb)' : 'var(--secondary-text)'
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium"
                  style={{ color: 'var(--primary-text)' }}
                >
                  Sort by:
                </label>
                <select 
                  id="sort" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--primary-text)'
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl shadow-lg border p-6 sticky top-8 z-20 flex flex-col gap-8"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                minWidth: '220px',
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'auto'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--primary-text)' }}>Filters</h3>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                  }}
                  className="text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-200 hover:bg-blue-50 hover:text-blue-700"
                  style={{ borderColor: 'var(--card-border)', color: 'var(--secondary-text)' }}
                  aria-label="Clear Filters"
                >
                  Clear
                </button>
              </div>
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--primary-text)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                  Category
                </h4>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--primary-text)'
                  }}
                  aria-label="Category Filter"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--primary-text)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                  Price Range
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    min={0}
                    max={priceRange[1]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--card-border)',
                      color: 'var(--primary-text)'
                    }}
                    aria-label="Minimum Price"
                  />
                  <span style={{ color: 'var(--secondary-text)' }}>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    min={priceRange[0]}
                    max={1000}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--card-border)',
                      color: 'var(--primary-text)'
                    }}
                    aria-label="Maximum Price"
                  />
                </div>
                <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--secondary-text)' }}>
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                    style={{ background: 'var(--card-border)' }}
                    aria-label="Minimum Price Slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                    style={{ background: 'var(--card-border)' }}
                    aria-label="Maximum Price Slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl shadow-lg border p-12 text-center"
                style={{
                  background: 'var(--card-bg)',
                  borderColor: 'var(--card-border)'
                }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--primary-bg)' }}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color: 'var(--secondary-text)' }}
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4"
                  style={{ color: 'var(--primary-text)' }}
                >No products found</h2>
                <p className="mb-8"
                  style={{ color: 'var(--secondary-text)' }}
                >Try adjusting your search terms or filters</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'var(--accent-text, #2563eb)',
                    color: 'white'
                  }}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "space-y-4"
              }>
                {filteredProducts.map(product => (
                  <div key={product.id} 
                    className={`relative rounded-3xl shadow-lg border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400 bg-gradient-to-br from-[rgba(37,99,235,0.05)] to-[rgba(16,185,129,0.03)] ${viewMode === 'list' ? 'flex' : ''}`}
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: 'var(--card-border)',
                      minHeight: '340px',
                      cursor: 'pointer'
                    }}
                    tabIndex={0}
                    aria-label={product.title}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`} style={{height: viewMode === 'list' ? '100%' : '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--image-bg, #f8fafc)'}}>
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                        style={{ maxHeight: '180px', maxWidth: '90%' }}
                      />
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse"
                          style={{ background: 'linear-gradient(to right, #2563eb, #10b981)' }}
                        >
                          -{Math.round(product.discountPercentage)}%
                        </div>
                      )}
                      {isInCart(product.id) && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                          In Cart
                        </div>
                      )}
                      <button
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                        style={{ right: isInCart(product.id) ? '3.5rem' : '0.75rem' }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isInFavorites(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                    <div className={`p-6 flex flex-col gap-2 ${viewMode === 'list' ? 'flex-1' : ''}`}
                      style={{ minWidth: 0 }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1 truncate" style={{ color: 'var(--accent-text, #2563eb)' }}>
                        {product.brand}
                      </div>
                      <h3 
                        className="font-semibold text-lg mb-2 cursor-pointer transition-colors line-clamp-2 truncate"
                        style={{ color: 'var(--primary-text)' }}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--secondary-text)' }}>
                          ({product.rating})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold" style={{ color: '#2563eb' }}>
                          ${product.price}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm line-through" style={{ color: '#ef4444' }}>
                            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-4 line-clamp-3 truncate" style={{ color: 'var(--secondary-text)' }}>
                        {product.description.length > 100 
                          ? product.description.substring(0, 100) + '...'
                          : product.description
                        }
                      </p>
                      <div className="space-y-2 mt-auto">
                        <button 
                          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 ${
                            isInCart(product.id) 
                              ? 'cursor-not-allowed bg-green-600' 
                              : 'hover:scale-105 bg-blue-600'
                          }`}
                          style={{ color: 'white', fontSize: '1rem' }}
                          onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                          aria-label={isInCart(product.id) ? `In Cart (${getItemQuantity(product.id)})` : 'Add to Cart'}
                          disabled={isInCart(product.id)}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
                          </svg>
                          {isInCart(product.id) ? `In Cart (${getItemQuantity(product.id)})` : 'Add to Cart'}
                        </button>
                        <button 
                          className="w-full py-3 px-4 border rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
                          style={{ borderColor: 'var(--card-border)', color: 'var(--primary-text)' }}
                          onClick={e => { e.stopPropagation(); handleProductClick(product); }}
                          aria-label="View Details"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 