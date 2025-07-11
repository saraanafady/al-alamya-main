import { useTranslation } from 'react-i18next';
import playstation2 from '../../assets/images/playstation2.png';
import girdSec from '../../assets/images/girdSec.png';

const PromotionalBanners = () => {
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
    <section className="my-12 w-full box-border overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {customBanners.map((banner, idx) => (
          <div
            key={idx}
            className={`relative flex flex-col justify-end rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.15)] border border-slate-200 dark:border-slate-700 min-h-[350px] h-full transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(37,99,235,0.2)] ${idx === 0 ? 'flex-[2]' : 'flex-1'}`}
            style={{ backgroundImage: `url(${banner.bg})`, backgroundSize: 'cover', backgroundPosition: 'right', backgroundRepeat: 'no-repeat' }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-slate-900/60 z-0" />
            {/* Content */}
            <div className="relative z-10 text-white p-10 pb-8 rounded-b-2xl w-full">
              <h2 className="text-3xl font-bold mb-4 drop-shadow-lg leading-tight">{banner.title}</h2>
              <p className="mb-6 text-lg text-white/90 leading-relaxed drop-shadow-md">{banner.desc}</p>
              <div className="flex items-center flex-wrap gap-4">
                <button className="bg-white/90 text-blue-700 font-semibold px-8 py-3 rounded-full text-base uppercase tracking-wide shadow-lg hover:bg-white hover:text-blue-900 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                  {banner.btn}
                </button>
                {banner.price && <span className="text-white font-bold text-xl drop-shadow-md">{banner.price}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionalBanners; 