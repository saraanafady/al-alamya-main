import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import './BestsellersSection.css';
import { useCart } from '../../context/CartContext';

const BestsellersSection = ({ products, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

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

  const handleShopMoreClick = () => {
    navigate('/products');
  };

  return (
    <section className="bestsellers-section">
      <div className="bestsellers-container">
        {loading ? (
          <div className="bestsellers-loading">{t('common.loading')}</div>
        ) : (
          <div className="bestsellers-grid">
            {/* Intro Card */}
            <div className="bestseller-intro-card">
              <span className="bestseller-featured-label">{t('bestsellers.subtitle')}</span>
              <h2>{t('bestsellers.title')}</h2>
              <p>
                {t('bestsellers.description')}
              </p>
              <button onClick={handleShopMoreClick}>{t('bestsellers.shopMore')}</button>
            </div>
            
            {/* Product Cards */}
            {products.map(product => (
              <div 
                className="bestseller-card" 
                key={product.id}
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                {product.discountPercentage > 0 && (
                  <span className="bestseller-badge">{t('bestsellers.sale')}</span>
                )}
                <div className="bestseller-img-wrap">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="bestseller-meta">
                  <span className="bestseller-stock">{t('bestsellers.stockBrand')}</span>
                  <span className="bestseller-brand">{product.brand || product.category}</span>
                </div>
                <h3>{product.title}</h3>
                <div className="bestseller-prices">
                  <span className="bestseller-price">{t('common.currency')}{product.price}</span>
                                      {product.discountPercentage > 0 && (
                    <span className="bestseller-old-price">
                      {t('common.currency')}{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                <button 
                  className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <svg viewBox="0 0 20 20"><path d="M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.333 14h7.334a2 2 0 0 0 1.98-1.735l1-7A2 2 0 0 0 15.667 3H4.333l-.2-1.2A1 1 0 0 0 3.15 1H1a1 1 0 0 0 0 2h1.18l1.6 9.6A2 2 0 0 0 5.667 14zm7.334-9a1 1 0 0 1 .995 1.1l-1 7a1 1 0 0 1-.995.9H7.333a1 1 0 0 1-.995-.9L5.34 5h9.327z"/></svg>
                  {isInCart(product.id) ? `${t('cart.inCart')} (${getItemQuantity(product.id)})` : t('cart.addToCart')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestsellersSection;