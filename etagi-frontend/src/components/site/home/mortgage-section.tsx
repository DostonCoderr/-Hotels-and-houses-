'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

export function MortgageSection() {
  const { t } = useTranslation();

  return (
    <section className="sc">
      <div className="w">
        <div className="hd2">
          <h2>{t('mort_title')}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            { title: 'Семейная ипотека', rate: '6%', desc: 'Для семей с детьми' },
            { title: 'Льготная ипотека', rate: '8%', desc: 'Для всех граждан РФ' },
            { title: 'Рыночная ипотека', rate: '15%', desc: 'Стандартные условия' }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="cd"
              style={{ padding: 30, textAlign: 'center' }}
            >
              <h3 style={{ fontSize: 20, marginBottom: 10 }}>{item.title}</h3>
              <div style={{ fontSize: 48, color: 'var(--g2)', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{item.rate}</div>
              <p className="mu" style={{ marginTop: 10, marginBottom: 20 }}>{item.desc}</p>
              <button className="bt" style={{ width: '100%' }}>{t('mort_btn')}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}