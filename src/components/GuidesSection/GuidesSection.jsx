import { useTranslation } from 'react-i18next';

const GuidesSection = () => {
  const { t } = useTranslation();

  const guides = [
    { icon: '🎮', title: t('guides.items.gamingSetup.title'), desc: t('guides.items.gamingSetup.description') },
    { icon: '📱', title: t('guides.items.smartHome.title'), desc: t('guides.items.smartHome.description') },
    { icon: '🎧', title: t('guides.items.choosingHeadphones.title'), desc: t('guides.items.choosingHeadphones.description') },
    { icon: '🛠️', title: t('guides.items.gamingSetup.title'), desc: t('guides.items.gamingSetup.description') },
    { icon: '⚡', title: t('guides.items.smartHome.title'), desc: t('guides.items.smartHome.description') },
    { icon: '📱', title: t('guides.items.choosingHeadphones.title'), desc: t('guides.items.choosingHeadphones.description') },
  ];

  return (
    <section className="my-12 px-4 max-w-7xl mx-auto w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-1 rounded-full w-fit">
            {t('guides.subtitle')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {t('guides.title')}
          </h2>
        </div>
        <button className="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto">
          {t('common.viewAll')}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, idx) => (
          <div 
            key={idx} 
            className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 flex flex-col gap-6 min-h-[220px] hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] transition-all duration-300 group"
          >
            {/* Accent Bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl flex items-center justify-center text-4xl">
              {guide.icon}
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg sm:text-xl leading-relaxed line-clamp-3 flex-grow">
              {guide.title}
            </h3>
            
            {/* Read More Link */}
            <a 
              href="#" 
              className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide inline-flex items-center gap-3 py-3 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:translate-x-1"
            >
              {t('guides.readMore')}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuidesSection; 