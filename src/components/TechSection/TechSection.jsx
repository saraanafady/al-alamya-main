import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import labtop from '../../assets/images/labtop.png';
import lab2 from '../../assets/images/lab2.png';
import lab3 from '../../assets/images/lab3.png';

const slides = [
  { image: labtop },
  { image: lab2 },
  { image: lab3 },
];

const TechSection = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevCurrent) => (prevCurrent + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const goToSlide = (idx) => {
    setCurrent(idx);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  return (
    <section className="my-12">
      <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.15)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[450px] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(37,99,235,0.2)] transition-all duration-300">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 via-slate-900/60 to-slate-900/80" />
        
        {/* Content */}
        <div className="relative z-10 p-12 flex items-end justify-start min-h-[450px]">
          <div className="text-white max-w-lg">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase opacity-90 mb-4 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full">
              {t('recommendations.new')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-shadow-lg">
              {t('hero.title')}
            </h2>
            <p className="text-lg mb-8 text-white/90 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <button className="bg-white/90 hover:bg-white text-blue-600 dark:text-blue-500 border-none px-8 py-4 rounded-full cursor-pointer font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 uppercase tracking-wide">
              {t('hero.shopNow')}
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-8 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-md"
        >
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-8 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-md"
        >
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 right-12 z-20 flex gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-8 h-8 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-md shadow-lg ${
                current === idx 
                  ? 'bg-blue-600 scale-110 shadow-[0_4px_20px_rgba(37,99,235,0.3)]' 
                  : 'bg-white/80 hover:bg-white/95 hover:scale-110 opacity-70 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection; 