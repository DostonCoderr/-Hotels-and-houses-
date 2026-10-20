'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchPropertyById, Property } from '@/lib/api-properties';
import { addToHistory } from '@/lib/api-users';
import { toast } from '@/components/site/common/toast';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

export default function CommercialDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const router = useRouter();
  const { t } = useTranslation();

  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Galereya
  const [imgIdx, setImgIdx] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);

  // Interaktiv
  const [isFav, setIsFav] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  // Ipoteka
  const [price, setPrice] = useState(0);
  const [down, setDown] = useState(0);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(16);

  // Modal va Zayavka
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  // ✅ TABS — komponent ichida (t() hook natijasi)
  const TABS: { target: string; key: TranslationKey; isToast?: boolean }[] = [
    { target: 'gallery', key: 'cmd_tab_gallery' },
    { target: 'about', key: 'cmd_tab_about' },
    { target: 'chars', key: 'cmd_tab_chars' },
    { target: 'mort', key: 'cmd_tab_mort' },
    { target: 'interesting', key: 'cmd_tab_interesting', isToast: true },
    { target: 'journal', key: 'cmd_tab_journal', isToast: true },
  ];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchPropertyById(id);
        setData(res);
        setPrice(res.price);
        setDown(Math.round(res.price * 0.3));

        const token = localStorage.getItem('site-token');
        if (token) {
          addToHistory(id).catch(() => {});
        }
      } catch (error) {
        toast(t('cmd_toast_not_found'));
        router.push('/commercial');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id, router]);

  // Ipoteka hisoblash
  const Pn = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthlyPay = r === 0 ? Pn / n : (Pn * r) / (1 - Math.pow(1 + r, -n));

  // Galereya boshqaruvi
  const imgs = data?.images?.map(i =>
    i.url.startsWith('http') ? i.url : `http://localhost:5000${i.url}`
  ) || ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200'];

  const nextImg = () => setImgIdx((p) => (p + 1) % imgs.length);
  const prevImg = () => setImgIdx((p) => (p === 0 ? imgs.length - 1 : p - 1));
  const openGallery = (idx: number) => { setModalIdx(idx); setIsGalleryOpen(true); };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Modallar ochiq bo'lganda scrollni qulflash
  useEffect(() => {
    if (isGalleryOpen || modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isGalleryOpen, modalOpen]);

  // Galereya modalida klaviatura boshqaruvi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      if (e.key === 'Escape') setIsGalleryOpen(false);
      if (e.key === 'ArrowRight') setModalIdx((p) => (p + 1) % imgs.length);
      if (e.key === 'ArrowLeft') setModalIdx((p) => (p === 0 ? imgs.length - 1 : p - 1));
    };
    if (isGalleryOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, imgs.length]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data?.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast(t('nzd_toast_link_copied'));
    }
  };

  // Zayavka yuborish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 9) {
      toast(t('cmd_toast_invalid_form'));
      return;
    }
    setSending(true);
    try {
      await api.post('/applications', {
        type: 'property',
        propertyId: data?.id,
        name,
        phone,
        message: `${t('cmd_app_message_prefix')} ${data?.name}`,
        source: 'site',
      });
      toast(t('cmd_toast_app_sent'));
      setModalOpen(false);
      setName('');
      setPhone('');
    } catch (error: any) {
      toast(error?.response?.data?.error || t('toast_error'));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>{t('sd_loading')}</div>;
  if (!data) return null;

  const priceM2 = data.area > 0 ? Math.round(data.price / data.area) : 0;

  return (
    <main className="cm-detail-page">

      {/* Breadcrumbs */}
      <div className="w">
        <div className="cm-bread">
          <Link href="/">{t('pd_bread_home')}</Link><span>›</span>
          <Link href="/commercial">{t('cmd_bread_commercial')}</Link><span>›</span>
          <span className="mu">{data.type?.name || t('cm_type_default')}, {data.area} {t('pd_m2')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="w">
        <div className="cd-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab.target}
              className={`cd-tab ${i === 0 ? 'on' : ''}`}
              onClick={() => tab.isToast ? toast(t('cmd_toast_developing')) : scrollTo(tab.target)}
            >
              {t(tab.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="w">
        <div className="cd-layout">

          {/* LEFT COLUMN */}
          <div className="cd-left">

            {/* 1. GALLERY */}
            <div className="cd-section" id="gallery">
              <div className="cd-gallery">
                <div className="cd-gallery-main">
                  <img src={imgs[imgIdx]} alt="" />
                  <span className="cd-gallery-counter">{imgIdx + 1} / {imgs.length}</span>
                  <button className="cd-gallery-more" onClick={() => openGallery(imgIdx)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    {t('pdp_view_all_photos')}
                  </button>
                  {imgs.length > 1 && (
                    <>
                      <button className="cd-gallery-nav prev" onClick={prevImg}>‹</button>
                      <button className="cd-gallery-nav next" onClick={nextImg}>›</button>
                    </>
                  )}
                </div>
                {imgs.length > 1 && (
                  <div className="cd-gallery-thumbs">
                    {imgs.slice(1, 5).map((src, i) => (
                      <div key={i} className={`cd-thumb ${imgIdx === i+1 ? 'on' : ''}`} onClick={() => setImgIdx(i + 1)}>
                        <img src={src} alt="" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. TITLE & PRICE */}
            <div className="cd-section">
              <div className="cd-title-row">
                <div>
                  <h1>{data.name} ({data.area} {t('pd_m2')})</h1>
                  <div className="cd-addr">{data.address}</div>
                  <a href="#" className="cd-onmap" onClick={(e) => { e.preventDefault(); window.open(`https://www.google.com/maps?q=${data.lat},${data.lng}`, '_blank'); }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                    {t('nzd_on_map')}
                  </a>
                </div>
                <div className="cd-price-block">
                  <div className="cd-price">{data.price.toLocaleString('ru-RU')} ₽</div>
                  <div className="cd-price-m2">{priceM2.toLocaleString('ru-RU')} ₽/{t('pd_m2')}</div>
                  <a href="#mort" className="cd-mort-link" onClick={(e) => { e.preventDefault(); scrollTo('mort'); }}>{t('nzd_calc_payment')}</a>
                </div>
              </div>

              <div className="cd-metro">
                <div className="cd-metro-item">
                  <b>{t('cm_metro_badge')}</b>{data.metro || t('cm_metro_default')}<span>{data.metroTime || t('cmd_metro_time_default')} ({data.metroDist || t('cmd_metro_dist_default')})</span>
                </div>
              </div>

              <div className="cd-quick-actions">
                <button className="cd-quick-btn" onClick={() => setPhoneVisible(true)}>
                  <span>{phoneVisible ? '+7 (800) 555' : t('cmd_call')}</span>
                </button>
                <button className={`cd-quick-btn ${isFav ? 'on' : ''}`} onClick={() => { setIsFav(!isFav); toast(isFav ? t('toast_fav_removed') : t('toast_fav_added')); }}>
                  <span>{isFav ? t('nzd_in_fav') : t('nzd_add_to_fav')}</span>
                </button>
                <button className="cd-quick-btn" onClick={handleShare}>
                  <span>{t('nzd_share')}</span>
                </button>
              </div>
            </div>

            {/* 3. DESCRIPTION */}
            <div className="cd-section" id="about">
              <h2 className="cd-h2">{t('nzd_desc_title')}</h2>
              <p className="cd-text">{data.description}</p>
            </div>

            {/* Features */}
            {data.features && data.features.length > 0 && (
              <div className="cd-section">
                <h2 className="cd-h2">{t('cmd_features_title')}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {data.features.map((f: string, i: number) => (
                    <span key={i} style={{ background: 'var(--card)', padding: '8px 16px', borderRadius: 20, fontSize: 14, border: '1px solid var(--bd)' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Способы оплаты */}
            {(data as any).paymentMethods && (
              <div className="cd-section">
                <h2 className="cd-h2">{t('cmd_payment_title')}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card)', padding: 30, borderRadius: 20 }}>
                  <div>
                    <p style={{ fontSize: 15, color: 'var(--mu)', lineHeight: 1.6, maxWidth: 600 }}>{(data as any).paymentMethods}</p>
                    <button className="cd-adv-btn" style={{ marginTop: 16 }}>{t('pdp_view_all_photos').replace('фото', '') || t('cmd_more')}</button>
                  </div>
                  <div style={{ fontSize: 60 }}>💳</div>
                </div>
              </div>
            )}

            {/* Похожие предложения */}
            {(data as any).similarOffers && (
              <div className="cd-section">
                <div style={{ background: 'var(--card)', padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{t('cmd_similar_title')}</h3>
                    <p style={{ fontSize: 14, color: 'var(--mu)' }}>{(data as any).similarOffers}</p>
                  </div>
                  <button style={{ background: 'var(--bg)', border: '1px solid var(--bd)', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}>›</button>
                </div>
              </div>
            )}

            {/* 5. CHARS */}
            <div className="cd-section" id="chars">
              <h2 className="cd-h2">{t('pd_chars_title')}</h2>
              <div className="cd-chars">
                <div className="cd-char"><div className="cd-char-ic">#</div><div className="cd-char-body"><b>{data.id}</b><span>{t('cmd_char_code')}</span></div></div>
                <div className="cd-char"><div className="cd-char-ic">▣</div><div className="cd-char-body"><b>{data.floor}</b><span>{t('cmd_char_floor')}</span></div></div>
                <div className="cd-char"><div className="cd-char-ic">▢</div><div className="cd-char-body"><b>{data.area} {t('pd_m2')}</b><span>{t('cmd_char_area')}</span></div></div>
                <div className="cd-char"><div className="cd-char-ic">▤</div><div className="cd-char-body"><b>{data.type?.name || t('cm_type_default')}</b><span>{t('cmd_char_type')}</span></div></div>
              </div>
            </div>

            {/* 6. MORTGAGE */}
            <div className="cd-section" id="mort">
              <div className="cd-mort-head">
                <h2 className="cd-h2" style={{margin:0}}>{t('pd_mort_title')}</h2>
              </div>
              <p className="cd-mort-sub">{t('pd_mort_desc')}</p>

              <div className="cd-mort-form">
                <div className="cd-mort-field">
                  <label>{t('pd_mort_price')}</label>
                  <div className="cd-mort-input">
                    <input type="text" value={price.toLocaleString('ru-RU')} onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, '')) || 0)} />
                    <span>₽</span>
                  </div>
                </div>
                <div className="cd-mort-field">
                  <label>{t('pd_mort_down')}</label>
                  <div className="cd-mort-input">
                    <input type="text" value={down.toLocaleString('ru-RU')} onChange={(e) => setDown(Number(e.target.value.replace(/\D/g, '')) || 0)} />
                    <span>₽</span>
                  </div>
                </div>
              </div>

              <div className="cd-mort-result">
                <div>
                  <span className="mu">{t('nzd_monthly_payment')}</span>
                  <div className="cd-mort-pay">{isFinite(monthlyPay) && monthlyPay > 0 ? Math.round(monthlyPay).toLocaleString('ru-RU') : 0} ₽ / {t('cmd_per_month')}</div>
                </div>
                <button className="bt" onClick={() => toast(t('pdp_toast_mort_sent'))}>{t('pd_mort_btn')}</button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="cd-side">
            <div className="cd-agent">
              <div className="cd-agent-head">
                <div className="cd-agent-ava">
                  <img src="https://i.pravatar.cc/100?u=agent2" alt="" />
                  <span className="cd-online"></span>
                </div>
                <div>
                  <b>{t('cmd_agent_name')}</b>
                  <div className="cd-agent-role">{t('cmd_agent_role')}</div>
                </div>
              </div>

              <button className="cd-agent-btn" onClick={() => setPhoneVisible(true)}>
                {phoneVisible ? '+7 (800) 555-35-35' : t('pd_show_phone')}
              </button>

              <button className="cd-agent-btn cd-agent-btn-red" onClick={() => setModalOpen(true)}>
                {t('nzd_contact_me')}
              </button>

              {/* Ko'rishga yozilish */}
              <button
                className="cd-agent-btn"
                style={{ background: 'var(--gold)', fontWeight: 'bold' }}
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
              >
                {t('pd_schedule_view')}
              </button>

              <div className="cd-agent-actions">
                <button className="cd-agent-act" onClick={handleShare}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
                  {t('nzd_share')}
                </button>
                <button className={`cd-agent-act ${isFav ? 'on' : ''}`} onClick={() => { setIsFav(!isFav); toast(isFav ? t('toast_fav_removed') : t('toast_fav_added')); }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9-9c-1.2-2.8.6-6 3.7-6 2 0 3.4 1.2 4.3 2.4.9-1.2 2.3-2.4 4.3-2.4 3.1 0 4.9 3.2 3.7 6-2 4.5-9 9-9 9z" /></svg>
                  {isFav ? t('nzd_in_fav') : t('nzd_add_to_fav')}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* GALEREYA MODALI */}
      {mounted && isGalleryOpen && createPortal(
        <div
          onClick={() => setIsGalleryOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '90%', maxWidth: 1000, height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer' }}
            >
              ✕
            </button>

            <img src={imgs[modalIdx]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12 }} />

            {imgs.length > 1 && (
              <>
                <button
                  onClick={() => setModalIdx((p) => (p === 0 ? imgs.length - 1 : p - 1))}
                  style={{ position: 'absolute', left: -50, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 50, height: 50, borderRadius: '50%', fontSize: 30, cursor: 'pointer' }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setModalIdx((p) => (p + 1) % imgs.length)}
                  style={{ position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 50, height: 50, borderRadius: '50%', fontSize: 30, cursor: 'pointer' }}
                >
                  ›
                </button>
              </>
            )}
            <div style={{ position: 'absolute', bottom: -40, color: '#aaa', fontSize: 14 }}>
              {modalIdx + 1} / {imgs.length}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ZAYAVKA MODALI */}
      {mounted && modalOpen && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: 16
        }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(18,18,18,1) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '100%', maxWidth: 420, borderRadius: 24, padding: 32, position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'var(--mu)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: '0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--mu)'}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 60, height: 60, borderRadius: 20, background: 'rgba(201,163,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3 style={{ fontSize: 24, marginBottom: 8, fontFamily: 'serif', color: '#fff' }}>{t('nzd_contact_me')}</h3>
              <p style={{ fontSize: 14, color: 'var(--mu)' }}>{t('pd_modal_desc')}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text" placeholder={t('pd_modal_name')} value={name} onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s' }}
                onFocus={(e) => e.currentTarget.style.border = '1px solid var(--gold)'}
                onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
              <input
                type="tel" placeholder={t('pd_modal_phone')} value={phone} onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s' }}
                onFocus={(e) => e.currentTarget.style.border = '1px solid var(--gold)'}
                onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
              <button
                type="submit" disabled={sending}
                style={{
                  width: '100%', padding: 16, borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #c9a36a 0%, #e8c88a 100%)', color: '#000',
                  fontWeight: 'bold', fontSize: 16, marginTop: 8, cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1, boxShadow: '0 10px 20px -10px rgba(201,163,106,0.5)'
                }}
              >
                {sending ? t('pd_modal_sending') : t('pd_modal_submit')}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}