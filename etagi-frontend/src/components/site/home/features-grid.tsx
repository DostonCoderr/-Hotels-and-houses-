'use client'; // ✅ ENG MUHIM QATOR

import { useTranslation } from '@/lib/i18n';

export function FeaturesGrid() {
  const { t } = useTranslation();

  return (
    <section className="sc">
      <div className="w">
        <div className="ft">
          <div>
            <svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></svg>
            <h3>{t('ft_1')}</h3>
            <span className="mu">{t('ft_1_desc')}</span>
          </div>
          <div>
            <svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7M5 10v10h14V10" /></svg>
            <h3>{t('ft_2')}</h3>
            <span className="mu">{t('ft_2_desc')}</span>
          </div>
          <div>
            <svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="2.5" /><circle cx="16" cy="16" r="2.5" /><path d="M18 5L6 19" /></svg>
            <h3>{t('ft_3')}</h3>
            <span className="mu">{t('ft_3_desc')}</span>
          </div>
          <div>
            <svg viewBox="0 0 24 24"><path d="M4 20l9-9M12 6l6 6M14 4l6 6-3 3-6-6z" /></svg>
            <h3>{t('ft_4')}</h3>
            <span className="mu">{t('ft_4_desc')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}