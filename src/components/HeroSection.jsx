import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-main-banner">
        <div className="hero-main-content">
          <span className="hero-label">IN STOCK NOW</span>
          <h2>Upgrade Your Tech Game</h2>
          <p>Find your perfect phone — sleek and stylish or budget-friendly.</p>
          <button>Shop Now</button>
        </div>
      </div>
      <div className="hero-side-banners">
        <div className="hero-side-banner game">
          <span className="hero-label">GAMING</span>
          <h3>Discover ideal gaming solutions</h3>
        </div>
        <div className="hero-side-banner headphones">
          <span className="hero-label">HEADPHONES</span>
          <h3>Hear the Difference</h3>
        </div>
        <div className="hero-side-banner smartwatches">
          <span className="hero-label">SMART WATCHES</span>
          <h3>Experience the Latest Technology</h3>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 