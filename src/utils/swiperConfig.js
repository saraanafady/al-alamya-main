// Common Swiper configurations for different use cases

export const swiperConfigs = {
  // Hero/Banner carousel with fade effect
  hero: {
    spaceBetween: 0,
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    loop: true,
    speed: 800,
  },

  // Product carousel - responsive grid
  products: {
    spaceBetween: 16,
    slidesPerView: 1,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    loop: false,
    speed: 600,
    breakpoints: {
      480: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
    },
  },

  // Category carousel - horizontal scroll
  categories: {
    spaceBetween: 12,
    slidesPerView: 'auto',
    freeMode: true,
    loop: false,
    speed: 400,
    breakpoints: {
      480: {
        spaceBetween: 16,
      },
      768: {
        spaceBetween: 20,
      },
    },
  },

  // Testimonials/Reviews carousel
  testimonials: {
    spaceBetween: 24,
    slidesPerView: 1,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    loop: true,
    speed: 800,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
  },

  // Image gallery/thumbnails
  gallery: {
    spaceBetween: 8,
    slidesPerView: 4,
    loop: false,
    speed: 400,
    breakpoints: {
      480: {
        slidesPerView: 5,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 6,
        spaceBetween: 16,
      },
    },
  },

  // Promotional banners
  promos: {
    spaceBetween: 16,
    slidesPerView: 1,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false,
    },
    loop: true,
    speed: 600,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
    },
  },
};

// Navigation configuration
export const navigationConfig = {
  prevEl: '.swiper-button-prev',
  nextEl: '.swiper-button-next',
};

// Pagination configurations
export const paginationConfigs = {
  dots: {
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 3,
  },
  
  bullets: {
    clickable: true,
    renderBullet: (index, className) => {
      return `<span class="${className}"></span>`;
    },
  },
  
  fraction: {
    type: 'fraction',
  },
  
  progressbar: {
    type: 'progressbar',
  },
};

// RTL helper function
export const getRTLConfig = (isRTL) => ({
  dir: isRTL ? 'rtl' : 'ltr',
});

// Combine configs helper
export const createSwiperConfig = (baseConfig, customConfig = {}, isRTL = false) => {
  return {
    ...baseConfig,
    ...customConfig,
    ...getRTLConfig(isRTL),
  };
}; 