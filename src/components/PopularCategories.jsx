import './PopularCategories.css';
import cat1 from '../assets/images/cat1.png';
import cat2 from '../assets/images/cat2.png';
import cat3 from '../assets/images/cat3.png';
import cat4 from '../assets/images/cat4.png';
import cat5 from '../assets/images/cat5.png';
import cat6 from '../assets/images/cat6.png';

const categories = [
  { img: cat1, label: 'Headphones' },
  { img: cat2, label: 'Phones' },
  { img: cat3, label: 'Speakers' },
  { img: cat4, label: 'Smart Watches' },
  { img: cat5, label: 'Gaming' },
  { img: cat6, label: 'Laptops' },
];

const PopularCategories = () => (
  <section className="popular-categories-section">
    <h2 className="popular-categories-title">Popular Categories</h2>
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

export default PopularCategories; 