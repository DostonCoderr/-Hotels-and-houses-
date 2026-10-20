'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NovostroykaDetail } from '@/lib/types';
import { toast } from '@/components/site/common/toast';
import { Employee } from '@/lib/api-employees';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

// --- 1. HERO ---
export function DetailHero({ data }: { data: NovostroykaDetail }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const int = setInterval(() => setIdx((p) => (p + 1) % data.slides.length), 5000);
    return () => clearInterval(int);
  }, [data.slides.length]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data.name, url: window.location.href }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast(t('nzd_toast_link_copied'));
    }
  };

  const handleOpenMap = () => {
    window.open(`https://www.google.com/maps?q=${data.lat},${data.lng}`, '_blank');
  };

  return (
    <section className="nzd-hero">
      <div className="nzd-hero-slides">
        {data.slides.map((src, i) => (
          <div key={src} className={`nzd-slide ${i === idx ? 'on' : ''}`} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <div className="nzd-hero-overlay" />
      <div className="nzd-hero-content">
        <div className="w">
          <div className="nzd-hero-badge">{data.imo || t('nzd_hero_badge_default')}</div>
          <h1 className="nzd-hero-title">{data.name}</h1>
          <div className="nzd-hero-sub">{data.sub}</div>
          <div className="nzd-hero-actions">
            <button className="nzd-btn nzd-btn-red">{t('nzd_hero_choose_flat')}</button>
            <button className="nzd-btn nzd-btn-blue">{t('nzd_hero_callback')}</button>

            <button className="nzd-btn nzd-btn-ghost" title={t('nzd_hero_on_map')} onClick={handleOpenMap}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/>
                <circle cx="12" cy="10" r="2.5"/>
              </svg>
            </button>
            <button
              className="nzd-btn nzd-btn-ghost"
              title={t('nzd_hero_fav')}
              onClick={() => {
                setIsFav(!isFav);
                toast(isFav ? t('toast_fav_removed') : t('toast_fav_added'));
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-4.5-9-9c-1.2-2.8.6-6 3.7-6 2 0 3.4 1.2 4.3 2.4.9-1.2 2.3-2.4 4.3-2.4 3.1 0 4.9 3.2 3.7 6-2 4.5-9 9-9 9z"/>
              </svg>
            </button>
            <button className="nzd-btn nzd-btn-ghost" title={t('nzd_hero_share')} onClick={handleShare}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>
              </svg>
            </button>
            <div className="nzd-hero-stats">
              <div className="nzd-hero-stat"><span>{t('nzd_hero_price')}</span><b>{t('nzd_price_from')} {data.price.toLocaleString('ru-RU')} ₽</b></div>
              <div className="nzd-hero-stat"><span>{t('nzd_hero_deadline')}</span><b>{data.info}</b></div>
              <div className="nzd-hero-stat"><span>{t('nzd_hero_builder')}</span><b>{data.builder}</b></div>
            </div>
          </div>
        </div>
      </div>
      <button className="nzd-hero-arrow prev" onClick={() => setIdx((p) => (p === 0 ? data.slides.length - 1 : p - 1))}>‹</button>
      <button className="nzd-hero-arrow next" onClick={() => setIdx((p) => (p + 1) % data.slides.length)}>›</button>
      <div className="nzd-hero-dots">
        {data.slides.map((_, i) => <i key={i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} />)}
      </div>
    </section>
  );
}

// --- 3. SIDEBAR ---
export function DetailSidebar({ data, consultant }: { data: NovostroykaDetail, consultant: Employee | null }) {
  const { t } = useTranslation();
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Modal uchun holatlar
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Portal ishlashi uchun (Next.js SSR xatoligini oldini olish)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast(t('nzd_toast_link_copied'));
    }
  };

  const handleCall = () => {
    setPhoneVisible(true);
    if (consultant?.phone) {
      navigator.clipboard.writeText(consultant.phone);
      toast(t('nzd_toast_phone_copied'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 9) {
      toast(t('nzd_toast_invalid_form'));
      return;
    }

    setLoading(true);
    try {
      await api.post('/applications', {
        type: 'property',
        propertyId: data.id,
        name: name,
        phone: phone,
        message: `${t('nzd_app_message_prefix')} ${data.name}`,
        source: 'site',
      });

      toast(t('nzd_toast_app_sent'));
      setModalOpen(false);
      setName('');
      setPhone('');
    } catch (error: any) {
      toast(error?.response?.data?.error || t('toast_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="nzd-side">
      <div className="nzd-consult">
        <div className="nzd-consult-head">
          <div className="nzd-consult-ava">
            {consultant?.photo ? (
              <img src={consultant.photo} alt={consultant.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <img src="https://i.pravatar.cc/100?u=consult" alt="Consultant" />
            )}
            <span className="nzd-online"></span>
          </div>
          <div>
            <b>{consultant?.name || t('nzd_consult_default_name')}</b>
            <div className="nzd-consult-role">{consultant?.position || t('nzd_consult_default_role')}</div>
          </div>
          <div className="nzd-consult-menu">⋮</div>
        </div>

        <button className="nzd-agent-btn" onClick={handleCall}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.5 2.6a2 2 0 01-.5 2L7.8 9.6a16 16 0 006.6 6.6l1.3-1.2a2 2 0 012-.5c.8.2 1.7.4 2.6.5A2 2 0 0122 16.9z"/></svg>
          {phoneVisible ? (consultant?.phone || '+7 (800) 555-35-35') : t('nzd_show_phone')}
        </button>

        <button className="nzd-agent-btn nzd-agent-btn-red" onClick={() => setModalOpen(true)}>
          {t('nzd_contact_me')}
        </button>

        <button
          onClick={async () => {
            const token = localStorage.getItem('site-token');
            if (!token) {
              toast(t('nzd_toast_login_view'));
              window.location.href = '/login';
              return;
            }
            try {
              await api.post('/applications', {
                type: 'scheduled',
                propertyId: data.id,
                name: t('nzd_scheduled_name'),
                phone: '+7 (800) 555-35-35',
                message: `${t('nzd_scheduled_message')} ${data.name}`,
                source: 'site',
              });
              toast(t('nzd_toast_scheduled_ok'));
            } catch (error) {
              toast(t('nzd_toast_scheduled_error'));
            }
          }}
          style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: 10 }}
        >
          {t('nzd_schedule_view')}
        </button>

        <div className="nzd-agent-actions">
          <button className="nzd-agent-action" onClick={handleShare}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
            {t('nzd_share')}
          </button>

          <button className={`nzd-agent-action ${isFav ? 'on' : ''}`} onClick={() => {
            setIsFav(!isFav);
            toast(isFav ? t('toast_fav_removed') : t('toast_fav_added'));
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9-9c-1.2-2.8.6-6 3.7-6 2 0 3.4 1.2 4.3 2.4.9-1.2 2.3-2.4 4.3-2.4 3.1 0 4.9 3.2 3.7 6-2 4.5-9 9-9 9z"/></svg>
            {isFav ? t('nzd_in_fav') : t('nzd_add_to_fav')}
          </button>
        </div>
      </div>

      <div className="nzd-facts">
        <div className="nzd-fact"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('nzd_fact_consult')}</div>
        <div className="nzd-fact"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('nzd_fact_booking')}</div>
        <div className="nzd-fact"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('nzd_fact_discounts')}</div>
      </div>

      {/* ✅ PORTAL ORQALI EKRAN MARKAZIDA OCHILADIGAN MODAL */}
      {mounted && modalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '16px' }}>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '380px', borderRadius: '24px', padding: '24px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{t('nzd_modal_title')}</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>{t('nzd_modal_desc')}</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                required
                placeholder={t('nzd_modal_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', height: '44px', padding: '0 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              />
              <input
                type="tel"
                required
                placeholder={t('nzd_modal_phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', height: '44px', padding: '0 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', height: '44px', borderRadius: '12px', backgroundColor: '#d4a76a', color: '#000', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, marginTop: '8px' }}
              >
                {loading ? t('nzd_modal_sending') : t('nzd_modal_submit')}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}