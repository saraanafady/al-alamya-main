import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TechSection.css';
import labtop from '../assets/images/labtop.png';
import lab2 from '../assets/images/lab2.png';
import lab3 from '../assets/images/lab3.png';

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
    <section className="tech-section">
      <div
        className="tech-banner"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="tech-overlay" />
        <div className="tech-info">
          <span className="tech-subtitle">{t('recommendations.new')}</span>
          <h2>{t('hero.title')}</h2>
          <p>{t('hero.subtitle')}</p>
          <button>{t('hero.shopNow')}</button>
        </div>
        <div className="tech-carousel-dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`dot${current === idx ? ' active' : ''}`}
              onClick={() => goToSlide(idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection; 