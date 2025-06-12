import { useState } from 'react';
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
  const [current, setCurrent] = useState(0);

  const goToSlide = idx => setCurrent(idx);
  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <section className="tech-section">
      <div
        className="tech-banner"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="tech-overlay" />
        <div className="tech-info">
          <span className="tech-subtitle">NEW ARRIVALS</span>
          <h2>Experience the Future with Our New Tech Arrivals</h2>
          <p>Latest tech arrivals to embark on an exciting digital journey today.</p>
          <button>Shop Now</button>
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