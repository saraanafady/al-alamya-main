import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FeaturedSection.css';
import headphone2 from '../assets/images/headphone2.png';

const FeaturedSection = ({ product, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleProductClick = () => {
    if (product) {
      navigate(`/product/${product.id}`);
    }
  };

  if (loading) {
    return (
      <section className="featured-section">
        <div className="featured-loading">{t('common.loading')}</div>
      </section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section className="featured-section">
      <div className="featured-content">
        <div 
          className="featured-image"
          onClick={handleProductClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={product.thumbnail || headphone2} alt={product.title || "Featured Product"} />
        </div>
        <div className="featured-info">
          <div className="featured-info-inner">
            <span className="featured-stock-status">{t('featured.inStockNow')}</span>
            <h2>{product.title || "Featured Product"}</h2>
            <p>{product.description || t('featured.description')}</p>
            <div 
              className="featured-product-card" 
              onClick={handleProductClick}
              style={{ 
                background: '#f7f7f7', 
                borderRadius: '8px', 
                padding: '1rem', 
                margin: '2rem 0 0 0', 
                display: 'flex', 
                alignItems: 'left', 
                maxWidth: '420px',
                cursor: 'pointer'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 6, marginRight: 16, background: '#e0e0e0' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="7" width="18" height="14" rx="3" fill="#888"/>
                  <circle cx="12" cy="14" r="4" fill="#fff"/>
                  <rect x="8" y="3" width="8" height="4" rx="2" fill="#888"/>
                  <circle cx="12" cy="14" r="2" fill="#888"/>
                </svg>
              </span>
              <div style={{ flex: 1, justifyContent: 'left', alignItems: 'left' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{product.brand || 'STOCKMART'}</span><br />
                <span style={{ fontWeight: 600 }}>{product.title || 'Featured Product'}</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{t('common.currency')}{product.price || '215.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection; 