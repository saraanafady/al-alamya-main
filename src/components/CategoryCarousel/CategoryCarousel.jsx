import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

import { swiperConfigs, createSwiperConfig } from '../../utils/swiperConfig';
import './CategoryCarousel.css';

const CategoryCarousel = ({ 
  categories, 
  activeCategory, 
  onCategoryClick,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const swiperConfig = createSwiperConfig(
    swiperConfigs.categories,
    {},
    isRTL
  );

  return (
    <div className={`category-carousel ${className}`}>
      <Swiper
        modules={[FreeMode]}
        {...swiperConfig}
        className="category-swiper"
      >
        {categories.map(category => (
          <SwiperSlide key={category.id} className="category-slide">
            <button
              className={`category-carousel-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryClick?.(category.id)}
            >
              {category.icon && (
                <span className="category-carousel-icon">{category.icon}</span>
              )}
              <span className="category-carousel-label">{category.label}</span>
              {activeCategory === category.id && (
                <div className="category-active-indicator"></div>
              )}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryCarousel; 