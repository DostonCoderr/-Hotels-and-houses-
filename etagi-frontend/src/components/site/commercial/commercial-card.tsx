'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/site/common/toast';
import { addToFavorites, removeFromFavorites } from '@/lib/api-users';
import { useTranslation } from '@/lib/i18n';

export function CommercialCard({ item }: { item: any }) {
  const router = useRouter();
  const { t } = useTranslation();
  const priceM2 = item.area > 0 ? Math.round(item.price / item.area) : 0;
  const [isFav, setIsFav] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const imgUrl = item.images?.[0]?.url
    ? (item.images[0].url.startsWith('http') ? item.images[0].url : `http://localhost:5000${item.images[0].url}`)
    : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';

  // ✅ Sahifa yuklanganda izbrannoe holatini tekshirish
  useEffect(() => {
    const token = localStorage.getItem('site-token');
    if (!token) return;

    import('@/lib/api-users').then(({ getFavorites }) => {
      getFavorites().then((favs) => {
        const exists = favs.some((f: any) => f.id === item.id);
        setIsFav(exists);
      }).catch(() => {});
    });
  }, [item.id]);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('site-token');
    if (!token) {
      toast(t('toast_login_required'));
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(item.id);
        setIsFav(false);
        toast(t('toast_fav_removed'));
      } else {
        await addToFavorites(item.id);
        setIsFav(true);
        toast(t('toast_fav_added'));
      }
    } catch (err: any) {
      toast(err?.response?.data?.error || t('toast_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-card" style={{ position: 'relative' }}>
      <Link href={`/commercial/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="cm-card-img">
          <img src={imgUrl} alt="" loading="lazy" />
          <span className="cm-card-bdg">{t('cm_type_prefix')} {item.type?.name || t('cm_type_default')}</span>
        </div>

        <div className="cm-card-body">
          <div className="cm-card-price">{item.price.toLocaleString('ru-RU')} ₽</div>
          <div className="cm-card-price-m2">{priceM2.toLocaleString('ru-RU')} ₽/{t('cm_m2_short')}</div>
          <div className="cm-card-title">{item.name} · {item.area} {t('cm_m2_short')} · {item.floor} {t('cm_floor_short')}</div>
          <div className="cm-card-addr">{item.address}</div>
          <div className="cm-card-metro">
            <b>{t('cm_metro_badge')}</b> {item.metro || t('cm_metro_default')} <span>· {item.metroDist || ''}</span>
          </div>
        </div>
      </Link>

      <div className="cm-card-actions" style={{ padding: '0 16px 16px' }}>
        <button
          className={`cm-card-fav ${isFav ? 'on' : ''}`}
          onClick={handleFav}
          disabled={loading}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: isFav ? '#e04b4b' : '#fff', color: isFav ? '#fff' : '#e04b4b', borderRadius: '50%', width: 32, height: 32, border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1, transition: '0.2s' }}
        >
          ♥
        </button>

        <button className="cm-card-btn cm-card-btn-map" title={t('cm_on_map')}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
        </button>

        <button className="cm-card-btn" onClick={(e) => { e.preventDefault(); setPhoneVisible(true); }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 01-2.2 2A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.5 2.6a2 2 0 01-.5 2L7.8 9.6a16 16 0 006.6 6.6l1.3-1.2a2 2 0 012-.5c.8.2 1.7.4 2.6.5A2 2 0 0122 16.9z"/></svg>
          {phoneVisible ? '+7 (800) 555' : t('cm_show_phone')}
        </button>
      </div>
    </div>
  );
}