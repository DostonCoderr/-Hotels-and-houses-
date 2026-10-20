'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityLog } from '@/types';
import { ACTION_TONE, DEFAULT_TONE, getActionLabels, getEntityLabels, groupLogsByDay } from '@/lib/api-logs';
import { useTranslation } from '@/lib/translations';
import { useLooseT } from '@/components/dashboard/dashboard-kit';
import { ACTION_ICONS } from './log-table';

interface Props {
  logs: ActivityLog[];
  onSelect?: (log: ActivityLog) => void;
  selectedId?: number | null;
  highlightIds?: Set<number>;
}

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

export function LogTimeline({ logs, onSelect, selectedId, highlightIds }: Props) {
  const { t } = useTranslation();
  const T = useLooseT();
  const ACTION_LABELS = getActionLabels(t);
  const ENTITY_LABELS = getEntityLabels(t);

  const groups = useMemo(
    () => groupLogsByDay(logs, { today: t.today, yesterday: T.yesterday ?? 'Kecha' }),
    [logs, t.today, T.yesterday]
  );

  if (logs.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-3xl bg-card">
        <FileText className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{t.logsNotFound}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g.key}>
          <h3 className="sticky top-0 z-10 -mx-1 mb-3 bg-background/90 px-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
            {g.label} <span className="ml-1 font-normal tabular-nums opacity-70">· {g.items.length}</span>
          </h3>

          <ol className="relative space-y-2 pl-8">
            <span className="absolute bottom-3 left-[15px] top-3 w-px bg-border" aria-hidden />
            {g.items.map((log, i) => {
              const tone = ACTION_TONE[log.action] ?? DEFAULT_TONE;
              const Icon = ACTION_ICONS[log.action] || FileText;
              const info = ACTION_LABELS[log.action] ?? { label: log.action };
              const entity = ENTITY_LABELS[log.entity] || log.entity;

              return (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.25) }}
                  className="relative"
                >
                  <span className={cn('absolute -left-8 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full ring-4 ring-background', tone.bg, tone.text)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelect?.(log)}
                    className={cn(
                      'w-full rounded-2xl bg-card p-3.5 text-left transition-colors hover:bg-muted/50',
                      selectedId === log.id && 'ring-1 ring-primary/40',
                      highlightIds?.has(log.id) && 'bg-primary/10'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{log.admin?.name || t.admin}</span>{' '}
                        <span className={cn('font-medium', tone.text)}>{info.label.toLowerCase()}</span>{' '}
                        <span className="text-muted-foreground">
                          {entity}
                          {log.entityId && <span className="ml-1 font-mono text-xs">#{log.entityId}</span>}
                        </span>
                      </p>
                      <span className="flex-shrink-0 text-xs tabular-nums text-muted-foreground">{timeOf(log.createdAt)}</span>
                    </div>
                    {log.details && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{log.details}</p>}
                    {log.ip && <p className="mt-1.5 font-mono text-[11px] text-muted-foreground/70">{log.ip}</p>}
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}