import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const { 
    searchResults, 
    isSearching, 
    performSearch, 
    setSearchQuery 
  } = useSearch();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  useEffect(() => {
    let results = [...searchResults];

    // Filter by type
    if (filterBy !== 'all') {
      results = results.filter(item => item.type === filterBy);
    }

    // Filter by price range (for products only)
    if (filterBy === 'product' || filterBy === 'all') {
      results = results.filter(item => {
        if (item.type !== 'product') return true;
        return item.price >= priceRange[0] && item.price <= priceRange[1];
      });
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => {
          if (a.type !== 'product') return 1;
          if (b.type !== 'product') return -1;
          return a.price - b.price;
        });
        break;
      case 'price-high':
        results.sort((a, b) => {
          if (a.type !== 'product') return 1;
          if (b.type !== 'product') return -1;
          return b.price - a.price;
        });
        break;
      case 'name':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        results.sort((a, b) => {
          if (a.type !== 'product') return 1;
          if (b.type !== 'product') return -1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
      default: // relevance
        break;
    }

    setFilteredResults(results);
  }, [searchResults, sortBy, filterBy, priceRange]);

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

  const getResultTypeIcon = (type) => {
    switch (type) {
      case 'product':
        return '📱';
      case 'category':
        return '📂';
      case 'guide':
        return '📖';
      default:
        return '🔍';
    }
  };

  const categories = [...new Set(searchResults
    .filter(item => item.type === 'product')
    .map(item => item.category)
  )];

  return (
    <div className="search-results-page">
      <div className="container">
        {/* Search Header */}
        <div className="search-header">
          <div className="search-info">
            <h1>Search Results</h1>
            {query && (
              <p className="search-query">
                Showing results for "<span>{query}</span>"
              </p>
            )}
            <div className="results-count">
              {isSearching ? (
                <span>Searching...</span>
              ) : (
                <span>{filteredResults.length} results found</span>
              )}
            </div>
          </div>

          {/* Search Filters */}
          <div className="search-filters">
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by:</label>
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Results</option>
                <option value="product">Products</option>
                <option value="category">Categories</option>
                <option value="guide">Guides</option>
              </select>
            </div>

            {(filterBy === 'product' || filterBy === 'all') && (
              <div className="filter-group price-range">
                <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <div className="range-inputs">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="search-results-container">
          {isSearching ? (
            <div className="loading-state">
              <div className="search-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="results-grid">
              {filteredResults.map((result) => (
                <div key={result.id} className={`result-card ${result.type}`}>
                  <div className="result-header">
                    <span className="result-type-badge">
                      {getResultTypeIcon(result.type)} {result.type}
                    </span>
                    {result.type === 'product' && result.rating && (
                      <div className="rating">
                        <span className="stars">
                          {'★'.repeat(Math.floor(result.rating))}
                          {'☆'.repeat(5 - Math.floor(result.rating))}
                        </span>
                        <span className="rating-value">({result.rating})</span>
                      </div>
                    )}
                  </div>

                  <div className="result-image">
                    <img 
                      src={result.thumbnail || '/images/placeholder.png'} 
                      alt={result.title}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>

                  <div className="result-content">
                    <h3>{result.title}</h3>
                    <p className="result-description">{result.description}</p>
                    
                    {result.type === 'product' && (
                      <div className="product-meta">
                        <div className="price-info">
                          <span className="price">${result.price}</span>
                          {result.discountPercentage && (
                            <span className="discount">
                              -{Math.round(result.discountPercentage)}%
                            </span>
                          )}
                        </div>
                        <div className="product-details">
                          <span className="category">{result.category}</span>
                          {result.brand && <span className="brand">{result.brand}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="result-actions">
                    {result.type === 'product' ? (
                      <div className="product-actions">
                        <button 
                          className="view-product-btn"
                          onClick={() => handleProductClick(result)}
                        >
                          View Details
                        </button>
                        <button 
                          className={`add-to-cart-btn ${isInCart(result.id) ? 'in-cart' : ''}`}
                          onClick={() => handleAddToCart(result)}
                        >
                          {isInCart(result.id) 
                            ? `In Cart (${getItemQuantity(result.id)})` 
                            : 'Add to Cart'
                          }
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="explore-btn"
                        onClick={() => {
                          if (result.type === 'category') {
                            navigate(`/category/${result.title.toLowerCase()}`);
                          } else if (result.type === 'guide') {
                            navigate(`/guides/${result.id}`);
                          }
                        }}
                      >
                        Explore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-state">
              <div className="no-results-icon">🔍</div>
              <h2>No results found</h2>
              <p>
                We couldn't find anything matching "{query}". 
                Try adjusting your search terms or filters.
              </p>
              <div className="search-suggestions">
                <h4>Try searching for:</h4>
                <div className="suggestion-tags">
                  {['iPhone', 'Headphones', 'Gaming', 'Laptop', 'Smart Watch'].map((suggestion) => (
                    <button 
                      key={suggestion}
                      className="suggestion-tag"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories Sidebar */}
        {categories.length > 0 && (
          <div className="categories-sidebar">
            <h4>Categories</h4>
            <div className="category-filters">
              {categories.map((category) => (
                <button 
                  key={category}
                  className="category-filter"
                  onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                >
                  {category}
                  <span className="category-count">
                    ({searchResults.filter(item => item.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 