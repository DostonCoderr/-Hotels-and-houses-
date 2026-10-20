'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const { t } = useTranslation(); // ✅ Hook

  if (!open) return null;

  return (
    <div className="mobile-menu on">
      <div className="mobile-menu-back" onClick={onClose} />
      <div className="mobile-menu-body">
        <button className="mobile-close" onClick={onClose}>✕</button>
        <div className="mobile-menu-head">
          <div className="lg">ЭТАЖ<b>И</b></div>
          <div className="mobile-menu-sub">{t('mobile_menu_sub')}</div>
        </div>
        <div className="mobile-menu-list">
          <Link href="/novostroyki" onClick={onClose}>{t('mobile_menu_novostroyki')}</Link>
          <Link href="/stroitelstvo" onClick={onClose}>{t('mobile_menu_stroitelstvo')}</Link>
          <Link href="/commercial" onClick={onClose}>{t('mobile_menu_commercial')}</Link>
          <Link href="/" onClick={onClose}>{t('mobile_menu_home')}</Link>
          <a onClick={onClose}>{t('mobile_menu_consult')}</a>
        </div>
        <div className="mobile-menu-footer">
          <a href="tel:+78005553535">8 800 555-35-35</a>
          <div className="mobile-menu-social">
            <a href="#">TG</a><a href="#">VK</a><a href="#">WA</a>
          </div>
        </div>
      </div>
    </div>
  );
}