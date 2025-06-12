import './ServicesSection.css';
import React from 'react';

const services = [
  { icon: '🚚', title: 'Free Shipping & Returns', desc: 'On all orders over $50.' },
  { icon: '💸', title: 'Money Back Guarantee', desc: '30-day money back guarantee.' },
  { icon: '💬', title: 'Online Support 24/7', desc: 'Friendly 24/7 customer support.' },
  {icon: '💳', title: 'Regular Sales', desc: 'Secure payment methods.'},
];

const ServicesSection = () => (
  <section className="services-section">
    <div className="services-grid">
      {services.map((service, idx) => (
        <React.Fragment key={service.title}>
          <div className="service-card">
            <span className="service-icon" style={{ color: '#ff6a00', fontSize: '2rem' }}>{service.icon}</span>
            <div>
              <h4 style={{ fontWeight: 700 }}>{service.title}</h4>
              <p>{service.desc}</p>
            </div>
          </div>
          {idx !== services.length - 1 && <div className="service-divider" />}
        </React.Fragment>
      ))}
    </div>
  </section>
);

export default ServicesSection; 