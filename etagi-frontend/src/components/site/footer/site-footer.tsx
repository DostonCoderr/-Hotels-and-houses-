'use client'; // ✅ Hook ishlatish uchun

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

export function SiteFooter() {
  const { t } = useTranslation(); // ✅ Hook

  return (
    <footer className="ft-footer">
      <div className="w">
        <div className="ft-top">
          {/* Brand */}
          <div className="ft-brand">
            <div className="lg">ЭТАЖ<b>И</b></div>
            <p className="mu">
              {t('footer_desc')}
            </p>
            <div className="ft-social">
              <a href="#" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 3L2 10.5l6 2 1.5 6.5 3-4 5.5 4z" /></svg>
              </a>
              <a href="#" aria-label="VK">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 17c-5 0-8-3.4-8.2-9h2.6c.1 4 1.8 5.7 3.2 6V8h2.5v3.6c1.4-.2 2.8-1.7 3.3-3.6h2.5c-.4 2.2-1.9 3.7-3 4.4 1.1.5 2.8 1.8 3.5 4.6h-2.8c-.5-1.6-1.8-2.8-3.5-3v3z" /></svg>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1 4 4.1-1A10 10 0 1012 2zm5.5 14c-.2.7-1.3 1.3-1.8 1.4-.5.1-1 .2-3-.6-2.4-1-4-3.5-4.1-3.7-.1-.2-1-1.4-1-2.6s.6-1.8.9-2c.2-.3.4-.3.6-.3h.4c.1 0 .3 0 .5.4.2.4.7 1.6.8 1.7.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.3-.2.6-.1.2.1 1.5.7 1.7.9.3.1.4.2.5.3.1.1.1.6-.1 1.2z" /></svg>
              </a>
            </div>
          </div>

          {/* Недвижимость */}
          <div className="ft-col">
            <h4>{t('footer_col_realty')}</h4>
            <Link href="/novostroyki">{t('footer_link_novostroyki')}</Link>
            <Link href="/stroitelstvo">{t('footer_link_houses')}</Link>
            <Link href="/commercial">{t('footer_link_commercial')}</Link>
            <a href="#">{t('footer_link_cottages')}</a>
            <a href="#">{t('footer_link_garages')}</a>
          </div>

          {/* Услуги */}
          <div className="ft-col">
            <h4>{t('footer_col_services')}</h4>
            <a href="#">{t('footer_link_mortgage')}</a>
            <a href="#">{t('footer_link_valuation')}</a>
            <a href="#">{t('footer_link_legal')}</a>
            <a href="#">{t('footer_link_construction')}</a>
            <a href="#">{t('footer_link_design')}</a>
          </div>

          {/* Компания */}
          <div className="ft-col">
            <h4>{t('footer_col_company')}</h4>
            <a href="#">{t('footer_link_about')}</a>
            <a href="#">{t('footer_link_team')}</a>
            <a href="#">{t('footer_link_careers')}</a>
            <a href="#">{t('footer_link_reviews')}</a>
            <a href="#">{t('footer_link_contacts')}</a>
          </div>

          {/* Контакты */}
          <div className="ft-col">
            <h4>{t('footer_col_contacts')}</h4>
            <a href="tel:+78005553535" className="ft-phone">8 800 555-35-35</a>
            <a href="mailto:info@etagi.ru">info@etagi.ru</a>
            <span className="mu">{t('footer_address')}</span>
            <span className="mu">{t('footer_hours')}</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="ft-bot">
          <span>{t('footer_copyright')}</span>
          <div className="ft-links">
            <a href="#">{t('footer_privacy')}</a>
            <a href="#">{t('footer_offer')}</a>
            <a href="#">{t('footer_sitemap')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}