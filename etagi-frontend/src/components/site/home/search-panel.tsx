'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

export function SearchPanel() {
  const { t } = useTranslation(); // ✅ Hook
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('buy');
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');

  // ✅ TABS va CATEGORIES ni tarjima bilan dinamik qilamiz
  const TABS = [
    { key: 'buy', label: t('search_tab_buy') },
    { key: 'rent', label: t('search_tab_rent') },
    { key: 'sell', label: t('search_tab_sell') },
    { key: 'let', label: t('search_tab_let') },
    { key: 'mort', label: t('search_tab_mort') },
  ];

  const CATEGORIES = [
    { title: t('search_cat_apartments'), filter: '', icon: 'M3 11V7a2 2 0 012-2h14a2 2 0 012 2v4M3 11h18v5H3zM5 16v2M19 16v2' },
    { title: t('search_cat_new'), filter: 'new', icon: 'M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18' },
    { title: t('search_cat_houses'), filter: 'house', icon: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-5h4v5' },
    { title: t('search_cat_cottages'), filter: 'house', icon: 'M2 20h20M4 20v-7l5-4 5 4v7M14 20v-9l4-3 4 3v9' },
    { title: t('search_cat_commercial'), filter: 'com', icon: 'M4 21V8l8-4 8 4v13M9 21v-6h6v6M8 11h2M14 11h2' },
    { title: t('search_cat_construction'), filter: 'house', icon: 'M4 20l9-9M12 6l6 6M14 4l6 6-3 3-6-6z' },
    { title: t('search_cat_garages'), filter: 'com', icon: 'M3 21V9l9-5 9 5v12M7 21v-7h10v7M7 17h10' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (type !== 'all') params.set('filter', type);
    if (rooms) params.set('rooms', rooms);
    if (price) params.set('price', price);
    if (area) params.set('area', area);
    
    router.push(`/novostroyki?${params.toString()}`);
  };

  return (
    <motion.div 
      className="sp"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', zIndex: 50, marginTop: '-70px' }}
    >
      <div className="tb">
        <span className="ind" />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'on' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id="pnl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="pn" 
            id="p-buy"
          >
            <div className="fr">
              <select className="fd" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">{t('search_all_types')}</option>
                <option value="new">{t('search_type_new')}</option>
                <option value="house">{t('search_type_house')}</option>
                <option value="com">{t('search_type_com')}</option>
              </select>
              <select className="fd" value={rooms} onChange={(e) => setRooms(e.target.value)}>
                <option value="">{t('search_rooms')}</option>
                <option value="0">{t('search_studio')}</option>
                <option value="1">{t('search_1room')}</option>
                <option value="2">{t('search_2room')}</option>
                <option value="3">{t('search_3room')}</option>
              </select>
              <select className="fd" value={price} onChange={(e) => setPrice(e.target.value)}>
                <option value="">{t('search_price')}</option>
                <option value="a">{t('search_price_a')}</option>
                <option value="b">{t('search_price_b')}</option>
                <option value="c">{t('search_price_c')}</option>
              </select>
              <select className="fd" value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">{t('search_area')}</option>
                <option value="a">{t('search_area_a')}</option>
                <option value="b">{t('search_area_b')}</option>
                <option value="c">{t('search_area_c')}</option>
              </select>
            </div>
            <div className="fr2">
              <input
                className="fd"
                placeholder={t('search_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="bo">{t('search_more_filters')}</button>
              <button 
                className="bt" 
                style={{ height: 48, flex: 'none', minWidth: 200, borderRadius: 12 }} 
                onClick={handleSearch}
              >
                {t('search_btn')}
              </button>
            </div>
            
            <div className="ts" id="ts">
              {CATEGORIES.map((cat, i) => (
                <motion.div 
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
                  className="t" 
                  tabIndex={0} 
                  onClick={() => router.push(cat.filter ? `/novostroyki?filter=${cat.filter}` : '/novostroyki')}
                >
                  {cat.title}
                  <svg viewBox="0 0 24 24">
                    <path d={cat.icon} />
                  </svg>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}