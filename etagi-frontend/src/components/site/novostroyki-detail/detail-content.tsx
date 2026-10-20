'use client';

import { useState } from 'react';
import { NovostroykaDetail } from '@/lib/static-data';
import { toast } from '@/components/site/common/toast';
import { useTranslation, TranslationKey  } from '@/lib/i18n';
import { DetailMap } from './detail-map';


 const ROOM_OPTIONS = [
    { key: 'nzd_room_all', v: 'Все' },
    { key: 'nzd_room_studio', v: 'Студия' },
    { key: 'nzd_room_1', v: '1' },
    { key: 'nzd_room_2', v: '2' },
    { key: 'nzd_room_3', v: '3' },
    { key: 'nzd_room_4plus', v: '4+' },
  ] as const satisfies readonly { key: TranslationKey; v: string }[];

export function DetailContent({ data }: { data: NovostroykaDetail }) {
  const { t } = useTranslation();
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Flats filtrlari uchun statelar
   const [selectedRoom, setSelectedRoom] = useState<TranslationKey>('nzd_room_all');


  

  return (
    <>
      {/* 1. INFO */}
      <div className="nzd-section">
        <div className="nzd-head-row">
          <div>
            <div className="nzd-rating">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <b>4.8</b>
              <a href="#" className="nzd-reviews-link">{t('nzd_reviews_count')}</a>
            </div>
          </div>
          <div className="nzd-price-block">
            <div className="nzd-price">{t('nzd_price_from')} {data.price.toLocaleString('ru-RU')} ₽</div>
            <div className="nzd-price-m2">{t('nzd_price_from')} {data.m2Price.toLocaleString('ru-RU')} ₽ {t('nzd_per_m2')}</div>
            <div className="nzd-mort-info">{t('nzd_mort_from')}</div>
            <a href="#" className="nzd-mort-link" onClick={() => toast(t('nzd_toast_scroll_mort'))}>{t('nzd_calc_payment')}</a>
          </div>
        </div>

        <div className="nzd-imo" style={{ display: 'inline-block', background: '#d4f0d4', color: '#1e5e1e', padding: '7px 16px', borderRadius: '30px', fontSize: '13px', marginBottom: '16px' }}>
          {data.imo}
        </div>

        <div className="nzd-addr-block">
          <div className="nzd-addr">{data.address}</div>
          <a href="#" className="nzd-onmap">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
            {t('nzd_on_map')}
          </a>
        </div>

        {/* Kichik xarita */}
        <div className="nzd-section" style={{ padding: 12 }}>
          <DetailMap lat={data.lat || 55.7558} lng={data.lng || 37.6173} name={data.name} />
          <a
            href={`https://www.google.com/maps?q=${data.lat || 55.7558},${data.lng || 37.6173}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 8,
              fontSize: 13,
              color: 'var(--g2)',
              textDecoration: 'none',
            }}
          >
            {t('nzd_open_on_map')}
          </a>
        </div>

        <div className="nzd-metro">
          <div className="nzd-metro-item">
            <b>{t('nzd_metro_badge')}</b>{data.metro}<span>{t('nzd_metro_time')}</span>
          </div>
        </div>

        <div className="nzd-specs">
          <div className="nzd-spec"><span>{t('nzd_spec_wall')}</span><b>{data.wall}</b></div>
          <div className="nzd-spec"><span>{t('nzd_spec_builder')}</span><b>{data.builder} ★</b></div>
          <div className="nzd-spec"><span>{t('nzd_spec_class')}</span><b>{data.cls}</b></div>
          <div className="nzd-spec"><span>{t('nzd_spec_deadline')}</span><b>{data.info}</b></div>
        </div>
      </div>

      {/* 2. FLATS */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_choose_flat')}</h2>

        <div className="nzd-pick-form">
          {/* Komnatnost */}
          <div className="nzd-pick-field">
            <label>{t('nzd_rooms_label')}</label>
             <div className="nzd-rooms">
              {ROOM_OPTIONS.map((r) => (
                <button
                  key={r.key}
                  className={`nzd-room ${selectedRoom === r.key ? 'on' : ''}`}
                  onClick={() => setSelectedRoom(r.key)}
                >
                  {t(r.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Narx va Maydon */}
          <div className="nzd-pick-row">
            <div className="nzd-pick-field">
              <label>{t('nzd_price_label')}</label>
              <div className="nzd-range">
                <input className="fd" placeholder={t('nzd_from')} />
                <input className="fd" placeholder={t('nzd_to')} />
              </div>
            </div>
            <div className="nzd-pick-field">
              <label>{t('nzd_area_label')}</label>
              <div className="nzd-range">
                <input className="fd" placeholder={t('nzd_from')} />
                <input className="fd" placeholder={t('nzd_to')} />
              </div>
            </div>
          </div>

          {/* Selectlar */}
          <div className="nzd-pick-row">
            <select className="fd"><option>{t('nzd_finish_opt')}</option></select>
            <select className="fd"><option>{t('nzd_deadline_opt')}</option></select>
          </div>

          {/* Tugmalar */}
          <div className="nzd-pick-actions">
            <button className="nzd-more-filters">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
              {t('nzd_more_filters')}
            </button>
            <div className="nzd-pick-btns">
              <button className="bo">{t('nzd_clear')}</button>
              <button className="nzd-btn nzd-btn-red">{t('nzd_show_offers')} {data.flats.length} {t('nzd_offers_word')}</button>
            </div>
          </div>
        </div>

        {/* Kvartiralar ro'yxati */}
        <div className="nzd-flats">
          {data.flats.map((f, i) => (
            <div className="nzd-flat" key={i}>
              <div className="nzd-flat-info">
                <b>{f.r}</b>
                <span>{f.m} {t('nzd_m2_short')} · {f.fl} {t('nzd_floor')} · {t('nzd_ready_short')} {f.ready}</span>
              </div>
              <div className="nzd-flat-price">
                <b>{f.p.toLocaleString('ru-RU')} ₽</b>
                <span>{Math.round(f.p / f.m).toLocaleString('ru-RU')} ₽/{t('nzd_m2_short')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FEATURES */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_features_title')}</h2>
        <div className="nzd-feat-group">
          <div className="nzd-feat-title">{t('nzd_feat_house')}</div>
          <div className="nzd-chips">
            {data.houseChips.map(c => <span key={c} className="nzd-chip">{c}</span>)}
          </div>
        </div>
        <div className="nzd-feat-group">
          <div className="nzd-feat-title">{t('nzd_feat_complex')}</div>
          <div className="nzd-chips">
            {data.complexChips.map(c => <span key={c} className="nzd-chip">{c}</span>)}
          </div>
        </div>
      </div>

      {/* 4. GENPLAN */}
      <div className="nzd-section">
        <div className="nzd-tabs-mini">
          <button className="nzd-mini-tab2 on">{t('nzd_tab_genplan')}</button>
          <button className="nzd-mini-tab2">{t('nzd_tab_panorama')}</button>
        </div>
        <div className="nzd-genplan">
          <img src={data.genplan.img} alt={t('nzd_tab_genplan')} />
          <div className="nzd-genplan-tip">
            <div className="nzd-gt-title">{data.genplan.title}</div>
            <div className="nzd-gt-sub">{data.genplan.status}</div>
            <div className="nzd-gt-sub">{data.genplan.keys}</div>
            <div className="nzd-gt-list">
              {data.genplan.items.map((item) => (
                <div key={item.r}><b>{item.r}</b> {item.m} <span>{item.p}</span></div>
              ))}
            </div>
            <a href="#" className="nzd-gt-all">{t('nzd_show_all')}</a>
          </div>
        </div>
      </div>

      {/* 5. DESCRIPTION */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_desc_title')}</h2>
        <p className="nzd-text">{descExpanded ? data.descFull : data.descShort}</p>
        <button className="nzd-more" onClick={() => setDescExpanded(!descExpanded)}>
          {descExpanded ? `${t('nzd_collapse')} ⌃` : `${t('nzd_show_more')} ⌄`}
        </button>
      </div>

      {/* 6. VIDEO */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_video_title')}</h2>
        <div className="nzd-videos">
          {data.videos.map((v) => (
            <div className="nzd-video-item" key={v.id} onClick={() => setActiveVideo(v.id)}>
              {activeVideo === v.id ? (
                <iframe src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`} allowFullScreen style={{ border: 0, width: '100%', height: '100%' }} />
              ) : (
                <div className="nzd-video-cover" style={{ backgroundImage: `url(${v.cover})` }}>
                  <div className="nzd-video-cover-play">▶</div>
                  <div className="nzd-video-title">{v.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. PROGRESS */}
      <div className="nzd-section">
        <h2 className="nzd-h2">{t('nzd_progress_title')}</h2>
        <div className="nzd-progress-filters">
          <select className="fd"><option>{t('nzd_progress_filter1')}</option></select>
          <select className="fd"><option>{t('nzd_progress_filter2')}</option></select>
        </div>
        <div className="nzd-progress-photos">
          {data.progressPhotos.map((p, i) => (
            <div key={i} className="nzd-pp" style={{ backgroundImage: `url(${p.img})` }}>
              <span>📷 {p.date}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}