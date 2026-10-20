'use client';

import { motion } from 'framer-motion';
import { Eye, MousePointerClick, MessageSquare, Calendar, Clock, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface ConversionFunnelProps {
  data?: { views: number; clicks: number; inquiries: number; scheduled: number };
}

// Demo — backend /leads endpointi tayyor bo'lganda almashtiring
const RECENT_LEADS = [
  { name: 'Ali Valiyev', phone: '+998 90 123 45 67', status: 'new' },
  { name: 'Zulfiya Karimova', phone: '+998 91 234 56 78', status: 'in_work' },
  { name: 'Bobur Aliyev', phone: '+998 93 345 67 89', status: 'done' },
];

const LEAD_STYLE: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-500',
  in_work: 'bg-amber-500/10 text-amber-500',
  done: 'bg-emerald-500/10 text-emerald-500',
};

function Section({ title, aside, children, delay = 0 }: { title: React.ReactNode; aside?: React.ReactNode; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-border/40 pt-5 first:border-t-0 first:pt-0"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">{title}</h3>
        {aside}
      </div>
      {children}
    </motion.section>
  );
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const { t } = useTranslation();

  const d = data ?? { views: 0, clicks: 0, inquiries: 0, scheduled: 0 };
  const stages = [
    { icon: Eye, label: t.views, value: d.views, note: null as string | null },
    { icon: MousePointerClick, label: t.clicks, value: d.clicks, note: t.funnelNoteClicks },
    { icon: MessageSquare, label: t.inquiries, value: d.inquiries, note: t.funnelNoteInquiries },
    { icon: Calendar, label: t.scheduledViewings, value: d.scheduled, note: t.funnelNoteScheduled },
  ];

  // Logarifmik shkala: kichik bosqichlar ham ko'rinib tursin
  const base = Math.log10(Math.max(d.views, 2) + 1);
  const width = (v: number) => Math.max(8, (Math.log10(v + 1) / base) * 100);
  const overall = d.views > 0 ? (d.scheduled / d.views) * 100 : 0;
  const inquiryRate = d.views > 0 ? (d.inquiries / d.views) * 100 : 0;

  const ACTIVITIES = [
    { text: t.activityViewed, time: t.timeMinutesAgo.replace('{n}', '2'), color: 'bg-blue-500' },
    { text: t.activityFavorited, time: t.timeMinutesAgo.replace('{n}', '15'), color: 'bg-rose-500' },
    { text: t.activityInquiry, time: t.timeHoursAgo.replace('{n}', '1'), color: 'bg-emerald-500' },
    { text: t.activityViewed, time: t.timeHoursAgo.replace('{n}', '3'), color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Voronka */}
      <Section
        title={t.conversionFunnel}
        aside={<span className="text-xs text-muted-foreground">{t.thisMonth}</span>}
      >
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums text-foreground">{overall.toFixed(overall < 1 ? 2 : 1)}%</span>
          <span className="text-xs text-muted-foreground">{t.conversionFunnelSubtitle}</span>
        </div>

        <div className="space-y-3.5">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const prev = i > 0 ? stages[i - 1].value : 0;
            const step = i > 0 && prev > 0 ? (s.value / prev) * 100 : null;
            return (
              <div key={s.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {s.label}
                  </span>
                  <span className="flex items-baseline gap-2">
                    {step !== null && <span className="text-muted-foreground">{step.toFixed(1)}%</span>}
                    <span className="font-semibold tabular-nums text-foreground">{formatNumber(s.value)}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    style={{ opacity: 1 - i * 0.18 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${width(s.value)}%` }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                {s.note && <p className="mt-1 text-[11px] text-muted-foreground">{s.note}</p>}
              </div>
            );
          })}
        </div>
      </Section>

      {/* 2. Samaradorlik */}
      <Section title={t.performance} delay={0.1}>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border/40">
          <div className="bg-card p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="h-3.5 w-3.5 text-amber-500" />{t.responseTime}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">2.4 <span className="text-xs font-normal text-muted-foreground">{t.minutes}</span></p>
          </div>
          <div className="bg-card p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageSquare className="h-3.5 w-3.5 text-emerald-500" />{t.conversion}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{inquiryRate.toFixed(1)}%</p>
          </div>
        </div>
      </Section>

      {/* 3. So'nggi mijozlar */}
      <Section
        title={t.recentLeads}
        delay={0.15}
        aside={<a href="/applications" className="text-xs text-primary hover:underline">{t.viewAll}</a>}
      >
        <div className="-mx-2 space-y-0.5">
          {RECENT_LEADS.map((lead) => (
            <div key={lead.name} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/50">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{lead.name}</p>
                <p className="truncate text-xs text-muted-foreground">{lead.phone}</p>
              </div>
              <Badge variant="outline" className={cn('border-0 text-[11px]', LEAD_STYLE[lead.status])}>
                {lead.status === 'new' && t.statusNew}
                {lead.status === 'in_work' && t.statusInWork}
                {lead.status === 'done' && t.statusDone}
              </Badge>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Faollik */}
      <Section title={<><Clock className="h-4 w-4" />{t.recentActivity}</>} delay={0.2}>
        <ol className="relative space-y-3">
          <span className="absolute bottom-2 left-[5px] top-2 w-px bg-border" aria-hidden />
          {ACTIVITIES.map((a, i) => (
            <li key={i} className="relative flex items-start gap-3">
              <span className={cn('z-10 mt-1 h-[11px] w-[11px] flex-shrink-0 rounded-full ring-4 ring-card', a.color)} />
              <div className="min-w-0">
                <p className="text-xs text-foreground">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}