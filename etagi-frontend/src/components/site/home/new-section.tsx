'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n'; // ✅ Import

export function NewSection() {
  const { t } = useTranslation(); // ✅ Hook

  return (
    <section className="sc" style={{ background: 'var(--bg2)', padding: '60px 0', marginTop: 40 }}>
      <div className="w" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 36, marginBottom: 20 }}>{t('new_title')}</h2>
          <p className="mu" style={{ maxWidth: 600, margin: '0 auto 30px' }}>
            {t('new_sub')}
          </p>
          <Link href="/consult" className="bt" style={{ display: 'inline-block', padding: '16px 40px', fontSize: 18 }}>
            {t('new_btn')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}