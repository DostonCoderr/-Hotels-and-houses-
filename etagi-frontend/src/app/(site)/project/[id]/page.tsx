// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { getProjectDetail, PROJECTS } from '@/lib/static-data';
// import { toast } from '@/components/site/common/toast';
// import { ViewTracker } from '@/components/site/common/view-tracker';
// import { api } from '@/lib/api';
// import { useTranslation } from '@/lib/i18n';
// import type { TranslationKey } from '@/lib/i18n';

// export default function ProjectDetailPage({ params }: { params: { id: string } }) {
//   const id = Number(params.id);
//   const router = useRouter();
//   const { t } = useTranslation();
//   const data = getProjectDetail(id);

//   // Galereya
//   const [mainImg, setMainImg] = useState(data.imgs[0]);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [galleryIdx, setGalleryIdx] = useState(0);

//   // Tabs va Boshqa holatlar
//   const [activeTab, setActiveTab] = useState<'gallery' | 'chars' | 'compl' | 'company' | 'mort' | 'similar'>('gallery');
//   const [compl, setCompl] = useState<'cold' | 'draft' | 'prefin'>('cold');
//   const [isFav, setIsFav] = useState(false);
//   const [isPhoneVisible, setIsPhoneVisible] = useState(false);
//   const [showSeoMore, setShowSeoMore] = useState(false);
//   const [isMortResult, setIsMortResult] = useState(false);

//   // Ipoteka statelari
//   const [price, setPrice] = useState(data.price);
//   const [down, setDown] = useState(Math.round(data.price * 0.3));
//   const [years, setYears] = useState(30);
//   const [rate, setRate] = useState(6);

//   const Pn = price - down;
//   const r = rate / 100 / 12;
//   const n = years * 12;
//   const monthlyPay = r === 0 ? Pn / n : (Pn * r) / (1 - Math.pow(1 + r, -n));
//   const totalPay = monthlyPay * n;
//   const overpay = totalPay - Pn;

//   const complData = {
//     cold: { price: data.price },
//     draft: { price: data.price + 350000 },
//     prefin: { price: data.price + 800000 },
//   };

//   // ✅ TABS — komponent ichida (t() hook natijasi)
//   const TABS: { id: string; key: TranslationKey }[] = [
//     { id: 'gallery', key: 'pdp_tab_gallery' },
//     { id: 'chars', key: 'pdp_tab_chars' },
//     { id: 'compl', key: 'pdp_tab_compl' },
//     { id: 'company', key: 'pdp_tab_company' },
//     { id: 'mort', key: 'pdp_tab_mort' },
//     { id: 'similar', key: 'pdp_tab_similar' },
//   ];

//   // Galereya modalini boshqarish
//   const openGallery = (index: number) => {
//     setGalleryIdx(index);
//     setIsGalleryOpen(true);
//   };

//   const nextImg = (e?: React.MouseEvent) => {
//     e?.stopPropagation();
//     setGalleryIdx((p) => (p + 1) % data.imgs.length);
//   };

//   const prevImg = (e?: React.MouseEvent) => {
//     e?.stopPropagation();
//     setGalleryIdx((p) => (p === 0 ? data.imgs.length - 1 : p - 1));
//   };

//   // Modal ochiq bo'lganda Escape bosilsa yopish va Scrollni to'xtatish
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') setIsGalleryOpen(false);
//       if (e.key === 'ArrowRight') nextImg();
//       if (e.key === 'ArrowLeft') prevImg();
//     };
//     if (isGalleryOpen) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('keydown', handleKeyDown);
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isGalleryOpen]);

//   // Podelitsya funksiyasi
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({ title: data.name, url: window.location.href }).catch(() => {});
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast(t('nzd_toast_link_copied'));
//     }
//   };

//   return (
//     <main className="sd-main sd-project-page">
//       <ViewTracker propertyId={Number(id)} />
//       <div className="w">
//         <div className="sd-bread">
//           <Link href="/">{t('pd_bread_home')}</Link><span>›</span>
//           <Link href="/stroitelstvo">{t('pd_bread_stroitelstvo')}</Link><span>›</span>
//           <span className="mu">{data.name}</span>
//         </div>
//       </div>

//       <div className="w">
//         <div className="pj-tabs">
//           {TABS.map(tab => (
//             <button key={tab.id} className={`pj-tab ${activeTab === tab.id ? 'on' : ''}`} onClick={() => setActiveTab(tab.id as any)}>
//               {t(tab.key)}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="w">
//         <div className="pj-layout">
//           <div className="pj-left">

//             {/* 1. GALLERY */}
//             {activeTab === 'gallery' && (
//               <div className="pj-section">
//                 <div className="pj-gallery">
//                   <div className="pj-gallery-main">
//                     <img src={mainImg} alt="" />
//                     <span className="pj-gallery-counter">1 / {data.imgs.length}</span>
//                     <button className="pj-gallery-more" onClick={() => openGallery(data.imgs.indexOf(mainImg))}>
//                       <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
//                       {t('pdp_view_all_photos')}
//                     </button>
//                     <button className="pj-gallery-nav prev" onClick={() => setMainImg(data.imgs[(data.imgs.indexOf(mainImg) - 1 + data.imgs.length) % data.imgs.length])}>‹</button>
//                     <button className="pj-gallery-nav next" onClick={() => setMainImg(data.imgs[(data.imgs.indexOf(mainImg) + 1) % data.imgs.length])}>›</button>
//                   </div>
//                   <div className="pj-gallery-thumbs">
//                     {data.imgs.slice(1, 5).map((src, i) => (
//                       <div key={i} className={`pj-thumb ${mainImg === src ? 'on' : ''}`} onClick={() => setMainImg(src)}>
//                         <img src={src} alt="" />
//                         {i === 0 && <span className="pj-thumb-label">{t('pdp_thumb_plan')}</span>}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* TITLE */}
//             <div className="pj-section">
//               <div className="pj-title-row">
//                 <div>
//                   <h1>{data.name}</h1>
//                   <div className="pj-meta">
//                     <span>{data.rooms} {t('pdp_rooms')}</span>
//                     <span>{data.area} {t('pd_m2')}</span>
//                     <span>{data.floors} {t('pd_floor')}</span>
//                     <span>{data.mat}</span>
//                   </div>
//                   <div className="pj-badges">
//                     <span className="pj-badge">✓ {t('pdp_badge_warranty')}</span>
//                     <span className="pj-badge pj-badge-blue">⏱ {t('pdp_badge_term')}</span>
//                     <span className="pj-badge pj-badge-green">★ {t('pdp_badge_mortgage')}</span>
//                   </div>
//                 </div>
//                 <div className="pj-price-block">
//                   <div className="pj-price">{t('pd_price_from')} <b>{data.price.toLocaleString('ru-RU')} ₽</b></div>
//                   <div className="pj-price-note">{t('pd_price_note')}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Features */}
//             <div className="pj-quick">
//               <div className="pj-quick-item"><div className="pj-quick-icon">⌂</div><div className="pj-quick-info"><b>{data.area} {t('pd_m2')}</b><span>{t('pdp_quick_area')}</span></div></div>
//               <div className="pj-quick-item"><div className="pj-quick-icon">⌂</div><div className="pj-quick-info"><b>{data.floors}</b><span>{t('pdp_quick_floor')}</span></div></div>
//               <div className="pj-quick-item"><div className="pj-quick-icon">⏱</div><div className="pj-quick-info"><b>{t('pdp_quick_term_val')}</b><span>{t('pdp_quick_term')}</span></div></div>
//               <div className="pj-quick-item"><div className="pj-quick-icon">♡</div><div className="pj-quick-info"><b>{data.rooms}</b><span>{t('pdp_quick_rooms')}</span></div></div>
//             </div>

//             {/* CHARS */}
//             {activeTab === 'chars' && (
//               <div className="pj-section">
//                 <h2 className="pj-h2">{t('pd_chars_title')}</h2>
//                 <div className="pj-sub">{t('pdp_chars_sub')}</div>
//                 <div className="pj-chars-grid">
//                   <div><span>{t('pd_char_area')}</span><b>{data.area} {t('pd_m2')}</b></div>
//                   <div><span>{t('pd_char_rooms')}</span><b>{data.rooms}</b></div>
//                   <div><span>{t('pd_char_bathrooms')}</span><b>{data.chars.sanuzlov}</b></div>
//                   <div><span>{t('pd_char_kitchen')}</span><b>{data.chars.kitchen} {t('pd_m2')}</b></div>
//                   <div><span>{t('pd_char_floors')}</span><b>{data.floors}</b></div>
//                   <div><span>{t('pd_char_terrace')}</span><b>{data.chars.terrace}</b></div>
//                   <div><span>{t('pd_char_wall_height')}</span><b>{data.chars.wallHeight}</b></div>
//                   <div><span>{t('pd_char_foundation')}</span><b>{data.chars.foundation}</b></div>
//                   <div><span>{t('pd_char_roof')}</span><b>{data.chars.roof}</b></div>
//                   <div><span>{t('pd_char_material')}</span><b>{data.mat}</b></div>
//                 </div>
//               </div>
//             )}

//             {/* COMPLECTATIONS */}
//             {activeTab === 'compl' && (
//               <div className="pj-section">
//                 <h2 className="pj-h2">{t('pd_packages_title')}</h2>
//                 <p className="mu" style={{ fontSize: 13.5, marginBottom: 18 }}>{t('pd_packages_desc')}</p>

//                 <div className="pj-compl-tabs">
//                   <button className={`pj-compl-tab ${compl === 'cold' ? 'on' : ''}`} onClick={() => setCompl('cold')}><b>{t('pdp_compl_cold')}</b><span>{t('pdp_compl_cold_sub')}</span></button>
//                   <button className={`pj-compl-tab ${compl === 'draft' ? 'on' : ''}`} onClick={() => setCompl('draft')}><b>{t('pdp_compl_draft')}</b><span>+ 350 000 ₽</span></button>
//                   <button className={`pj-compl-tab ${compl === 'prefin' ? 'on' : ''}`} onClick={() => setCompl('prefin')}><b>{t('pdp_compl_prefin')}</b><span>+ 800 000 ₽</span></button>
//                 </div>

//                 <div className="pj-compl-price">{t('pdp_compl_price')} {complData[compl].price.toLocaleString('ru-RU')} ₽</div>

//                 <div className="pj-compl-body">
//                   <div className="pj-compl-row"><span>{t('pdp_compl_row_price')}</span><b>{t('pd_price_from')} {complData[compl].price.toLocaleString('ru-RU')} ₽</b></div>
//                   <div className="pj-compl-row"><span>{t('pd_char_foundation')}</span><b>{data.chars.foundation}</b></div>
//                   <div className="pj-compl-row"><span>{t('pd_char_roof')}</span><b>{data.chars.roof}</b></div>
//                   <div className="pj-compl-row"><span>{t('pdp_compl_row_walls')}</span><b>{data.mat}</b></div>
//                   <div className="pj-compl-row"><span>{t('pdp_compl_row_windows')}</span><b>{t('pdp_compl_windows_val')}</b></div>
//                   <div className="pj-compl-row"><span>{t('pdp_compl_row_finish')}</span><b>{compl === 'cold' ? t('pdp_compl_finish_none') : t('pdp_compl_finish_draft')}</b></div>
//                 </div>
//               </div>
//             )}

//             {/* COMPANY */}
//             {activeTab === 'company' && (
//               <div className="pj-section">
//                 <h2 className="pj-h2">{t('pd_company_title')}</h2>
//                 <div className="pj-company-head">
//                   <div className="pj-company-logo">{data.company.charAt(0)}</div>
//                   <div><b>{data.company}</b><div className="mu" style={{ fontSize: 13 }}>{t('pd_company_type')}</div></div>
//                   <div className="pj-company-rating"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span><b>4.9</b></div>
//                 </div>
//                 <p className="pj-text">{data.companyText}</p>
//                 <div className="pj-company-feats">
//                   <div className="pj-feat"><div><b>{data.year} {t('pdp_company_year')}</b><span>{t('pdp_company_year_label')}</span></div><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a6ee0" strokeWidth="1.6"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></svg></div>
//                   <div className="pj-feat"><div><b>{t('pdp_quick_term_val')}</b><span>{t('pdp_company_period_label')}</span></div><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#3a6ee0" strokeWidth="1.6"><path d="M3 11l9-7 9 7M5 10v10h14V10" /></svg></div>
//                 </div>
//                 <div className="pj-sub" style={{ marginTop: 24 }}>{t('pdp_company_extra')}</div>
//                 <div className="pj-extra"><div>{t('pdp_company_tradein')}</div><div className="pj-extra-val">{t('pd_yes')}</div></div>
//               </div>
//             )}

//             {/* MORTGAGE */}
//             {activeTab === 'mort' && (
//               <div className="pj-section">
//                 <h2 className="pj-h2">{t('pd_mort_title')}</h2>
//                 <p className="mu" style={{ marginBottom: 20 }}>{t('pd_mort_desc')}</p>

//                 <div className="pj-mort-tabs">
//                   <button className="pj-mort-tab on">{t('pdp_mort_tab_fast')}</button>
//                   <button className="pj-mort-tab">{t('pdp_mort_tab_detail')}</button>
//                 </div>

//                 <div className="pj-mort-form">
//                   <div className="pj-mort-field">
//                     <label>{t('pd_mort_price')}</label>
//                     <div className="pj-mort-input"><input type="text" value={price.toLocaleString('ru-RU')} onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, '')) || 0)} /><span>₽</span></div>
//                   </div>
//                   <div className="pj-mort-field">
//                     <label>{t('pd_mort_down')}</label>
//                     <div className="pj-mort-input"><input type="text" value={down.toLocaleString('ru-RU')} onChange={(e) => setDown(Number(e.target.value.replace(/\D/g, '')) || 0)} /><span>₽</span></div>
//                   </div>
//                   <div className="pj-mort-field">
//                     <label>{t('pdp_mort_term')}</label>
//                     <div className="pj-mort-input"><input type="text" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} /><span>{t('nzd_years')}</span></div>
//                   </div>
//                 </div>

//                 <div className="pj-mort-rate">
//                   <label>{t('pdp_mort_rate')}</label>
//                   <div className="pj-mort-rate-btns">
//                     <button className={`pj-rate-btn ${rate === 6 ? 'on' : ''}`} onClick={() => setRate(6)}>{t('pdp_mort_rate_family')}</button>
//                     <button className={`pj-rate-btn ${rate === 8 ? 'on' : ''}`} onClick={() => setRate(8)}>{t('pdp_mort_rate_pref')}</button>
//                     <button className={`pj-rate-btn ${rate === 15 ? 'on' : ''}`} onClick={() => setRate(15)}>{t('pdp_mort_rate_base')}</button>
//                   </div>
//                 </div>

//                 <div className="pj-mort-result">
//                   <div>
//                     <span className="mu">{t('nzd_monthly_payment')}</span>
//                     <div className="pj-mort-pay">{isFinite(monthlyPay) && monthlyPay > 0 ? Math.round(monthlyPay).toLocaleString('ru-RU') : 0} ₽</div>
//                     <div className="mu" style={{ fontSize: 12, marginTop: 6 }}>{t('nzd_overpay')}: {isFinite(overpay) && overpay > 0 ? Math.round(overpay).toLocaleString('ru-RU') : 0} ₽ · {t('nzd_total')}: {isFinite(totalPay) && totalPay > 0 ? Math.round(totalPay).toLocaleString('ru-RU') : 0} ₽</div>
//                   </div>
//                   <button className="bt" onClick={() => { setIsMortResult(true); toast(t('pdp_toast_mort_sent')); }}>{t('pd_mort_btn')}</button>
//                 </div>
//               </div>
//             )}

//             {/* SIMILAR */}
//             {activeTab === 'similar' && (
//               <div className="pj-section">
//                 <h2 className="pj-h2">{t('pdp_similar_title')}</h2>
//                 <div className="sd-grid">
//                   {PROJECTS.filter(p => p.id !== data.id).slice(0, 3).map(p => (
//                     <Link href={`/project/${p.id}`} key={p.id} className="sd-card" style={{ textDecoration: 'none' }}>
//                       <div className="sd-card-img"><img src={p.img} alt="" /><span className="sd-card-count">1/{p.count}</span></div>
//                       <div className="sd-card-body">
//                         <div className="sd-card-title">{p.name}, {t('pd_price_from')} {p.price.toLocaleString('ru-RU')} ₽</div>
//                         <div className="sd-card-meta"><span>{p.rooms} {t('pdp_rooms')}</span><span>{p.area} {t('pd_m2')}</span><span>{p.floors} {t('pd_floor')}</span></div>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* SEO */}
//             <div className="pj-section">
//               <p className="mu">{t('pdp_seo_line')} {data.name}, ID {data.id}</p>
//               <div className="pj-sub" style={{ marginTop: 20 }}>{t('pdp_seo_popular')}</div>
//               <button className="pj-more" onClick={() => setShowSeoMore(!showSeoMore)}>
//                 {showSeoMore ? `${t('sd_seo_hide')} ⌃` : `${t('sd_seo_show')} ⌄`}
//               </button>
//               {showSeoMore && (
//                 <div className="mt-4 text-sm text-muted-foreground space-y-2">
//                   <p>{t('pdp_seo_full')}</p>
//                   <div className="flex gap-4 mt-2">
//                     <a href="#" className="text-blue-500">{t('sd_filter_barn')}</a>
//                     <a href="#" className="text-blue-500">{t('sd_filter_frame')}</a>
//                     <a href="#" className="text-blue-500">{t('sd_filter_brick')}</a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* SIDEBAR */}
//           <aside className="pj-side">
//             <div className="pj-agent">
//               <div className="pj-agent-head">
//                 <div className="pj-agent-ava"><img src="https://i.pravatar.cc/100?u=agent" alt="" /><span className="pj-agent-online"></span></div>
//                 <div><b>{t('pd_agent_name_full')}</b><div className="pj-agent-role">{t('pd_agent_role')}</div></div>
//               </div>

//               <button className="pj-agent-btn" onClick={() => setIsPhoneVisible(true)}>
//                 {isPhoneVisible ? '+7 (800) 555-35-35' : t('pd_show_phone')}
//               </button>
//               <button className="pj-agent-btn pj-agent-btn-red" onClick={() => toast(t('pdp_toast_app_sent'))}>
//                 {t('nzd_contact_me')}
//               </button>

//               <button
//                 className="pj-agent-btn"
//                 style={{ background: '#10b981', color: '#fff', marginTop: 10, border: 'none' }}
//                 onClick={async () => {
//                   const token = localStorage.getItem('site-token');
//                   if (!token) {
//                     toast(t('pd_toast_login_view'));
//                     router.push('/login');
//                     return;
//                   }
//                   try {
//                     await api.post('/applications', {
//                       type: 'scheduled',
//                       propertyId: data?.id,
//                       name: t('pd_scheduled_name'),
//                       phone: '+7 (800) 555-35-35',
//                       message: `${t('pd_scheduled_message')} ${data?.name}`,
//                       source: 'site',
//                     });
//                     toast(t('pd_toast_scheduled_ok'));
//                   } catch (error) {
//                     toast(t('pd_toast_scheduled_error'));
//                   }
//                 }}
//               >
//                 {t('pd_schedule_view')}
//               </button>

//               <div className="pj-agent-actions">
//                 <button className="pj-agent-act" onClick={handleShare}>{t('nzd_share')}</button>
//                 <button className={`pj-agent-act ${isFav ? 'on' : ''}`} onClick={() => { setIsFav(!isFav); toast(isFav ? t('toast_fav_removed') : t('toast_fav_added')); }}>
//                   {isFav ? t('nzd_in_fav') : t('nzd_add_to_fav')}
//                 </button>
//               </div>
//             </div>

//             <div className="pj-mini-form">
//               <b>{t('pd_get_consult')}</b>
//               <p className="mu">{t('pd_modal_desc')}</p>
//               <input className="fd" placeholder={t('pd_modal_name')} />
//               <input className="fd" placeholder={t('pd_modal_phone')} inputMode="tel" />
//               <button className="bt" onClick={() => toast(t('pdp_toast_consult_sent'))}>{t('pd_modal_submit')}</button>
//             </div>

//             <div className="pj-facts">
//               <div className="pj-fact">★ {t('pd_badge_warranty')}</div>
//               <div className="pj-fact">✓ {t('pd_side_fixed_price')}</div>
//               <div className="pj-fact">⏱ {t('pd_badge_term')}</div>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* ================== GALLERY MODAL ================== */}
//       {isGalleryOpen && (
//         <div className="pj-modal on" onClick={() => setIsGalleryOpen(false)}>
//           <div className="pj-modal-back" />
//           <div className="pj-modal-body" onClick={(e) => e.stopPropagation()}>
//             <button className="pj-modal-close" onClick={() => setIsGalleryOpen(false)}>✕</button>
//             <button className="pj-modal-nav prev" onClick={prevImg}>‹</button>

//             <img id="pjModalImg" src={data.imgs[galleryIdx]} alt="" />

//             <button className="pj-modal-nav next" onClick={nextImg}>›</button>
//             <div className="pj-modal-counter">{galleryIdx + 1} / {data.imgs.length}</div>

//             <div className="pj-modal-thumbs">
//               {data.imgs.map((src, i) => (
//                 <img key={i} src={src} className={galleryIdx === i ? 'on' : ''} onClick={() => setGalleryIdx(i)} />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }