'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/site/common/toast';
import { addToFavorites, removeFromFavorites } from '@/lib/api-users';
import { useTranslation } from '@/lib/i18n';

export function NovostroykaCard({ item, isActive }: { item: any; isActive?: boolean }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <Link
      href={`/novostroyki/${item.id}`}
      className={`nz-card ${isActive ? 'active' : ''}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div className="nz-card-img">
        <img src={item.img} alt="" loading="lazy" />
        <span className="nz-card-bdg">{t('card_badge_new')}</span>
        <button
          className="nz-card-fav"
          onClick={handleFav}
          disabled={loading}
          style={{ background: isFav ? '#e04b4b' : '#fff', color: isFav ? '#fff' : '#e04b4b', opacity: loading ? 0.5 : 1 }}
        >
          ♥
        </button>
        <button
          className="nz-card-cmp"
          title={t('card_compare')}
          onClick={(e) => e.preventDefault()}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
          </svg>
        </button>
        <span className="nz-card-imo">{item.imo}</span>
      </div>
      <div className="nz-card-body">
        <div className="nz-card-price">{item.price.toLocaleString('ru-RU')} ₽</div>
        <div className="nz-card-title">{item.name}</div>
        <div className="nz-card-addr">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
          {item.address} · {t('card_metro')} {item.metro}
        </div>
        <div className="nz-card-meta">
          <span>{item.rooms}</span>
          <span>{item.area} м²</span>
          <span>{item.info}</span>
        </div>
        <div className="nz-card-actions">
          <button className="nz-card-btn" onClick={(e) => e.preventDefault()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 2v20M2 12h20" /></svg>
            {t('card_on_map')}
          </button>
          <div className="nz-card-btn nz-card-btn-view">
            {t('card_details')}
          </div>
        </div>
      </div>
    </Link>
  );
}