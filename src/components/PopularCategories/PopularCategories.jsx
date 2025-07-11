import { useTranslation } from 'react-i18next';
import cat1 from '../../assets/images/cat1.png';
import cat2 from '../../assets/images/cat2.png';
import cat3 from '../../assets/images/cat3.png';
import cat4 from '../../assets/images/cat4.png';
import cat5 from '../../assets/images/cat5.png';
import cat6 from '../../assets/images/cat6.png';

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
    <section className="py-8 px-4 sm:py-10 sm:px-8 md:py-12 md:px-12 max-w-[1200px] mx-auto w-full box-border my-12 overflow-x-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">{t('categories.title')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10 w-full box-border">
        {categories.map((cat, idx) => (
          <div
            className="relative flex flex-col items-center p-6 sm:p-8 md:p-10 rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] border border-slate-200 dark:border-slate-700 transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
            key={idx}
          >
            {/* Top gradient bar on hover */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <img
              src={cat.img}
              alt={cat.label}
              className="w-full max-w-[120px] max-h-[120px] sm:max-w-[140px] sm:max-h-[140px] object-contain mb-4 rounded-xl bg-blue-50 dark:bg-slate-900 p-4 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white text-center leading-tight">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories; 