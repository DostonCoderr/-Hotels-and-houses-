'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProjectById, Project } from '@/lib/api-projects';
import { toast } from '@/components/site/common/toast';
import { ViewTracker } from '@/components/site/common/view-tracker';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

import { motion } from 'framer-motion';

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [activeTab, setActiveTab] = useState('gallery');

  // Ipoteka
  const [price, setPrice] = useState(0);
  const [down, setDown] = useState(0);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(6);

  // Modal va Zayavka uchun statelar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  // Portal faqat brauzerda ishlashi uchun
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ TABS — komponent ichida (t() hook natijasi)
  const TABS: { id: string; key: TranslationKey }[] = [
    { id: 'gallery', key: 'pd_tab_gallery' },
    { id: 'chars', key: 'pd_tab_chars' },
    { id: 'packages', key: 'pd_tab_packages' },
    { id: 'company', key: 'pd_tab_company' },
    { id: 'mortgage', key: 'pd_tab_mortgage' },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchProjectById(Number(id));
        setData(res);
        setPrice(res.price);
        setDown(Math.round(res.price * 0.3));
      } catch {
        router.push('/stroitelstvo');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router]);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['gallery', 'chars', 'packages', 'company', 'mortgage'];
      const scrollPosition = window.scrollY + 150;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTab(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ BACKENDGA ZAYAVKA YUBORISH
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 9) {
      toast(t('pd_toast_invalid_form'));
      return;
    }
    setSending(true);
    try {
      await api.post('/applications', {
        type: 'project',
        propertyId: data?.id,
        name,
        phone,
        message: `${t('pd_app_message_prefix')} ${data?.name}`,
        source: 'site',
      });
      toast(t('pd_toast_app_sent'));
      setName('');
      setPhone('');
      setIsModalOpen(false);
    } catch (error: any) {
      toast(error?.response?.data?.error || t('toast_error'));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>{t('pd_loading')}</div>;
  if (!data) return null;

  const images = data.images?.length > 0 ? data.images.map(i => i.url) : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'];

  const basePrice = data.price;
  const packagePrice = data.packages?.[selectedPackage]?.price || 0;
  const totalPrice = basePrice + packagePrice;

  const Pn = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthlyPay = r === 0 ? Pn / n : (Pn * r) / (1 - Math.pow(1 + r, -n));

  return (
    <main style={{ paddingBottom: 80 }}>
      <ViewTracker propertyId={Number(id)} />
      {/* Breadcrumbs */}
      <div className="w" style={{ paddingTop: 30 }}>
        <div className="nz-bread" style={{ marginBottom: 20 }}>
          <Link href="/">{t('pd_bread_home')}</Link> <span>›</span>
          <Link href="/stroitelstvo">{t('pd_bread_stroitelstvo')}</Link> <span>›</span>
          <span className="mu">{data.name}</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ position: 'sticky', top: 70, zIndex: 100, background: 'var(--bg)', borderBottom: '1px solid var(--bd)', paddingBottom: 1 }}>
        <div className="w">
          <div style={{ display: 'flex', gap: 24, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                style={{
                  background: 'none', border: 'none', padding: '16px 0', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                  color: activeTab === tab.id ? 'var(--fg)' : 'var(--mu)',
                  borderBottom: activeTab === tab.id ? '2px solid #e04545' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {t(tab.key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w" style={{ paddingTop: 30 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>

          {/* LEFT COLUMN */}
          <div>
            {/* 1. Gallery */}
            <div id="gallery" style={{ scrollMarginTop: 130 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 30 }}>
                <div style={{ borderRadius: 20, overflow: 'hidden', height: 450 }}>
                  <img src={images[activeImg]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {images.slice(1, 3).map((img, i) => (
                    <div key={i} style={{ borderRadius: 20, overflow: 'hidden', flex: 1, cursor: 'pointer' }} onClick={() => setActiveImg(i + 1)}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                  <h1 style={{ fontSize: 38, margin: 0, fontFamily: 'serif' }}>{data.name}</h1>
                  <div style={{ display: 'flex', gap: 12, color: 'var(--mu)', marginTop: 12, fontSize: 14 }}>
                    <span>{data.bedrooms} {t('pd_rooms')}</span> • <span>{data.area} {t('pd_m2')}</span> • <span>{data.floors} {t('pd_floor')}</span> • <span>{data.material}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>✓ {t('pd_badge_warranty')}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>⏱ {t('pd_badge_term')}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>★ {t('pd_badge_mortgage')}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 34, fontWeight: 'bold', color: 'var(--gold)' }}>{t('pd_price_from')} {totalPrice.toLocaleString('ru-RU')} ₽</div>
                  <div style={{ fontSize: 13, color: 'var(--mu)' }}>{t('pd_price_note')}</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
                {[
                  { label: t('pd_stat_area'), value: `${data.area} ${t('pd_m2')}` },
                  { label: t('pd_stat_floor'), value: `${data.floors}` },
                  { label: t('pd_stat_term'), value: t('pd_stat_term_val') },
                  { label: t('pd_stat_rooms'), value: `${data.bedrooms}` }
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'var(--card)', padding: 20, borderRadius: 16, border: '1px solid var(--bd)' }}>
                    <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--mu)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Characteristics */}
            <div id="chars" style={{ background: 'var(--card)', borderRadius: 20, padding: 30, marginBottom: 30, border: '1px solid var(--bd)', scrollMarginTop: 130 }}>
              <h2 style={{ fontSize: 24, marginBottom: 20, fontFamily: 'serif' }}>{t('pd_chars_title')}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_area')}</span> <b>{data.area} {t('pd_m2')}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_rooms')}</span> <b>{data.bedrooms}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_bathrooms')}</span> <b>{data.bathrooms}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_kitchen')}</span> <b>{data.kitchenArea || '-'} {t('pd_m2')}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_floors')}</span> <b>{data.floors}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_terrace')}</span> <b>{data.terassa ? t('pd_yes') : t('pd_no')}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_wall_height')}</span> <b>{data.wallHeight || '-'} {t('pd_m')}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_foundation')}</span> <b>{data.foundation || '-'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_roof')}</span> <b>{data.roof || '-'}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bd)', paddingBottom: 10 }}>
                  <span style={{ color: 'var(--mu)' }}>{t('pd_char_material')}</span> <b>{data.material}</b>
                </div>
              </div>
            </div>

            {/* 3. Packages */}
            {data.packages && data.packages.length > 0 && (
              <div id="packages" style={{ background: 'var(--card)', borderRadius: 20, padding: 30, marginBottom: 30, border: '1px solid var(--bd)', scrollMarginTop: 130 }}>
                <h2 style={{ fontSize: 24, marginBottom: 10, fontFamily: 'serif' }}>{t('pd_packages_title')}</h2>
                <p style={{ color: 'var(--mu)', marginBottom: 20 }}>{t('pd_packages_desc')}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {data.packages.map((pkg: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPackage(i)}
                      style={{
                        padding: 20, borderRadius: 16, cursor: 'pointer',
                        border: selectedPackage === i ? '2px solid var(--gold)' : '1px solid var(--bd)',
                        background: selectedPackage === i ? 'rgba(201,163,106,0.1)' : 'transparent'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>{pkg.name}</div>
                      <div style={{ color: 'var(--gold)', fontSize: 13 }}>{pkg.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. О компании */}
            {data.companyName && (
              <div id="company" style={{ background: 'var(--card)', borderRadius: 20, padding: 30, marginBottom: 30, border: '1px solid var(--bd)', scrollMarginTop: 130 }}>
                <h2 style={{ fontSize: 24, marginBottom: 20, fontFamily: 'serif' }}>{t('pd_company_title')}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 60, height: 60, background: '#c9a36a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', color: '#000' }}>
                    {data.companyName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 18 }}>{data.companyName}</div>
                    <div style={{ color: 'var(--mu)', fontSize: 14 }}>{t('pd_company_type')}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--mu)', lineHeight: 1.6 }}>{data.companyDesc || t('pd_company_desc_empty')}</p>
              </div>
            )}

            {/* 5. Ипотека */}
            <div id="mortgage" style={{ background: 'var(--card)', borderRadius: 20, padding: 30, border: '1px solid var(--bd)', scrollMarginTop: 130 }}>
              <h2 style={{ fontSize: 24, marginBottom: 10, fontFamily: 'serif' }}>{t('pd_mort_title')}</h2>
              <p style={{ color: 'var(--mu)', marginBottom: 20 }}>{t('pd_mort_desc')}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--mu)' }}>{t('pd_mort_price')}</label>
                  <input type="text" value={price.toLocaleString('ru-RU')} onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, '')) || 0)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--bd)', background: 'var(--bg)', color: 'var(--fg)', marginTop: 6 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--mu)' }}>{t('pd_mort_down')}</label>
                  <input type="text" value={down.toLocaleString('ru-RU')} onChange={(e) => setDown(Number(e.target.value.replace(/\D/g, '')) || 0)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--bd)', background: 'var(--bg)', color: 'var(--fg)', marginTop: 6 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--bd)', paddingTop: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--mu)' }}>{t('pd_mort_monthly')}</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--gold)' }}>{isFinite(monthlyPay) && monthlyPay > 0 ? Math.round(monthlyPay).toLocaleString('ru-RU') : 0} ₽</div>
                </div>
                <button className="bt" style={{ padding: '12px 24px', borderRadius: 12 }}>{t('pd_mort_btn')}</button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div style={{ background: 'var(--card)', borderRadius: 20, padding: 24, border: '1px solid var(--bd)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <img src="https://i.pravatar.cc/100?u=agent2" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{t('pd_agent_name')}</div>
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>{t('pd_agent_role')}</div>
                </div>
              </div>

              <button style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--bd)', background: 'transparent', color: 'var(--fg)', fontWeight: 'bold', marginBottom: 10, cursor: 'pointer' }}>
                {t('pd_show_phone')}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#e04b4b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t('pd_get_consult')}
              </button>

              <button
                onClick={async () => {
                  const token = localStorage.getItem('site-token');
                  if (!token) {
                    toast(t('pd_toast_login_view'));
                    router.push('/login');
                    return;
                  }
                  try {
                    await api.post('/applications', {
                      type: 'scheduled',
                      propertyId: data?.id,
                      name: t('pd_scheduled_name'),
                      phone: '+7 (800) 555-35-35',
                      message: `${t('pd_scheduled_message')} ${data?.name}`,
                      source: 'site',
                    });
                    toast(t('pd_toast_scheduled_ok'));
                  } catch (error) {
                    toast(t('pd_toast_scheduled_error'));
                  }
                }}
                style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t('pd_schedule_view')}
              </button>
            </div>

            <div style={{ background: 'var(--card)', borderRadius: 20, padding: 24, border: '1px solid var(--bd)' }}>
              <div style={{ marginBottom: 12, fontSize: 14 }}>★ {t('pd_badge_warranty')}</div>
              <div style={{ marginBottom: 12, fontSize: 14 }}>✓ {t('pd_side_fixed_price')}</div>
              <div style={{ fontSize: 14 }}>⏱ {t('pd_badge_term')}</div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL OYNASI (PORTAL ORQALI EKRAN MARKAZIDA) */}
      {mounted && isModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: 20 }}>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              background: 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(18,18,18,1) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              width: '100%',
              maxWidth: 440,
              borderRadius: 28,
              padding: '40px 30px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
          >

            {/* Chiroyli Yopish tugmasi */}
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--mu)', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--mu)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Sarlavha */}
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ width: 60, height: 60, borderRadius: 20, background: 'rgba(201,163,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3 style={{ fontSize: 24, marginBottom: 8, fontFamily: 'serif', color: '#fff' }}>{t('pd_modal_title')}</h3>
              <p style={{ fontSize: 14, color: 'var(--mu)' }}>{t('pd_modal_desc')}</p>
            </div>

            {/* Forma */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder={t('pd_modal_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '16px 20px', borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                    color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.border = '1px solid var(--gold)'}
                  onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder={t('pd_modal_phone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%', padding: '16px 20px', borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                    color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.border = '1px solid var(--gold)'}
                  onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                  background: 'linear-gradient(135deg, #c9a36a 0%, #e8c88a 100%)',
                  color: '#000', fontWeight: 'bold', fontSize: 16, marginTop: 8,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                  boxShadow: '0 10px 20px -10px rgba(201,163,106,0.5)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => { if(!sending) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {sending ? t('pd_modal_sending') : t('pd_modal_submit')}
              </button>

              <p style={{ fontSize: 12, color: 'var(--mu)', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
                {t('pd_modal_agree_1')} <a href="#" style={{ color: 'var(--gold)', textDecoration: 'none' }}>{t('pd_modal_agree_link')}</a>
              </p>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

    </main>
  );
}