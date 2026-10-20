'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Search } from 'lucide-react';

import { SeoForm } from '@/components/seo/seo-form';
import { useTranslation } from '@/lib/translations';
import { SITE_URL, siteHost } from '@/lib/seo-utils';

export default function SeoPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.seoTitle}</h1>
            <p className="mt-1 text-muted-foreground">{t.seoSubtitle}</p>
          </div>
        </div>

        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {siteHost()}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </motion.div>

      <SeoForm />
    </div>
  );
}