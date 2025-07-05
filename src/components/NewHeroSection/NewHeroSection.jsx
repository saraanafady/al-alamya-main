import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay, Mousewheel, Keyboard, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import './NewHeroSection.css';

const NewHeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products?limit=8&skip=0');
        const data = await response.json();
        setHeroProducts(data.products);
      } catch (error) {
        console.error('Error fetching hero products:', error);
        setHeroProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const getDiscountedPrice = (product) => ((product.discountPercentage > 0)
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price
  );

  if (loading) {
    return (
      <section className="new-hero-section">
        <div className="new-hero-container">
          <div className="new-hero-loading">
            <div className="new-hero-loading-spinner"></div>
            <p>{t('common.loading') || 'Loading...'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="new-hero-section">
      <div className="new-hero-container">
        <div className="new-hero-left">
          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards, Autoplay, Mousewheel, Keyboard, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            mousewheel={{ enabled: true }}
            keyboard={{ enabled: true }}
            pagination={{
              clickable: true,
              renderBullet: (index, className) => `<span class="${className} new-hero-pagination-bullet"></span>`,
            }}
            speed={800}
            slidesPerView={1}
            watchSlidesProgress={true}
            onSlideChange={(swiper) => console.log('Slide changed to:', swiper.activeIndex)}
          >
            {heroProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div onClick={() => handleProductClick(product)} className="new-hero-card">
                  <div className="new-hero-card-image">
                    <img src={product.thumbnail} alt={product.title} loading="lazy" />
                    {product.discountPercentage > 0 && (
                      <div className="new-hero-discount-badge">-{Math.round(product.discountPercentage)}%</div>
                    )}
                  </div>
                  <div className="new-hero-card-content">
                    <div className="new-hero-card-brand">
                      {product.brand || product.category}
                    </div>
                    <h3>{product.title}</h3>
                    <div className="new-hero-card-rating">
                      <div className="new-hero-stars">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`new-hero-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                            width="14" 
                            height="14" 
                            viewBox="0 0 14 14" 
                            fill="none"
                          >
                            <path d="M7 1L8.545 4.13L12 4.635L9.5 7.07L10.09 10.5L7 8.885L3.91 10.5L4.5 7.07L2 4.635L5.455 4.13L7 1Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="new-hero-rating-text">({product.rating})</span>
                    </div>
                    <div className="new-hero-card-price">
                      <span className="new-hero-current-price">
                        ${getDiscountedPrice(product)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="new-hero-original-price">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="new-hero-right">
          <div className="new-hero-content">
            <h1>Discover Premium <span>Electronics</span></h1>
            <p>Explore our curated collection of cutting-edge technology and premium electronics. From smartphones to smart devices, find everything you need.</p>
            <button onClick={() => navigate('/products')} aria-label="Shop Now">
              {t('hero.shopNow') || 'Shop Now'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection; 