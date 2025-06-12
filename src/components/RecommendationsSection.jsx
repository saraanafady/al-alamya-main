import { useState } from 'react';
import './RecommendationsSection.css';

const categories = [
  'All',
  'Phones',
  'Smart Watches',
  'Gaming',
  'Laptops',
  'Speakers',
];

const RecommendationsSection = ({ products, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <section className="recommendations-section">
      <h2 className="recommendations-title">Recommended for You</h2>
      <div className="recommendations-categories">
        {categories.map(category => (
          <button
            key={category}
            className={`recommendations-category-btn${selectedCategory === category ? ' active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="recommendations-loading">Loading...</div>
      ) : (
        <div className="recommendations-grid">
          {filteredProducts.map(product => (
            <div className="recommendation-card" key={product.id}>
              <div className="recommendation-image-wrapper">
                <img src={product.thumbnail} alt={product.title} className="recommendation-image" />
              </div>
              <div className="recommendation-info">
                <span className="recommendation-brand">STOCKMART</span>
                <span className="recommendation-title">{product.title}</span>
              </div>
              <span className="recommendation-price">${product.price}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendationsSection; 