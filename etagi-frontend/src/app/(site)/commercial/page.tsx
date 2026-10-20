'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProperties, Property } from '@/lib/api-properties';
import { CommercialCard } from '@/components/site/commercial/commercial-card';
import { CommercialMap } from '@/components/site/commercial/commercial-map';
import { useTranslation } from '@/lib/i18n';
import { API_URL } from '@/lib/api';

function CommercialPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  // Filtrlar
  const currentSearch = searchParams.get('search') || '';
  const currentType = searchParams.get('type') || 'office';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentMinArea = searchParams.get('minArea') || '';
  const currentMaxArea = searchParams.get('maxArea') || '';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const queryParams: any = {
          page,
          limit,
          published: true,
          types: 'office,trade,warehouse,commercial'
        };

        if (currentSearch) queryParams.search = currentSearch;
        if (currentType) queryParams.type = currentType;
        if (currentMinPrice) queryParams.minPrice = Number(currentMinPrice);
        if (currentMaxPrice) queryParams.maxPrice = Number(currentMaxPrice);
        if (currentMinArea) queryParams.minArea = Number(currentMinArea);
        if (currentMaxArea) queryParams.maxArea = Number(currentMaxArea);

        const res = await fetchProperties(queryParams);
        setProperties(res.items);
        setTotalPages(res.totalPages);
        setTotalItems(res.total);
      } catch (error) {
        console.error('Ma\'lumot yuklashda xato:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, currentSearch, currentType, currentMinPrice, currentMaxPrice, currentMinArea, currentMaxArea]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setPage(1);
    router.push(`?${params.toString()}`);
  };

  const handlePriceRange = (val: string) => {
    if (val === '0-50000') { updateFilter('minPrice', '0'); updateFilter('maxPrice', '50000'); }
    else if (val === '50000-100000') { updateFilter('minPrice', '50000'); updateFilter('maxPrice', '100000'); }
    else if (val === '100000+') { updateFilter('minPrice', '100000'); updateFilter('maxPrice', ''); }
    else { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }
  };

  const handleAreaRange = (val: string) => {
    if (val === '0-50') { updateFilter('minArea', '0'); updateFilter('maxArea', '50'); }
    else if (val === '50-100') { updateFilter('minArea', '50'); updateFilter('maxArea', '100'); }
    else if (val === '100+') { updateFilter('minArea', '100'); updateFilter('maxArea', ''); }
    else { updateFilter('minArea', ''); updateFilter('maxArea', ''); }
  };

  const getImageUrl = (imgUrl?: string) => {
    if (!imgUrl) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL.replace('/api', '')}${imgUrl}`;
  };

  return (
    <div className="cm-layout">
      <div className="cm-left">
        <div className="cm-bread">
          <Link href="/">{t('pd_bread_home')}</Link>
          <span>›</span>
          <span className="mu">{t('cmd_bread_commercial')}</span>
        </div>

        <h1 className="cm-title">{t('cmp_title')}</h1>

        <div className="cm-head">
          <div className="cm-head-left">
            <div className="cm-count"><b>{totalItems}</b> <span>{t('sd_count_offers')}</span></div>
            <div className="cm-view-toggle">
              <button className={`cm-view-btn ${view === 'grid' ? 'on' : ''}`} onClick={() => setView('grid')}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button className={`cm-view-btn ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="cm-filters">
          <div className="cm-filter-row">
            <select className="fd" value={currentType} onChange={(e) => updateFilter('type', e.target.value)}>
              <option value="">{t('cmp_filter_all')}</option>
              <option value="office">{t('nav_office')}</option>
              <option value="trade">{t('nav_trade')}</option>
              <option value="warehouse">{t('nav_warehouse')}</option>
            </select>

            <select className="fd" onChange={(e) => handlePriceRange(e.target.value)}>
              <option value="">{t('sd_filter_price')}</option>
              <option value="0-50000">{t('nzp_price_to_50k')}</option>
              <option value="50000-100000">{t('nzp_price_50_100k')}</option>
              <option value="100000+">{t('nzp_price_from_100k')}</option>
            </select>

            <select className="fd" onChange={(e) => handleAreaRange(e.target.value)}>
              <option value="">{t('sd_filter_area')}</option>
              <option value="0-50">{t('cmp_area_to_50')}</option>
              <option value="50-100">{t('cmp_area_50_100')}</option>
              <option value="100+">{t('cmp_area_from_100')}</option>
            </select>

            <input
              className="fd cm-search"
              placeholder={t('cmp_search_placeholder')}
              defaultValue={currentSearch}
              onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('search', e.currentTarget.value); }}
            />
            <button className="bt cm-find" onClick={() => {
              const input = document.querySelector('.cm-search') as HTMLInputElement;
              updateFilter('search', input?.value || '');
            }}>
              {t('sd_filter_find')}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>{t('nzp_loading')}</div>
        ) : (
          <>
            <div className={`cm-grid ${view === 'list' ? 'list-view' : ''}`}>
              {properties.length > 0 ? (
                properties.map(item => (
                  <CommercialCard key={item.id} item={item} />
                ))
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--mu)', width: '100%', gridColumn: '1 / -1' }}>
                  {t('sd_not_found')}
                </div>
              )}
            </div>

            {properties.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px', paddingBottom: '60px', width: '100%' }}>
                {page < totalPages && (
                  <button onClick={() => setPage(page + 1)} style={{ padding: '12px 36px', borderRadius: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--fg)', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>{t('nzp_show_more')}</button>
                )}

                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: page === 1 ? 'not-allowed' : 'pointer', background: 'transparent', border: 'none', color: 'var(--fg)', opacity: page === 1 ? 0.3 : 1 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pNum = i + 1;
                      if (pNum === 1 || pNum === totalPages || (pNum >= page - 1 && pNum <= page + 1)) {
                        const isActive = page === pNum;
                        return (
                          <button key={pNum} onClick={() => setPage(pNum)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: 'pointer', background: isActive ? 'var(--gold)' : 'transparent', color: isActive ? '#000' : 'var(--fg)', fontWeight: isActive ? 600 : 500, border: 'none' }}>
                            {pNum}
                          </button>
                        );
                      } else if (pNum === page - 2 || pNum === page + 2) {
                        return <span key={pNum} style={{ color: 'var(--mu)', width: '24px', textAlign: 'center' }}>...</span>;
                      }
                      return null;
                    })}

                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: page === totalPages ? 'not-allowed' : 'pointer', background: 'transparent', border: 'none', color: 'var(--fg)', opacity: page === totalPages ? 0.3 : 1 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="cm-right" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <CommercialMap
          items={properties}
          onMarkerClick={(item) => setSelectedProperty(item)}
        />

        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 99999,
                background: 'var(--card)',
                border: '1px solid var(--bd)',
                width: '90%',
                maxWidth: 340,
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            >
              <button
                onClick={() => setSelectedProperty(null)}
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
              >
                ✕
              </button>

              <div style={{ height: 160, width: '100%', position: 'relative' }}>
                <img
                  src={getImageUrl(selectedProperty.images?.[0]?.url)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 4 }}>
                  {selectedProperty.price.toLocaleString('ru-RU')} ₽
                </div>
                <h3 style={{ fontSize: 16, marginBottom: 4, fontWeight: 'bold' }}>{selectedProperty.name}</h3>
                <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 12 }}>
                  {selectedProperty.address}
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 16, fontSize: 12, borderTop: '1px solid var(--bd)', paddingTop: 10 }}>
                  <span>📐 {selectedProperty.area} {t('pd_m2')}</span>
                  <span>🏢 {selectedProperty.floor} {t('pd_floor')}</span>
                </div>

                <Link
                  href={`/commercial/${selectedProperty.id}`}
                  style={{
                    display: 'block', width: '100%', padding: 12, textAlign: 'center',
                    background: 'var(--gold)', color: '#000', fontWeight: 'bold',
                    borderRadius: 10, textDecoration: 'none', fontSize: 14
                  }}
                >
                  {t('card_details')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CommercialPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>{t('sd_loading')}</div>}>
      <CommercialPageContent />
    </Suspense>
  );
}