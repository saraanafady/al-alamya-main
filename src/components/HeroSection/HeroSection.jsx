import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import './HeroSection.css';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products for hero slider
        const response = await fetch('https://dummyjson.com/products?limit=4&skip=0');
        const data = await response.json();
        setHeroProducts(data.products);
      } catch (error) {
        console.error('Error fetching hero products:', error);
        // Fallback to empty array if fetch fails
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

  const getDiscountedPrice = (product) => {
    if (product.discountPercentage > 0) {
      return (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
    }
    return product.price;
  };

  if (loading) {
    return (
      <section className="hero-section">
        <div className="hero-main-banner-container">
          <div className="hero-loading">
            <div className="hero-loading-spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
        <div className="hero-side-banners">
          <div className="hero-side-banner game">
            <span className="hero-label">{t('navigation.gaming')}</span>
            <h3>{t('hero.subtitle')}</h3>
          </div>
          <div className="hero-side-banner headphones">
            <span className="hero-label">{t('navigation.headphones')}</span>
            <h3>{t('featured.description')}</h3>
          </div>
          <div className="hero-side-banner smartwatches">
            <span className="hero-label">{t('navigation.smartwatches')}</span>
            <h3>{t('hero.subtitle')}</h3>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      <div className="hero-main-banner-container">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            el: '.hero-swiper-pagination',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} hero-pagination-bullet"></span>`;
            },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          loop={true}
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          className="hero-swiper"
        >
          {heroProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div 
                className="hero-main-banner hero-product-slide"
                style={{ backgroundImage: `url(${product.thumbnail})` }}
                onClick={() => handleProductClick(product)}
              >
                <div className="hero-main-content">
                  <span className="hero-label">{product.brand || t('featured.inStockNow')}</span>
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <div className="hero-product-info">
                    <div className="hero-price-section">
                      <span className="hero-current-price">
                        {t('common.currency')}{getDiscountedPrice(product)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <>
                          <span className="hero-original-price">
                            {t('common.currency')}{product.price}
                          </span>
                          <span className="hero-discount-badge">
                            -{Math.round(product.discountPercentage)}%
                          </span>
                        </>
                      )}
                    </div>
                    <div className="hero-rating">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L10.472 5.236L15.528 6.472L11.764 10.236L12.944 15.292L8 13.236L3.056 15.292L4.236 10.236L0.472 6.472L5.528 5.236L8 1Z" fill="#FFC107"/>
                      </svg>
                      <span>{product.rating}</span>
                      <span>({Math.floor(Math.random() * 500) + 50} {t('productDetails.reviews.basedOn_plural', { count: Math.floor(Math.random() * 500) + 50 }).split(' ')[2]})</span>
                    </div>
                  </div>
                  <button className="hero-shop-btn">{t('hero.shopNow')}</button>
                </div>
                
                {/* Product Image Overlay */}
                <div className="hero-product-image">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Pagination */}
          <div className="hero-swiper-pagination"></div>
        </Swiper>
      </div>
      
      <div className="hero-side-banners">
        <div className="hero-side-banner game">
          <span className="hero-label">{t('navigation.gaming')}</span>
          <h3>{t('hero.subtitle')}</h3>
        </div>
        <div className="hero-side-banner headphones">
          <span className="hero-label">{t('navigation.headphones')}</span>
          <h3>{t('featured.description')}</h3>
        </div>
        <div className="hero-side-banner smartwatches">
          <span className="hero-label">{t('navigation.smartwatches')}</span>
          <h3>{t('hero.subtitle')}</h3>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 