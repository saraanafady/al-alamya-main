import { useTranslation } from 'react-i18next';
import playstation2 from '../assets/images/playstation2.png';
import girdSec from '../assets/images/girdSec.png';
import './PromotionalBanners.css';

const CustomPromoSection = () => {
  const { t } = useTranslation();

const customBanners = [
  {
    bg: playstation2,
      title: t('promos.gaming.title'),
      desc: t('promos.gaming.description'),
      btn: t('hero.shopNow'),
      price: t('promos.gaming.price'),
  },
  {
    bg: girdSec,
      title: t('promos.smartwatch.title'),
      desc: t('promos.smartwatch.description'),
      btn: t('hero.shopNow'),
  },
];

  return (
  <section className="custom-promo-section">
    <div className="custom-promo-grid">
      {customBanners.map((banner, idx) => (
        <div
          className="custom-promo-banner"
          key={idx}
          style={{ backgroundImage: `url(${banner.bg})` }}
        >
          <div className="custom-promo-content">
            <h2>{banner.title}</h2>
            <p>{banner.desc}</p>
            <button>{banner.btn}</button>
            {banner.price && <span className="custom-promo-price">{banner.price}</span>}
          </div>
        </div>
      ))}
    </div>
  </section>
);
};

export default CustomPromoSection; 