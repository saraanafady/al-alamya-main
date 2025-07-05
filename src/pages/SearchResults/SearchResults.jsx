import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import toast from 'react-hot-toast';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToHistory } = useSearch();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    if (query) {
      addToHistory(query);
      fetchSearchResults();
    } else if (categoryFilter) {
      fetchCategoryResults();
    }
  }, [query, categoryFilter]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=100`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products/category/${categoryFilter}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching category results:', error);
      toast.error('Failed to fetch category results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch categories for filter
    fetch('https://dummyjson.com/products/category-list')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

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

  const getFilteredAndSortedProducts = () => {
    let filtered = products;

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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="search-results-loading">
        <div className="loading-spinner"></div>
        <p>Searching for products...</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <div className="search-info">
          <h1>
            {query ? (
              <>Search Results for "{query}"</>
            ) : (
              <>Products in "{categoryFilter}"</>
            )}
          </h1>
          <p>{filteredProducts.length} products found</p>
        </div>

        <div className="search-controls">
          <div className="sort-control">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
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

      <div className="search-results-content">
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Category</h3>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
              />
            </div>
            <div className="price-range-slider">
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
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <h2>No products found</h2>
              <p>Try adjusting your search terms or filters</p>
              <button 
                onClick={() => navigate('/')}
                className="back-home-btn"
              >
                Back to Home
              </button>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    onClick={() => handleProductClick(product)}
                  />
                  {product.discountPercentage > 0 && (
                    <div className="discount-badge">
                      -{Math.round(product.discountPercentage)}%
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <div className="product-brand">{product.brand}</div>
                  <h3 
                    className="product-title"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.title}
                  </h3>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {renderStars(product.rating)}
                    </div>
                    <span className="rating-value">({product.rating})</span>
                  </div>
                  
                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.discountPercentage > 0 && (
                      <span className="original-price">
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-description">
                    {product.description.length > 100 
                      ? product.description.substring(0, 100) + '...'
                      : product.description
                    }
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
                      </svg>
                      {isInCart(product.id) ? `In Cart (${getItemQuantity(product.id)})` : 'Add to Cart'}
                    </button>
                    
                    <button 
                      className="view-details-btn"
                      onClick={() => handleProductClick(product)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 