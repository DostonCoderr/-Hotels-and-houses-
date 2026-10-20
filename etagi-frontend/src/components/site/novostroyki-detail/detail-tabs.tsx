'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

export function DetailTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');

  // ✅ TABS komponent ichida — chunki t() hook natijasi
  const TABS: { id: string; key: TranslationKey; target: string }[] = [
    { id: 'about', key: 'nzd_tab_about', target: 'nzdAboutSection' },
    { id: 'flats', key: 'nzd_tab_flats', target: 'nzdPickSection' },
    { id: 'features', key: 'nzd_tab_features', target: 'nzdFeaturesSection' },
    { id: 'description', key: 'nzd_tab_description', target: 'nzdDescriptionSection' },
    { id: 'progress', key: 'nzd_tab_progress', target: 'nzdProgressSection' },
    { id: 'mortgage', key: 'nzd_tab_mortgage', target: 'nzdMortgageSection' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const pos = window.scrollY + 150;
      let current = TABS[0].id;
      for (const tab of TABS) {
        const el = document.getElementById(tab.target);
        if (el && el.offsetTop <= pos) {
          current = tab.id;
        }
      }
      setActiveTab(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="nzd-nav">
      <div className="w">
        <div className="nzd-nav-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nzd-nav-link ${activeTab === tab.id ? 'on' : ''}`}
              onClick={() => scrollTo(tab.target)}
            >
              {t(tab.key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}