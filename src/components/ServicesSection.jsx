import './ServicesSection.css';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ServicesSection = () => {
  const { t } = useTranslation();

const services = [
    { icon: '🚚', title: t('services.freeShipping.title'), desc: t('services.freeShipping.description') },
    { icon: '💸', title: t('services.returns.title'), desc: t('services.returns.description') },
    { icon: '💬', title: t('services.support.title'), desc: t('services.support.description') },
    { icon: '💳', title: t('services.warranty.title'), desc: t('services.warranty.description') },
];

  return (
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
};

export default ServicesSection; 