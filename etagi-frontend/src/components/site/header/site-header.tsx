'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NavDropdown } from './nav-dropdown';
import { ThemeCustomizer } from './theme-customizer';
import { ThemeToggle } from './theme-toggle';
import { AuthBlock } from './auth-block';
import { MobileMenu } from './mobile-menu';
import { useConsultModal } from '@/components/site/common/consult-modal';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from '@/lib/i18n'; // ✅ Import qildik

export function SiteHeader() {
  const { t } = useTranslation(); // ✅ Hookni chaqirdik
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setConsultOpen = useConsultModal((s) => s.setOpen);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (window.innerWidth < 1024) {
        setHidden(y > lastY && y > 120);
      } else {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header id="hd" className={`${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
        <div className="w">
          <Link href="/" className="lg">Довери<b>Я</b></Link>

          <nav id="mainNav">
            {/* ✅ NOVOSTROYKI */}
            <NavDropdown
              href="/novostroyki"
              label={t('nav_novostroyki')}
              wide
              items={[
                {
                  links: [
                    { href: '/novostroyki', text: t('nav_zhk') || 'Жилые комплексы' },
                    { href: '/novostroyki?rooms=1', text: t('nav_1room') || 'Однокомнатные квартиры' },
                    { href: '/novostroyki?rooms=2', text: t('nav_2room') || 'Двухкомнатные квартиры' },
                    { href: '/novostroyki?rooms=3', text: t('nav_3room') || 'Трехкомнатные квартиры' },
                    { href: '/novostroyki?rooms=4', text: t('nav_4room') || 'Многокомнатные квартиры' },
                    { href: '/novostroyki?rooms=0', text: t('nav_studio') || 'Студии' },
                  ],
                },
                {
                  links: [
                    { href: '/novostroyki', text: t('nav_builders') || 'Застройщики' },
                    { href: '/novostroyki?completion=2025', text: t('nav_2025') || 'Новостройки 2025 год' },
                    { href: '/novostroyki?completion=2026', text: t('nav_2026') || 'Новостройки 2026 год' },
                    { href: '/novostroyki?completion=2027', text: t('nav_2027') || 'Новостройки 2027 год' },
                    { href: '/novostroyki?completion=2028', text: t('nav_2028') || 'Новостройки 2028 год' },
                    { href: '/novostroyki?completion=2029', text: t('nav_2029') || 'Новостройки 2029 год' },
                  ],
                },
                {
                  links: [
                    { href: '/novostroyki?status=completed', text: t('nav_completed') || 'Сданные ЖК' },
                    { href: '/novostroyki?district=center', text: t('nav_center') || 'Новостройки в центре' },
                    { href: '/novostroyki?type=commercial', text: t('nav_commercial_nb') || 'Коммерческие новостройки' },
                    { href: '/novostroyki?promo=true', text: t('nav_promo') || 'Акции и скидки от застройщиков', emoji: '⚡' },
                  ],
                },
                {
                  links: [
                    { href: '/novostroyki?mortgage=family', text: t('nav_family_mort') || 'Успей купить по семейной ипотеке – 6%', emoji: '🔥' },
                    { href: '/novostroyki?payment=installment', text: t('nav_installment') || 'Возможна рассрочка' },
                    { href: '/novostroyki', text: t('nav_about_buy') || 'О покупке новостройки' },
                  ],
                },
              ]}
            />

            {/* ✅ STROITELSTVO */}
            <NavDropdown
              href="/stroitelstvo"
              label={t('nav_stroitelstvo')}
              items={[
                {
                  links: [
                    { href: '/stroitelstvo?category=project', text: t('nav_projects') || 'Проекты домов' },
                    { href: '/stroitelstvo?category=barn', text: t('nav_barn') || 'Барнхаусы' },
                    { href: '/stroitelstvo?category=module', text: t('nav_module') || 'Модульные дома' },
                    { href: '/stroitelstvo?category=frame', text: t('nav_frame') || 'Каркасные дома' },
                    { href: '/stroitelstvo?category=brick', text: t('nav_brick') || 'Кирпичные дома' },
                  ],
                },
                {
                  links: [
                    { href: '/stroitelstvo', text: t('nav_builders_comp') || 'Строительные компании' },
                    { href: '/stroitelstvo', text: t('nav_ready_homes') || 'Готовые дома' },
                    { href: '/stroitelstvo', text: t('nav_land') || 'Земельные участки' },
                    { href: '/stroitelstvo', text: t('nav_calc') || 'Калькулятор стройки' },
                  ],
                },
              ]}
            />

            {/* ✅ COMMERCIAL */}
            <NavDropdown
              href="/commercial"
              label={t('nav_commercial')}
              wide
              items={[
                {
                  title: t('nav_sale') || 'Продажа',
                  links: [
                    { href: '/commercial?type=rented', text: t('nav_rented') || 'С арендатором (ГАБ)', emoji: '🔴' },
                    { href: '/commercial?type=trade', text: t('nav_trade') || 'Торговое помещение' },
                    { href: '/commercial?type=free', text: t('nav_free') || 'Свободное назначение' },
                    { href: '/commercial?type=office', text: t('nav_office') || 'Офис' },
                    { href: '/commercial?type=warehouse', text: t('nav_warehouse') || 'База / Склад / Производство' },
                    { href: '/commercial?type=land', text: t('nav_land_c') || 'Земельные участки' },
                    { href: '/commercial?type=new', text: t('nav_new_c') || 'Коммерческие новостройки' },
                    { href: '/commercial?type=gp', text: t('nav_gp') || 'Готовый бизнес' },
                  ],
                },
                {
                  title: t('nav_rent') || 'Аренда',
                  links: [
                    { href: '/commercial?op=rent&type=trade', text: t('nav_trade') || 'Торговое помещение' },
                    { href: '/commercial?op=rent&type=free', text: t('nav_free') || 'Свободное назначение' },
                    { href: '/commercial?op=rent&type=office', text: t('nav_office') || 'Офис' },
                    { href: '/commercial?op=rent&type=warehouse', text: t('nav_warehouse') || 'База / Склад / Производство' },
                    { href: '/commercial?op=rent&type=land', text: t('nav_land_c') || 'Земля' },
                    { href: '/commercial?op=rent&type=gp', text: t('nav_gp') || 'Готовый бизнес' },
                  ],
                },
                {
                  title: '\u00A0',
                  links: [
                    { href: '/commercial?type=garage', text: t('nav_garage') || 'Гаражи' },
                    { href: '/commercial?type=parking', text: t('nav_parking') || 'Машиноместа в паркингах' },
                    { href: '/commercial?type=storage', text: t('nav_storage') || 'Кладовые' },
                  ],
                },
                { links: [] },
              ]}
            />
          </nav>

          <div className="hd-right">
            <ThemeCustomizer />
            <LanguageSwitcher /> {/* ✅ Yangi til almashtirgich */}
            <button
              className="bt cn"
              onClick={() => setConsultOpen(true)}
            >
              {t('nav_consult')} <span className="ar">→</span>
            </button>
            <ThemeToggle />
            <AuthBlock />
          </div>

          <button
            className="burger"
            onClick={() => setMobileOpen(true)}
            aria-label="Меню"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}