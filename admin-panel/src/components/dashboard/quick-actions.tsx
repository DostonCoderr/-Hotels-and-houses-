'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Building, Inbox, Gift, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

const TONE = {
  primary: 'bg-primary/10 text-primary',
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-emerald-500/10 text-emerald-500',
  purple: 'bg-purple-500/10 text-purple-500',
};

export function QuickActions({ delay = 0 }: { delay?: number }) {
  const { t } = useTranslation();

  const ACTIONS = [
    { href: '/properties/new', label: t.newProperty, icon: Building2, tone: 'primary' as const },
    { href: '/complexes/new', label: t.newComplex, icon: Building, tone: 'blue' as const },
    { href: '/applications', label: t.applications, icon: Inbox, tone: 'green' as const },
    { href: '/promotions/new', label: t.newPromotion, icon: Gift, tone: 'purple' as const },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="rounded-3xl border-0 bg-card p-3 shadow-sm">
        <h3 className="px-3 pb-2 pt-3 text-base font-semibold text-foreground">{t.quickActions}</h3>
        <ul>
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.href}>
                <Link href={a.href} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted/60">
                  <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', TONE[a.tone])}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">{a.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </motion.div>
  );
}