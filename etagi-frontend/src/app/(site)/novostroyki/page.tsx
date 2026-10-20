'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProperties, Property } from '@/lib/api-properties';
import { NovostroykaCard } from '@/components/site/novostroyki/novostroyka-card';
import { NovostroykiMap } from '@/components/site/novostroyki/novostroyki-map';
import { useTranslation } from '@/lib/i18n';

function NovostroykiPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  // Barcha Filtrlar (URL dan o'qish)
  const currentSearch = searchParams.get('search') || '';
  const currentRooms = searchParams.get('rooms') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentMinArea = searchParams.get('minArea') || '';
  const currentMaxArea = searchParams.get('maxArea') || '';
  const currentType = searchParams.get('type') || '';
  const currentCompletion = searchParams.get('completion') || '';
  const currentDistrict = searchParams.get('district') || '';
  const currentStatus = searchParams.get('status') || '';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const queryParams: any = { page, limit, published: true };

        if (currentSearch) queryParams.search = currentSearch;
        if (currentRooms) queryParams.rooms = Number(currentRooms);
        if (currentMinPrice) queryParams.minPrice = Number(currentMinPrice);
        if (currentMaxPrice) queryParams.maxPrice = Number(currentMaxPrice);
        if (currentMinArea) queryParams.minArea = Number(currentMinArea);
        if (currentMaxArea) queryParams.maxArea = Number(currentMaxArea);
        if (currentType) queryParams.type = currentType;
        if (currentCompletion) queryParams.completionYear = Number(currentCompletion);
        if (currentDistrict) queryParams.district = currentDistrict;
        if (currentStatus) queryParams.status = currentStatus;

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
  }, [page, currentSearch, currentRooms, currentMinPrice, currentMaxPrice, currentMinArea, currentMaxArea, currentType, currentCompletion, currentDistrict, currentStatus]);

  const formattedItems = properties.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    metro: p.metro || t('nzp_metro_default'),
    price: p.price,
    rooms: p.rooms ? `${p.rooms}-${t('nzp_rooms_suffix')}` : t('nzd_room_studio'),
    area: p.area,
    roomsCount: p.rooms || 1,
    info: p.completionDate || t('nzp_completion_default'),
    lat: p.lat || 41.311081,
    lng: p.lng || 69.240562,
    imo: p.imo || t('nzp_imo_default'),
    builder: p.complex?.name || t('nzp_builder_default'),
    isNew: true,
    date: 1,
    img: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  }));

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setPage(1);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="nz-layout">
      <div className="nz-left">
        <div className="nz-bread">
          <Link href="/">{t('pd_bread_home')}</Link>
          <span>›</span>
          <span className="mu">{t('nzp_bread_current')}</span>
        </div>

        <div className="nz-head">
          <div>
            <h1 className="nz-title">{t('nzp_title')}</h1>
            <div className="nz-count"><b>{totalItems}</b> {t('sd_count_offers')}</div>
          </div>
        </div>

        <div className="nz-filters">
          <div className="nz-filter-row">
            <select className="fd" value={currentType} onChange={(e) => updateFilter('type', e.target.value)}>
              <option value="">{t('nzp_filter_all')}</option>
              <option value="kvartira">{t('nzp_filter_apartments')}</option>
              <option value="dom">{t('nzp_filter_houses')}</option>
            </select>

            <select className="fd" value={currentRooms} onChange={(e) => updateFilter('rooms', e.target.value)}>
              <option value="">{t('sd_filter_rooms')}</option>
              <option value="1">{t('search_1room')}</option>
              <option value="2">{t('search_2room')}</option>
              <option value="3">{t('search_3room')}</option>
              <option value="4">{t('nzp_rooms_4plus')}</option>
            </select>

            <select className="fd" value={currentCompletion} onChange={(e) => updateFilter('completion', e.target.value)}>
              <option value="">{t('nzd_deadline_opt')}</option>
              <option value="2025">2025 {t('nzp_year')}</option>
              <option value="2026">2026 {t('nzp_year')}</option>
              <option value="2027">2027 {t('nzp_year')}</option>
            </select>

            <select className="fd" onChange={(e) => {
              const val = e.target.value;
              if (val === '0-50000') { updateFilter('minPrice', '0'); updateFilter('maxPrice', '50000'); }
              else if (val === '50000-100000') { updateFilter('minPrice', '50000'); updateFilter('maxPrice', '100000'); }
              else if (val === '100000+') { updateFilter('minPrice', '100000'); updateFilter('maxPrice', ''); }
              else { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }
            }}>
              <option value="">{t('sd_filter_price')}</option>
              <option value="0-50000">{t('nzp_price_to_50k')}</option>
              <option value="50000-100000">{t('nzp_price_50_100k')}</option>
              <option value="100000+">{t('nzp_price_from_100k')}</option>
            </select>

            <input
              className="fd nz-search"
              placeholder={t('nzp_search_placeholder')}
              defaultValue={currentSearch}
              onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('search', e.currentTarget.value); }}
            />
            <button className="bt nz-find" onClick={() => {
              const input = document.querySelector('.nz-search') as HTMLInputElement;
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
            <div className="nz-grid">
              {formattedItems.length > 0 ? (
                formattedItems.map((item) => (
                  <div key={item.id} onMouseEnter={() => setActiveId(item.id)} onMouseLeave={() => setActiveId(null)}>
                    <NovostroykaCard item={item} isActive={activeId === item.id} />
                  </div>
                ))
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', width: '100%', gridColumn: '1 / -1', color: 'var(--mu)' }}>
                  {t('sd_not_found')}
                </div>
              )}
            </div>

            {/* Pagination */}
            {formattedItems.length > 0 && (
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
                          <button key={pNum} onClick={() => setPage(pNum)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: 'pointer', background: isActive ? 'var(--gold)' : 'transparent', color: isActive ? 'rgb(61 241 5)' : 'var(--fg)', fontWeight: isActive ? 600 : 500, border: 'none' }}>
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

      <div className="nz-right">
        <NovostroykiMap items={formattedItems} activeId={activeId} />
      </div>
    </div>
  );
}

export default function NovostroykiPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>{t('sd_loading')}</div>}>
      <NovostroykiPageContent />
    </Suspense>
  );
}