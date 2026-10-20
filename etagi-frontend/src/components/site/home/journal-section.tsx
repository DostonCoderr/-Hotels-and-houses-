// src/components/site/home/journal-section.tsx
'use client';

import { useTranslation } from '@/lib/i18n';
import type { JournalItem } from '@/lib/api-journal';

export function JournalSection({ items = [] }: { items?: JournalItem[] }) {
  const { t } = useTranslation();

  // ✅ Bo'sh bo'lsa — sektsiyani ko'rsatmaslik (ixtiyoriy)
  if (items.length === 0) return null;

  return (
    <section className="sc">
      <div className="w">
        <div className="hd2">
          <h2>{t('journal_title')}</h2>
          <button className="bo">{t('journal_btn')}</button>
        </div>
        <div className="jr">
          {items.map((item) => (
            <div className="cd" key={item.id}>
              <div className="im"><img src={item.img} alt="" loading="lazy" /></div>
              <div className="cb">
                <h3 style={{ fontSize: 20 }}>{item.title}</h3>
                <p>{item.text}</p>
                <span className="mu" style={{ fontSize: 12.5 }}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}