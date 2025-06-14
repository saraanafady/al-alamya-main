import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { swiperConfigs, createSwiperConfig } from '../utils/swiperConfig';
import './ProductCarousel.css';

const ProductCarousel = ({ 
  products, 
  onProductClick, 
  onAddToCart, 
  cartItems = [],
  className = '',
  showNavigation = true,
  showPagination = false,
  autoplay = true,
  customConfig = {}
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const swiperConfig = createSwiperConfig(
    swiperConfigs.products,
    {
      ...customConfig,
      autoplay: autoplay ? swiperConfigs.products.autoplay : false,
    },
    isRTL
  );

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getReviewCount = (product) => {
    return Math.floor(Math.random() * 500) + 50;
  };

  return (
    <div className={`product-carousel ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        {...swiperConfig}
        navigation={showNavigation ? {
          nextEl: '.product-swiper-button-next',
          prevEl: '.product-swiper-button-prev',
        } : false}
        pagination={showPagination ? {
          el: '.product-swiper-pagination',
          clickable: true,
        } : false}
        className="product-swiper"
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <div 
              className="product-carousel-card" 
              onClick={() => onProductClick?.(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-carousel-image-wrapper">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="product-carousel-image" 
                />
                {product.salePrice && (
                  <div className="product-carousel-badge">
                    -{Math.round((product.salePrice / (product.price + product.salePrice)) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="product-carousel-info">
                <div className="product-carousel-brand-row">
                  <span className="product-carousel-brand">{product.brand}</span>
                  <div className="product-carousel-rating">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1L8.854 5.078L13 5.724L10 8.84L10.708 13L7 11.078L3.292 13L4 8.84L1 5.724L5.146 5.078L7 1Z" fill="#FFC107" stroke="#FFC107" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{product.rating}</span>
                    <span>({getReviewCount(product)})</span>
                  </div>
                </div>
                
                <h3 className="product-carousel-title">{product.title}</h3>
                
                <div className="product-carousel-price-row">
                  <span className="product-carousel-price">
                    {t('common.currency')}{product.price}
                  </span>
                  {product.salePrice && (
                    <span className="product-carousel-price old">
                      {t('common.currency')}{product.price + product.salePrice}
                    </span>
                  )}
                </div>
                
                <button 
                  className={`product-carousel-add-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(product);
                  }}
                >
                  {isInCart(product.id) ? '✓ ' + t('cart.inCart') : t('cart.addToCart')}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {showNavigation && (
        <>
          <div className="product-swiper-button-prev product-swiper-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </div>
          <div className="product-swiper-button-next product-swiper-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </div>
        </>
      )}
      
      {showPagination && (
        <div className="product-swiper-pagination"></div>
      )}
    </div>
  );
};

export default ProductCarousel; 