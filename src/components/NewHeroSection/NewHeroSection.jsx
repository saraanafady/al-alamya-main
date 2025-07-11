import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay, Mousewheel, Keyboard, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

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
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">{t('common.loading') || 'Loading...'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
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
            className="w-full max-w-sm mx-auto"
          >
            {heroProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div 
                  onClick={() => handleProductClick(product)} 
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 border border-slate-200 dark:border-slate-700"
                >
                  <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 p-6 h-64 flex items-center justify-center">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title} 
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        -{Math.round(product.discountPercentage)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wide mb-2">
                      {product.brand || product.category}
                    </div>
                    
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-3 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                            width="14" 
                            height="14" 
                            viewBox="0 0 14 14" 
                            fill="none"
                          >
                            <path d="M7 1L8.545 4.13L12 4.635L9.5 7.07L10.09 10.5L7 8.885L3.91 10.5L4.5 7.07L2 4.635L5.455 4.13L7 1Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                        ({product.rating})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${getDiscountedPrice(product)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-lg text-slate-500 dark:text-slate-400 line-through">
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
        
        <div className="text-center lg:text-left">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Discover Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Electronics</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Explore our curated collection of cutting-edge technology and premium electronics. From smartphones to smart devices, find everything you need.
            </p>
            
            <button 
              onClick={() => navigate('/products')} 
              aria-label="Shop Now"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {t('hero.shopNow') || 'Shop Now'}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .new-hero-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .new-hero-pagination-bullet:hover {
          background: rgba(59, 130, 246, 0.6);
          transform: scale(1.2);
        }
        
        .new-hero-pagination-bullet.swiper-pagination-bullet-active {
          background: rgba(59, 130, 246, 0.9);
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
};

export default NewHeroSection; 