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
    <section
      className="my-12 rounded-2xl p-6 md:p-8 w-full box-border overflow-x-hidden"
      style={{
        background: 'var(--primary-bg)',
        border: '1px solid var(--card-border)'
      }}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 px-2">
        <h2 className="text-2xl md:text-3xl font-bold m-0 leading-tight" style={{ color: 'var(--primary-text)' }}>{t('recommendations.title')}</h2>
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/search')}
            className="bg-transparent border-2 font-semibold text-sm flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full transition-all duration-300 uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              borderColor: 'var(--accent-text, #2563eb)',
              color: 'var(--accent-text, #2563eb)'
            }}
          >
            {t('common.viewAll')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      {/* Categories */}
      <div
        className={`sticky top-0 z-10 transition-all duration-300 border-b py-4 ${isScrolled ? 'shadow-[0_8px_32px_rgba(37,99,235,0.15)]' : ''}`}
        style={{
          background: 'var(--primary-bg)',
          borderColor: 'var(--card-border)'
        }}
      > 
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-2">
          {categories.map(category => (
            <button
              key={category.key}
              className={`relative flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-full border-2 font-semibold text-xs md:text-sm uppercase tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedCategory === category.key ? 'shadow-lg -translate-y-0.5' : 'hover:-translate-y-0.5'}`}
              style={{
                background: selectedCategory === category.key ? 'var(--accent-text, #2563eb)' : 'var(--card-bg)',
                color: selectedCategory === category.key ? 'white' : 'var(--accent-text, #2563eb)',
                borderColor: selectedCategory === category.key ? 'var(--accent-text, #2563eb)' : 'var(--card-border)',
                borderWidth: '2px'
              }}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
              {selectedCategory === category.key && (
                <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-8 h-1 rounded-full animate-[slideIn_0.3s_ease]"
                  style={{ background: 'var(--accent-text, #2563eb)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mb-4"
            style={{
              borderColor: 'var(--accent-text, #2563eb)',
              borderTopColor: 'var(--accent-text, #2563eb)'
            }}
          />
          <p className="text-lg" style={{ color: 'var(--secondary-text)' }}>{t('common.loading')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 p-2 mt-6">
          {displayProducts.map(product => (
            <div 
              className="relative flex flex-col rounded-2xl shadow-md hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] p-6 transition-all duration-300 h-full overflow-hidden group cursor-pointer hover:-translate-y-1"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)'
              }}
              key={product.id}
              onClick={() => handleProductClick(product)}
            >
              {/* Top gradient bar on hover */}
              <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: 'linear-gradient(to right, var(--accent-gradient-from, #2563eb), var(--accent-gradient-to, #60a5fa))'
                }}
              />
              {/* Product Image */}
              <div className="relative w-full h-40 mb-4 flex items-center justify-center rounded-xl overflow-hidden"
                style={{ background: 'var(--image-bg, #f8fafc)' }}
              >
                <img src={product.thumbnail} alt={product.title} className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.3)] z-20"
                  style={{ background: 'var(--accent-text, #2563eb)' }}
                >{t('recommendations.new')}</div>
              </div>
              {/* Product Info */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-text, #2563eb)' }}>{product.brand}</span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--secondary-text)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1L8.854 5.078L13 5.724L10 8.84L10.708 13L7 11.078L3.292 13L4 8.84L1 5.724L5.146 5.078L7 1Z" fill="#FFC107" stroke="#FFC107" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{product.rating}</span>
                    <span className="ml-1">({getReviewCount(product)})</span>
                  </div>
                </div>
                <span className="text-base font-semibold mb-1 leading-tight line-clamp-2 min-h-[2.8em]" style={{ color: 'var(--primary-text)' }}>{product.title}</span>
              </div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-bold text-lg" style={{ color: 'var(--accent-text, #2563eb)' }}>
                  {t('common.currency')}{product.price}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-base line-through" style={{ color: 'var(--secondary-text)' }}>{t('common.currency')}{product.price + product.salePrice}</span>
                    <span className="text-white text-xs font-semibold px-2 py-1 rounded-full ml-2" style={{ background: 'var(--error-bg, #ef4444)' }}>-{Math.round((product.salePrice / (product.price + product.salePrice)) * 100)}%</span>
                  </>
                )}
              </div>
              <button 
                className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl w-full min-h-[40px] uppercase tracking-wide transition-all duration-300 mt-auto shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)]`}
                style={{
                  background: isInCart(product.id) 
                    ? 'linear-gradient(135deg, var(--success-gradient-from, #10b981), var(--success-gradient-to, #059669))'
                    : 'linear-gradient(135deg, var(--accent-gradient-from, #2563eb), var(--accent-gradient-to, #60a5fa))',
                  color: 'white'
                }}
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
        <button
          className="bg-transparent border-2 font-semibold text-sm flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full transition-all duration-300 uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-lg mx-auto"
          style={{
            borderColor: 'var(--accent-text, #2563eb)',
            color: 'var(--accent-text, #2563eb)'
          }}
        >
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