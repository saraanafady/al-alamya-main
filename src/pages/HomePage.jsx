import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
// import CustomPromoSection from '../components/CustomPromoSection';
import BestsellersSection from '../components/BestsellersSection';
import GuidesSection from '../components/GuidesSection';
import PromotionalBanners from '../components/PromotionalBanners';
import ServicesSection from '../components/ServicesSection';
import FeaturedSection from '../components/FeaturedSection';
import RecommendationsSection from '../components/RecommendationsSection';
import TechSection from '../components/TechSection';
import PopularCategories from '../components/PopularCategories';
// import BlogSection from '../components/BlogSection';
// import FAQSection from '../components/FAQSection';


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  return (
    <div>

      <HeroSection />
      {/* <CustomPromoSection /> */}
      <BestsellersSection products={products.slice(0, 10)} loading={loading} />
      <GuidesSection />
      <PromotionalBanners />
      <ServicesSection />
      <FeaturedSection product={products[0]} loading={loading} />
      <RecommendationsSection products={products.slice(10, 20)} loading={loading} />
      <TechSection />
      <PopularCategories />
      {/* <BlogSection /> */}
      {/* <FAQSection /> */}
    
    </div>
  );
};

export default HomePage; 