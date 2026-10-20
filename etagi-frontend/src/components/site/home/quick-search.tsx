'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

const EZ: [number, number, number, number] = [0.22, 1, 0.36, 1];

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const tile: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EZ } },
};

// ✅ Rasm manzillari (xohlasangiz static-datadan ham olishingiz mumkin)
const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
];

export function QuickSearch() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState('quick_cat_apartments');

  const CATEGORIES = [
    { key: 'quick_cat_apartments', label: t('quick_cat_apartments') },
    { key: 'quick_cat_new', label: t('quick_cat_new') },
    { key: 'quick_cat_houses', label: t('quick_cat_houses') },
    { key: 'quick_cat_projects', label: t('quick_cat_projects') },
    { key: 'quick_cat_commercial', label: t('quick_cat_commercial') },
    { key: 'quick_cat_garages', label: t('quick_cat_garages') },
  ];

  const TAGS: Record<string, string[]> = {
    quick_cat_apartments: [t('quick_tag_1'), t('quick_tag_2'), t('quick_tag_3'), t('quick_tag_4')],
    quick_cat_new: [t('quick_tag_5'), t('quick_tag_6'), t('quick_tag_7'), t('quick_tag_8')],
    quick_cat_houses: [t('quick_tag_9'), t('quick_tag_10'), t('quick_tag_11'), t('quick_tag_12')],
    quick_cat_projects: [t('quick_tag_13'), t('quick_tag_14'), t('quick_tag_15'), t('quick_tag_16')],
    quick_cat_commercial: [t('quick_tag_17'), t('quick_tag_18'), t('quick_tag_19'), t('quick_tag_20')],
    quick_cat_garages: [t('quick_tag_21'), t('quick_tag_22'), t('quick_tag_23'), t('quick_tag_24')],
  };

  return (
    <section className="sc">
      <div className="w">
        <div className="hd2">
          <h2>{t('quick_title')}</h2>
          <button className="ic" aria-label="Дальше">›</button>
        </div>

        <div className="chips">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              className={activeCat === cat.key ? 'on' : ''}
              onClick={() => setActiveCat(cat.key)}
              whileTap={{ scale: 0.94 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            className="qr"
            variants={list}
            initial="hidden"
            animate="show" // ✅ whileInView o'rniga animate ishlatildi
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
          >
            {TAGS[activeCat].map((tag, i) => (
              <motion.div 
                className="q" 
                key={tag} 
                variants={tile} 
                whileHover={{ y: -6 }}
                style={{ 
                  background: 'var(--card)', 
                  borderRadius: 16, 
                  overflow: 'hidden', 
                  border: '1px solid var(--bd)',
                  cursor: 'pointer'
                }}
              >
                <div className="im" style={{ height: 140, overflow: 'hidden' }}>
                  <img 
                    src={IMAGES[i % IMAGES.length]} 
                    alt={tag} 
                    loading="lazy" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <p style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, margin: 0 }}>
                  {tag}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}