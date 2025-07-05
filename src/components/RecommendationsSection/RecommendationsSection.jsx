import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import './RecommendationsSection.css';
import { useCart } from '../../context/CartContext';

// Categories will be translated dynamically

const RecommendationsSection = ({ products, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get translated categories
  const categories = [
    { key: 'all', label: t('recommendations.categories.all') },
    { key: 'phones', label: t('recommendations.categories.phones') },
    { key: 'smartWatches', label: t('recommendations.categories.smartWatches') },
    { key: 'gaming', label: t('recommendations.categories.gaming') },
    { key: 'laptops', label: t('recommendations.categories.laptops') },
    { key: 'speakers', label: t('recommendations.categories.speakers') },
  ];
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: `$${product.price}`,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand
    };
    addToCart(cartProduct);
    
    // Show toast notification
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
    <section className="recommendations-section">
      <div className="section-header">
        <h2 className="recommendations-title">{t('recommendations.title')}</h2>
        <div className="view-all">
          <button className="view-all-btn">
            {t('common.viewAll')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={`recommendations-categories ${isScrolled ? 'scrolled' : ''}`}>
        <div className="categories-container">
          {categories.map(category => (
            <button
              key={category.key}
              className={`recommendations-category-btn${selectedCategory === category.key ? ' active' : ''}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
              {selectedCategory === category.key && <span className="active-indicator"></span>}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="recommendations-loading">
          <div className="spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {displayProducts.map(product => (
            <div 
              className="recommendation-card" 
              key={product.id}
              onClick={() => handleProductClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="recommendation-image-wrapper">
                <img src={product.thumbnail} alt={product.title} className="recommendation-image" />
                <div className="product-badge">{t('recommendations.new')}</div>
              </div>
              <div className="recommendation-info">
                <div className="brand-row">
                  <span className="recommendation-brand">{product.brand}</span>
                  <div className="rating">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1L8.854 5.078L13 5.724L10 8.84L10.708 13L7 11.078L3.292 13L4 8.84L1 5.724L5.146 5.078L7 1Z" fill="#FFC107" stroke="#FFC107" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{product.rating}</span>
                    <span>({getReviewCount(product)})</span>
                  </div>
                </div>
                <span className="recommendation-title">{product.title}</span>
              </div>
              <div className="price-row">
                <span className="recommendation-price">{t('common.currency')}{product.price}</span>
                                  {product.salePrice && (
                    <>
                      <span className="recommendation-price old">{t('common.currency')}{product.price + product.salePrice}</span>
                    <span className="discount-badge">-{Math.round((product.salePrice / (product.price + product.salePrice)) * 100)}%</span>
                  </>
                )}
              </div>
              <button 
                className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
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
      
      <div className="mobile-view-all">
        <button className="view-all-btn">
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