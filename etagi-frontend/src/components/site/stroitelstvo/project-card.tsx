'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/site/common/toast';
import { addToFavorites, removeFromFavorites } from '@/lib/api-users';
import { useTranslation } from '@/lib/i18n';

export function ProjectCard({ item }: { item: any }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const img = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600';

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
    <Link href={`/stroitelstvo/${item.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div className="sd-card">
        <div className="sd-card-img">
          <img src={img} alt={item.name} loading="lazy" />
          <span className="sd-card-count">1/{item.images?.length || 1}</span>
          <span className="sd-card-badge">{item.category}</span>

          <button
            className="sd-card-fav"
            onClick={handleFav}
            disabled={loading}
            style={{ background: isFav ? '#e04b4b' : '#fff', color: isFav ? '#fff' : '#e04b4b', opacity: loading ? 0.5 : 1 }}
          >
            ♥
          </button>
          <button
            className="sd-card-cmp"
            onClick={(e) => { e.preventDefault(); toast(t('proj_toast_compare_added')); }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
          </button>
        </div>

        <div className="sd-card-body">
          <div className="sd-card-title">{item.name}</div>
          <div className="sd-card-price">{t('proj_price_from')} {item.price.toLocaleString('ru-RU')} ₽</div>

          <div className="sd-card-meta">
            <span>{item.bedrooms} {t('proj_rooms_short')}</span>
            <span>{item.area} {t('proj_m2_short')}</span>
            <span>{item.floors} {t('proj_floor')}{item.floors > 1 ? t('proj_floor_suffix') : ''}</span>
            <span>{item.material}</span>
          </div>

          <div className="sd-card-actions">
            <button className="sd-card-btn" onClick={(e) => { e.preventDefault(); toast(t('proj_toast_phone')); }}>
              {t('proj_phone')}
            </button>
            <div className="sd-card-btn sd-card-btn-view">
              {t('proj_details')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}