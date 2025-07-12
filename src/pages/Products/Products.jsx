import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { useSearch } from '../../context/SearchContext';

const FAVORITES_KEY = 'favorites';

const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [favorites, setFavorites] = useState([]); // Favorite product IDs
  
  const productsPerPage = 12;

  // Load favorites from localStorage on mount
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    setFavorites(favs);
  }, []);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Get search query from URL params
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortBy, priceRange, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products?limit=100');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/category-list');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.discountPercentage > 0 
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
        break;
      case 'price-high':
        filtered.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const getDiscountedPrice = (product) => {
    return product.discountPercentage > 0
      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
      : product.price.toFixed(2);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Favorite logic
  const isFavorite = (id) => favorites.includes(id);
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Cart logic
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
    toast.success(t('cart.addedToCart', { product: product.title }), {
      icon: '🛒',
      style: {
        background: '#10b981',
        color: '#ffffff',
      },
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchParams(query ? { search: query } : {});
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-16">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 dark:text-slate-500 text-lg">{t('common.loading') || 'Loading products...'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 w-full">
      {/* Section Title & Subtitle */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="block w-2 h-8 rounded bg-blue-600" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('products.allProducts') || 'All Products'}
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium ml-2 mt-0 mb-4">
          {t('products.subtitle') || 'Discover our complete collection of premium electronics and gadgets'}
        </p>
        {/* Search Bar */}
        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-6 py-3 w-full max-w-xl mt-2">
          <input
            type="text"
            placeholder={t('products.searchPlaceholder') || 'Search products...'}
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2"
          />
          <button className="ml-2 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-4 items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-slate-700 dark:text-slate-200 font-semibold mr-2">{t('products.category') || 'Category:'}</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-2 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              <option value="all">{t('products.allCategories') || 'All Categories'}</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-slate-700 dark:text-slate-200 font-semibold mr-2">{t('products.sortBy') || 'Sort by:'}</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-2 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            >
              <option value="default">{t('products.defaultSort') || 'Default'}</option>
              <option value="price-low">{t('products.priceLow') || 'Price: Low to High'}</option>
              <option value="price-high">{t('products.priceHigh') || 'Price: High to Low'}</option>
              <option value="rating">{t('products.rating') || 'Rating'}</option>
              <option value="discount">{t('products.discount') || 'Discount'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
        {currentProducts.map(product => (
          <div
            key={product.id}
            className="relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-[0_12px_40px_rgba(37,99,235,0.18)] border border-slate-200 dark:border-slate-700 p-7 transition-all duration-300 h-full overflow-hidden group cursor-pointer hover:-translate-y-2"
            onClick={() => handleProductClick(product)}
          >
            {/* Favorite Icon */}
            <button
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 shadow hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}
              title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite(product.id) ? (
                <svg className="w-6 h-6 text-red-500 fill-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 5.6 9.28c-1.5 2.04-1.1 5.13 1.4 7.36 2.5 2.23 5.5 4.36 5.5 4.36s3-2.13 5.5-4.36c2.5-2.23 2.9-5.32 1.4-7.36-1.5-2.04-4.54-2.68-6.5-0.64z" /></svg>
              )}
            </button>
            {/* Top gradient bar on hover */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <div className="relative w-full h-44 mb-5 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
              <img src={product.thumbnail} alt={product.title} className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)] z-20">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{product.brand}</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight line-clamp-2 min-h-[2.4em]">{product.title}</span>
            <span className="text-slate-500 dark:text-slate-300 text-sm mb-2 line-clamp-2">{product.description}</span>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                {t('common.currency')}{getDiscountedPrice(product)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-base text-slate-400 line-through">
                  {t('common.currency')}{product.price}
                </span>
              )}
            </div>
            {/* Add to Cart Button */}
            <button
              className={`mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-semibold uppercase tracking-wide transition-all duration-300 shadow-[0_2px_8px_rgba(37,99,235,0.2)] bg-gradient-to-br ${isInCart(product.id) ? 'from-emerald-500 to-emerald-700 text-white cursor-not-allowed' : 'from-blue-600 to-blue-400 hover:from-blue-900 hover:to-blue-600 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)]'}`}
              disabled={isInCart(product.id)}
              onClick={e => handleAddToCart(e, product)}
            >
              {isInCart(product.id) ? (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  {t('cart.inCart')} ({getItemQuantity(product.id)})
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68l3.24-7.24A1 1 0 0020 8H6.21" /></svg>
                  {t('cart.addToCart')}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 border-2 ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white dark:bg-slate-800 text-blue-600 border-blue-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products; 