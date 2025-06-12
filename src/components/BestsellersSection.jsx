import './BestsellersSection.css';

const BestsellersSection = ({ products, loading }) => {
  return (
    <section className="bestsellers-section">
      <div className="bestsellers-container">
        {loading ? (
          <div className="bestsellers-loading">Loading...</div>
        ) : (
          <div className="bestsellers-grid">
            {/* Intro Card */}
            <div className="bestseller-intro-card">
              <span className="bestseller-featured-label">FEATURED ITEMS</span>
              <h2>Top 10 Bestsellers of This Week</h2>
              <p>
                Looking for the latest and greatest in electronics? Look no further than our Top 10 Bestsellers of the week! Our expertly curated selection features the hottest gadgets and devices flying off the shelves.
              </p>
              <button>Shop More</button>
            </div>
            {/* Product Cards */}
            {products.map(product => (
              <div className="bestseller-card" key={product.id}>
                {product.discountPercentage > 0 && (
                  <span className="bestseller-badge">Sale</span>
                )}
                <div className="bestseller-img-wrap">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="bestseller-meta">
                  <span className="bestseller-stock">STOCK/BRAND</span>
                  <span className="bestseller-brand">{product.brand || product.category}</span>
                </div>
                <h3>{product.title}</h3>
                <div className="bestseller-prices">
                  <span className="bestseller-price">${product.price}</span>
                  {product.discountPercentage > 0 && (
                    <span className="bestseller-old-price">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                <button className="add-to-cart-btn">
                  <svg viewBox="0 0 20 20"><path d="M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.333 14h7.334a2 2 0 0 0 1.98-1.735l1-7A2 2 0 0 0 15.667 3H4.333l-.2-1.2A1 1 0 0 0 3.15 1H1a1 1 0 0 0 0 2h1.18l1.6 9.6A2 2 0 0 0 5.667 14zm7.334-9a1 1 0 0 1 .995 1.1l-1 7a1 1 0 0 1-.995.9H7.333a1 1 0 0 1-.995-.9L5.34 5h9.327z"/></svg>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestsellersSection;