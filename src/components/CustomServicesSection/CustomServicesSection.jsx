import './ServicesSection.css';

const customServices = [
  {
    icon: '🚚',
    title: 'Free Shipping & Returns',
    desc: 'Shop with confidence and have your favorite electronics delivered right to your doorstep without any additional cost.',
  },
  {
    icon: '💸',
    title: 'Money Back Guarantee',
    desc: "If you're not completely satisfied with your purchase, we'll make it right. No questions asked.",
  },
  {
    icon: '💬',
    title: 'Online Support 24/7',
    desc: "Need help with your electronics? Get in touch with us anytime, anywhere, and let's get your tech sorted.",
  },
  {
    icon: '%',
    title: 'Regular Sales',
    desc: "Don't miss out on our amazing deals with regular sales on our top-of-the-line electronics.",
  },
];

const CustomServicesSection = () => (
  <section className="services-section">
    <div className="services-grid">
      {customServices.map((service, idx) => (
        <>
          <div className="service-card" key={service.title}>
            <span className="service-icon" style={{ color: '#ff6a00', fontSize: '2rem' }}>{service.icon}</span>
            <div>
              <h4 style={{ fontWeight: 700 }}>{service.title}</h4>
              <p>{service.desc}</p>
            </div>
          </div>
          {idx !== customServices.length - 1 && <div className="service-divider" />}
        </>
      ))}
    </div>
  </section>
);

export default CustomServicesSection; 