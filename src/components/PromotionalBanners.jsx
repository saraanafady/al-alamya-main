import playstation2 from '../assets/images/playstation2.png';
import girdSec from '../assets/images/girdSec.png';
import './PromotionalBanners.css';

const customBanners = [
  {
    bg: playstation2,
    title: 'Crash high scores',
    desc: 'Designed for comfort and precision, our controller allows you to play your favorite games on your phone with ease.',
    btn: 'Shop Now',
    price: 'From $245',
  },
  {
    bg: girdSec,
    title: 'Swap styles in a snap',
    desc: 'Swap your style on the go with our smartwatches – change your look in seconds with customizable watch faces and bands, perfect for any occasion.',
    btn: 'Shop Now',
  },
];

const CustomPromoSection = () => (
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

export default CustomPromoSection; 