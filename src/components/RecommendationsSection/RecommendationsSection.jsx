import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const RecommendationsSection = ({ products, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Get translated categories
  const categories = [
    { key: 'all', label: t('recommendations.categories.all') },
    { key: 'phones', label: t('recommendations.categories.phones') },
    { key: 'smartWatches', label: t('recommendations.categories.smartWatches') },
    { key: 'gaming', label: t('recommendations.categories.gaming') },
    { key: 'laptops', label: t('recommendations.categories.laptops') },
    { key: 'speakers', label: t('recommendations.categories.speakers') },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll for category buttons
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  // Generate mock products if none are provided
  const displayProducts = products.length > 0 ? filteredProducts : Array(8).fill().map((_, i) => ({
    id: i,
    title: 'Product ' + (i + 1),
    category: categories[Math.floor(Math.random() * 5) + 1].key,
    price: Math.floor(Math.random() * 900) + 100,
    thumbnail: `https://picsum.photos/80/80?random=${i}`,
    brand: 'STOCKMART',
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 1000),
    salePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 50 : null
  }));

  // Helper function to get review count
  const getReviewCount = (product) => {
    if (typeof product.reviews === 'number') {
      return product.reviews;
    }
    if (Array.isArray(product.reviews)) {
      return product.reviews.length;
    }
    if (typeof product.reviews === 'object' && product.reviews !== null) {
      return Object.keys(product.reviews).length;
    }
    return 0;
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
    toast.success(t('cart.addedToCart', { product: product.title }), {
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

  return (
    <section className="my-12 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 w-full box-border overflow-x-hidden">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 px-2">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white m-0 leading-tight">{t('recommendations.title')}</h2>
        <div className="flex justify-end">
          <button className="bg-transparent border-2 border-blue-600 text-blue-600 font-semibold text-sm flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full transition-all duration-300 uppercase tracking-wide hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg">
            {t('common.viewAll')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      {/* Categories */}
      <div className={`sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 transition-all duration-300 border-b border-slate-200 dark:border-slate-700 py-4 ${isScrolled ? 'shadow-[0_8px_32px_rgba(37,99,235,0.15)] bg-white dark:bg-slate-800' : ''}`}> 
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-2">
          {categories.map(category => (
            <button
              key={category.key}
              className={`relative flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-full border-2 font-semibold text-xs md:text-sm uppercase tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 ${selectedCategory === category.key ? 'bg-blue-600 text-white border-blue-600 shadow-lg -translate-y-0.5' : 'bg-white dark:bg-slate-800 text-blue-600 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-0.5'}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
              {selectedCategory === category.key && <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full animate-[slideIn_0.3s_ease]"></span>}
            </button>
          ))}
        </div>
      </div>
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 dark:text-slate-500 text-lg">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 p-2 mt-6">
          {displayProducts.map(product => (
            <div 
              className="relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 h-full overflow-hidden group cursor-pointer hover:-translate-y-1"
              key={product.id}
              onClick={() => handleProductClick(product)}
            >
              {/* Top gradient bar on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              {/* Product Image */}
              <div className="relative w-full h-40 mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
                <img src={product.thumbnail} alt={product.title} className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.3)] z-20">{t('recommendations.new')}</div>
              </div>
              {/* Product Info */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">{product.brand}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1L8.854 5.078L13 5.724L10 8.84L10.708 13L7 11.078L3.292 13L4 8.84L1 5.724L5.146 5.078L7 1Z" fill="#FFC107" stroke="#FFC107" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{product.rating}</span>
                    <span className="ml-1">({getReviewCount(product)})</span>
                  </div>
                </div>
                <span className="text-base font-semibold text-slate-900 dark:text-white mb-1 leading-tight line-clamp-2 min-h-[2.8em]">{product.title}</span>
              </div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {t('common.currency')}{product.price}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-base text-slate-400 line-through">{t('common.currency')}{product.price + product.salePrice}</span>
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full ml-2">-{Math.round((product.salePrice / (product.price + product.salePrice)) * 100)}%</span>
                  </>
                )}
              </div>
              <button 
                className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl w-full min-h-[40px] uppercase tracking-wide transition-all duration-300 mt-auto shadow-[0_2px_8px_rgba(37,99,235,0.2)] bg-gradient-to-br ${isInCart(product.id) ? 'from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white' : 'from-blue-600 to-blue-400 hover:from-blue-900 hover:to-blue-600 text-white'} hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)]`}
                onClick={(e) => handleAddToCart(e, product)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66667 18.3333C7.1269 18.3333 7.5 17.9602 7.5 17.5C7.5 17.0398 7.1269 16.6667 6.66667 16.6667C6.20643 16.6667 5.83333 17.0398 5.83333 17.5C5.83333 17.9602 6.20643 18.3333 6.66667 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8333 18.3333C16.2936 18.3333 16.6667 17.9602 16.6667 17.5C16.6667 17.0398 16.2936 16.6667 15.8333 16.6667C15.3731 16.6667 15 17.0398 15 17.5C15 17.9602 15.3731 18.3333 15.8333 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0.833336 1.66667H4.16667L6.4 12.0917C6.4761 12.4253 6.68485 12.72 6.9796 12.9118C7.27436 13.1036 7.63276 13.1778 7.98334 13.1167H15.15C15.5006 13.1778 15.859 13.1036 16.1537 12.9118C16.4485 12.72 16.6572 12.4253 16.7333 12.0917L18.3333 5.00001H5.00001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isInCart(product.id) ? `${t('cart.inCart')} (${getItemQuantity(product.id)})` : t('cart.addToCart')}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Mobile View All */}
      <div className="block md:hidden mt-8 text-center">
        <button className="bg-transparent border-2 border-blue-600 text-blue-600 font-semibold text-sm flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full transition-all duration-300 uppercase tracking-wide hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg mx-auto">
          {t('recommendations.viewAllProducts')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default RecommendationsSection;