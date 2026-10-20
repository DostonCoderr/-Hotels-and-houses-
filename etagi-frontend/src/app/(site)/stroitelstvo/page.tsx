'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProjects, Project } from '@/lib/api-projects';
import { ProjectCard } from '@/components/site/stroitelstvo/project-card';
import { useTranslation } from '@/lib/i18n';

function StroitelstvoPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seoExpanded, setSeoExpanded] = useState(false);
  const limit = 8;

  // Filtrlar (URL dan o'qish)
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const queryParams: any = { page, limit, published: true };
        if (currentSearch) queryParams.search = currentSearch;
        if (currentCategory) queryParams.category = currentCategory;

        const res = await fetchProjects(queryParams);
        setProjects(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Xato:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, currentSearch, currentCategory]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setPage(1);
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="sd-main">
      {/* HERO */}
      <div className="w">
        <div className="sd-hero">
          <div className="sd-hero-content">
            <div className="sd-hero-eyebrow">{t('sd_hero_eyebrow')}</div>
            <h1 className="sd-hero-title">
              {t('sd_hero_title_1')} <em>{t('sd_hero_title_em')}</em>
            </h1>
            <p className="sd-hero-sub">
              {t('sd_hero_sub_1')} {total} {t('sd_hero_sub_2')}
            </p>
            <div className="sd-hero-stats">
              <div className="sd-hero-stat"><b>{total}</b><span>{t('sd_hero_stat_projects')}</span></div>
              <div className="sd-hero-stat"><b>48</b><span>{t('sd_hero_stat_companies')}</span></div>
              <div className="sd-hero-stat"><b>18</b><span>{t('sd_hero_stat_years')}</span></div>
            </div>
          </div>
          <div className="sd-hero-decor">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" alt="" />
          </div>
        </div>
      </div>

      {/* BREADCRUMBS */}
      <div className="w">
        <div className="sd-bread">
          <Link href="/">{t('sd_bread_home')}</Link>
          <span>›</span>
          <span className="mu">{t('sd_bread_current')}</span>
        </div>
      </div>

      {/* HEADER + SORT */}
      <div className="w">
        <div className="sd-head">
          <div>
            <h1 className="sd-title">{t('sd_title')}</h1>
            <div className="sd-count"><b>{total}</b> {t('sd_count_offers')}</div>
          </div>
          <div className="sd-head-actions">
            <select className="fd sd-sort">
              <option>{t('sd_sort_popular')}</option>
              <option>{t('sd_sort_price')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="w">
        <div className="sd-filters">
          <div className="sd-filter-row">
            <select className="fd" value={currentCategory} onChange={(e) => updateFilter('category', e.target.value)}>
              <option value="">{t('sd_filter_all')}</option>
              <option value="project">{t('sd_filter_projects')}</option>
              <option value="barn">{t('sd_filter_barn')}</option>
              <option value="module">{t('sd_filter_module')}</option>
              <option value="frame">{t('sd_filter_frame')}</option>
              <option value="brick">{t('sd_filter_brick')}</option>
            </select>

            <select className="fd"><option>{t('sd_filter_rooms')}</option></select>
            <select className="fd"><option>{t('sd_filter_price')}</option></select>
            <select className="fd"><option>{t('sd_filter_area')}</option></select>
            <select className="fd"><option>{t('sd_filter_material')}</option></select>

            <input
              className="fd"
              placeholder={t('sd_filter_search_placeholder')}
              defaultValue={currentSearch}
              onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('search', e.currentTarget.value); }}
            />
            <button className="bt sd-find" onClick={() => {
              const input = document.querySelector('.sd-filter-row input') as HTMLInputElement;
              updateFilter('search', input?.value || '');
            }}>{t('sd_filter_find')}</button>
          </div>
        </div>
      </div>

      {/* PROMO TILES */}
      <div className="w">
        <div className="sd-promos">
          <div className="sd-promo" style={{ backgroundImage: 'linear-gradient(135deg,#e04545,#a82a2a)' }}>
            <div className="sd-promo-content"><b>{t('sd_promo1_title')}</b><span>{t('sd_promo1_desc')}</span></div>
            <div className="sd-promo-arrow">→</div>
          </div>
          <div className="sd-promo" style={{ backgroundImage: 'linear-gradient(135deg,#3a6ee0,#1a3ea8)' }}>
            <div className="sd-promo-content"><b style={{ fontSize: 44 }}>0₽</b><span>{t('sd_promo2_desc')}</span></div>
            <div className="sd-promo-arrow">→</div>
          </div>
          <div className="sd-promo" style={{ backgroundImage: 'linear-gradient(135deg,#4ea87a,#1f6b48)' }}>
            <div className="sd-promo-content"><b>{t('sd_promo3_title')}</b><span>{t('sd_promo3_desc')}</span></div>
            <div className="sd-promo-arrow">→</div>
          </div>
          <div className="sd-promo" style={{ backgroundImage: 'linear-gradient(135deg,#c9a36a,#8a5f27)' }}>
            <div className="sd-promo-content"><b>{t('sd_promo4_title')}</b><span>{t('sd_promo4_desc')}</span></div>
            <div className="sd-promo-arrow">→</div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="w">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>{t('sd_loading')}</div>
        ) : (
          <div className="sd-grid">
            {projects.length > 0 ? (
              projects.map(item => <ProjectCard key={item.id} item={item} />)
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--mu)' }}>
                {t('sd_not_found')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="w">
          <div className="sd-pagination" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40 }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                className={page === i + 1 ? 'on' : ''}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        </div>
      )}

      {/* CONSULTATION FORM */}
      <div className="w">
        <div className="sd-consult">
          <div className="sd-consult-grid">
            <div>
              <h2>{t('sd_consult_title')}</h2>
              <p className="mu">
                {t('sd_consult_desc')}{' '}
                <a href="tel:+78005553535" style={{ color: 'var(--g2)', textDecoration: 'none' }}>+7 800 555-35-35</a>
              </p>
              <div className="sd-consult-feats">
                <div className="sd-consult-feat">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('sd_consult_feat1')}
                </div>
                <div className="sd-consult-feat">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('sd_consult_feat2')}
                </div>
                <div className="sd-consult-feat">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg> {t('sd_consult_feat3')}
                </div>
              </div>
            </div>
            <div className="sd-consult-form">
              <input className="fd" placeholder={t('sd_consult_name')} />
              <div className="sd-phone-row">
                <span className="sd-flag">{t('sd_consult_flag')}</span>
                <input className="fd" placeholder={t('sd_consult_phone')} inputMode="tel" />
              </div>
              <button className="bt">{t('sd_consult_btn')}</button>
              <p className="sd-agree">
                {t('sd_consult_agree_1')}{' '}
                <a href="#">{t('sd_consult_agree_link')}</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO TEXT */}
      <div className="w">
        <div className="sd-seo">
          <h3>{t('sd_seo_title')}</h3>
          <p>{t('sd_seo_short')}</p>

          {seoExpanded && (
            <div className="sd-seo-hidden on">
              <p>{t('sd_seo_full')}</p>
              <div className="sd-seo-cols">
                <div>
                  <b>{t('sd_seo_popular_cats')}</b>
                  <a href="#">{t('sd_filter_barn')}</a>
                  <a href="#">{t('sd_filter_module')}</a>
                  <a href="#">{t('sd_filter_frame')}</a>
                  <a href="#">{t('sd_filter_brick')}</a>
                </div>
                <div>
                  <b>{t('sd_seo_popular_queries')}</b>
                  <a href="#">{t('sd_seo_q1')}</a>
                  <a href="#">{t('sd_seo_q2')}</a>
                  <a href="#">{t('sd_seo_q3')}</a>
                  <a href="#">{t('sd_seo_q4')}</a>
                </div>
              </div>
            </div>
          )}

          <button className="sd-seo-more" onClick={() => setSeoExpanded(!seoExpanded)}>
            {seoExpanded ? `${t('sd_seo_hide')} ⌃` : `${t('sd_seo_show')} ⌄`}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function StroitelstvoPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>{t('sd_loading')}</div>}>
      <StroitelstvoPageContent />
    </Suspense>
  );
}