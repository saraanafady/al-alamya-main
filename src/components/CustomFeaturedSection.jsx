import './FeaturedSection.css';
import headphone2 from '../assets/images/headphone2.png';

const CustomFeaturedSection = () => {
  return (
    <section className="featured-section">
      <div className="featured-content">
        <div className="featured-image">
          <img src={headphone2} alt="Immerse Yourself in Your Music" />
        </div>
        <div className="featured-info">
          <span style={{ color: '#00c853', fontWeight: 600, fontSize: '0.95rem' }}>IN STOCK NOW</span>
          <h2>Immerse Yourself in Your Music</h2>
          <p>Elevate your audio experience with rich and powerful sound, seamlessly blending style and substance.</p>
          <div className="featured-product-card" style={{ background: '#f7f7f7', borderRadius: '8px', padding: '1rem', margin: '2rem 0 0 0', display: 'flex', alignItems: 'center', maxWidth: '420px' }}>
            <img src={headphone2} alt="Harmony Bookshelf Speaker" style={{ width: 40, height: 40, borderRadius: 6, marginRight: 16 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>STOCKMART</span><br />
              <span style={{ fontWeight: 600 }}>Harmony Bookshelf Speaker</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>$215.00</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomFeaturedSection; 