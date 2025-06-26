import './PopularCategories.css';
import { useTranslation } from 'react-i18next';
import cat1 from '../assets/images/cat1.png';
import cat2 from '../assets/images/cat2.png';
import cat3 from '../assets/images/cat3.png';
import cat4 from '../assets/images/cat4.png';
import cat5 from '../assets/images/cat5.png';
import cat6 from '../assets/images/cat6.png';

const PopularCategories = () => {
  const { t } = useTranslation();

const categories = [
    { img: cat1, label: t('navigation.headphones') },
    { img: cat2, label: t('navigation.phones') },
    { img: cat3, label: t('navigation.speakers') },
    { img: cat4, label: t('navigation.smartwatches') },
    { img: cat5, label: t('navigation.gaming') },
    { img: cat6, label: t('navigation.laptops') },
];

  return (
  <section className="popular-categories-section">
      <h2 className="popular-categories-title">{t('categories.title')}</h2>
      <div className="categories-grid">
      {categories.map((cat, idx) => (
        <div className="category-card" key={idx}>
          <img src={cat.img} alt={cat.label} className="category-img" />
          <span className="category-label">{cat.label}</span>
        </div>
      ))}
    </div>
  </section>
);
};

export default PopularCategories; 