import './GuidesSection.css';
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
  <section className="guides-section">
    <div className="guides-header-row">
      <div className="guides-header">
          <span className="guides-subtitle">{t('guides.subtitle')}</span>
          <h2>{t('guides.title')}</h2>
      </div>
        <button className="guides-viewall-btn">{t('common.viewAll')}</button>
    </div>
    <div className="guides-grid">
      {guides.map((guide, idx) => (
        <div className="guide-card" key={idx}>
          <span className="guide-icon orange-icon">{guide.icon}</span>
          <span className="guide-title black-title">{guide.title}</span>
            <a href="#" className="guide-readmore">{t('guides.readMore')}</a>
        </div>
      ))}
    </div>
  </section>
);
};

export default GuidesSection; 