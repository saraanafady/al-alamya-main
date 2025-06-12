import './GuidesSection.css';

const guides = [
  { icon: '🎮', title: 'How to Choose the Right Gaming Laptop for Your Needs' },
  { icon: '📱', title: 'The Best Accessories to Enhance Your Smartphone Experience' },
  { icon: '🎧', title: 'The Benefits of Noise-Cancelling Headphones' },
  { icon: '🛠️', title: '10 Tips for Maintaining Your Electronics and Extending Their Lifespan' },
  { icon: '⚡', title: 'The Future of Wearable Technology: What\'s Coming Next?' },
  { icon: '📱', title: '5G Phones: How Will the Latest Network Technology Affect Your Experience?' },
];

const GuidesSection = () => (
  <section className="guides-section">
    <div className="guides-header-row">
      <div className="guides-header">
        <span className="guides-subtitle">HOW TO</span>
        <h2>Guides for Everything You Need</h2>
      </div>
      <button className="guides-viewall-btn">View All Guides</button>
    </div>
    <div className="guides-grid">
      {guides.map((guide, idx) => (
        <div className="guide-card" key={idx}>
          <span className="guide-icon orange-icon">{guide.icon}</span>
          <span className="guide-title black-title">{guide.title}</span>
          <a href="#" className="guide-readmore">Read More</a>
        </div>
      ))}
    </div>
  </section>
);

export default GuidesSection; 