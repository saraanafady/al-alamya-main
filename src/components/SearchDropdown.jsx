import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './SearchDropdown.css';

const SearchDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    searchHistory, 
    removeFromHistory, 
    getPopularSearches,
    setSearchQuery 
  } = useSearch();
  const { addToCart } = useCart();

  const handleResultClick = (result) => {
    if (result.type === 'product') {
      // Navigate to product details or add to cart
      navigate(`/product/${result.id}`);
    } else if (result.type === 'category') {
      navigate(`/category/${result.title.toLowerCase()}`);
    } else if (result.type === 'guide') {
      navigate(`/guides/${result.id}`);
    }
    onClose();
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
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

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
  };

  const handlePopularSearchClick = (query) => {
    setSearchQuery(query);
  };

  if (!isOpen) return null;

  return (
    <div className="search-dropdown">
      <div className="search-dropdown-content">
        {/* Search Results */}
        {searchQuery && (
          <div className="search-section">
            <div className="search-section-header">
              <h4>Search Results</h4>
              {isSearching && <div className="search-spinner"></div>}
            </div>
            
            {searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.slice(0, 8).map((result) => (
                  <div 
                    key={result.id} 
                    className="search-result-item"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="result-image">
                      <img 
                        src={result.thumbnail || '/images/placeholder.png'} 
                        alt={result.title}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                      <span className="result-type">{result.type}</span>
                    </div>
                    
                    <div className="result-info">
                      <h5>{result.title}</h5>
                      <p>{result.description}</p>
                      {result.type === 'product' && (
                        <div className="result-meta">
                          <span className="result-price">${result.price}</span>
                          <span className="result-category">{result.category}</span>
                        </div>
                      )}
                    </div>
                    
                    {result.type === 'product' && (
                      <button 
                        className="quick-add-btn"
                        onClick={(e) => handleAddToCart(e, result)}
                        title="Add to cart"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                
                {searchResults.length > 8 && (
                  <div className="view-all-results">
                    <button 
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        onClose();
                      }}
                    >
                      View all {searchResults.length} results
                    </button>
                  </div>
                )}
              </div>
            ) : !isSearching && (
              <div className="no-results">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Search History */}
        {!searchQuery && searchHistory.length > 0 && (
          <div className="search-section">
            <div className="search-section-header">
              <h4>Recent Searches</h4>
              <button 
                className="clear-history-btn"
                onClick={() => removeFromHistory()}
              >
                Clear
              </button>
            </div>
            <div className="search-history">
              {searchHistory.slice(0, 5).map((query, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  onClick={() => handleHistoryClick(query)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21L16.65 16.65"/>
                  </svg>
                  <span>{query}</span>
                  <button 
                    className="remove-history-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(query);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="search-section">
            <div className="search-section-header">
              <h4>Popular Searches</h4>
            </div>
            <div className="popular-searches">
              {getPopularSearches().map((query, index) => (
                <button 
                  key={index}
                  className="popular-search-btn"
                  onClick={() => handlePopularSearchClick(query)}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown; 