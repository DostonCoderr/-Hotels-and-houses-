'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Copy, FileText, Globe, Clock, Hash, UserRound, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ActivityLog } from '@/types';
import { ACTION_TONE, DEFAULT_TONE, getActionLabels, getEntityLabels, prettyDetails } from '@/lib/api-logs';
import { formatDateTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';
import { useLooseT } from '@/components/dashboard/dashboard-kit';
import { ACTION_ICONS } from './log-table';

interface Props {
  log: ActivityLog | null;
  onClose: () => void;
  onFilterAdmin?: (id: number) => void;
  onFilterEntity?: (entity: string) => void;
}

export function LogDetail({ log, onClose, onFilterAdmin, onFilterEntity }: Props) {
  const { t } = useTranslation();
  const T = useLooseT();

  useEffect(() => {
    if (!log) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [log, onClose]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(T.copied ?? 'Nusxalandi');
    } catch {
      toast.error(t.errorOccurred);
    }
  };

  return (
    <AnimatePresence>
      {log && (() => {
        const info = getActionLabels(t)[log.action] ?? { label: log.action };
        const entity = getEntityLabels(t)[log.entity] || log.entity;
        const tone = ACTION_TONE[log.action] ?? DEFAULT_TONE;
        const Icon = ACTION_ICONS[log.action] || FileText;
        const adminId = log.admin?.id ?? (log as any).adminId;
        const det = prettyDetails(log.details);
        const initials = (log.admin?.name || 'A').split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);

        const rows = [
          { icon: Clock, label: t.date, value: formatDateTime(log.createdAt) },
          { icon: Globe, label: 'IP', value: log.ip || '—', mono: true, copy: log.ip },
          { icon: Hash, label: `${entity} ID`, value: log.entityId ? `#${log.entityId}` : '—', mono: true, copy: log.entityId ? String(log.entityId) : undefined },
        ];

        return (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-x-0 bottom-0 top-10 z-[200] bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label={info.label}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed right-0 top-10 z-[201] flex h-full w-full max-w-md flex-col bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/40 p-5">
                <div className="flex items-center gap-3">
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', tone.bg, tone.text)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={cn('text-sm font-semibold', tone.text)}>{info.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {entity} {log.entityId && <span className="font-mono">#{log.entityId}</span>}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={onClose} aria-label={T.close ?? 'Yopish'} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {/* Admin */}
                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{log.admin?.name || t.admin}</p>
                    <p className="truncate text-xs text-muted-foreground">{log.admin?.email}</p>
                  </div>
                </div>

                {/* Meta */}
                <dl className="divide-y divide-border/40 rounded-2xl border border-border/40">
                  {rows.map((r) => {
                    const RIcon = r.icon;
                    return (
                      <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-3">
                        <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                          <RIcon className="h-3.5 w-3.5" />
                          {r.label}
                        </dt>
                        <dd className="flex items-center gap-2 text-sm text-foreground">
                          <span className={cn(r.mono && 'font-mono text-xs')}>{r.value}</span>
                          {r.copy && (
                            <button type="button" onClick={() => copy(r.copy!)} aria-label="Nusxalash" className="text-muted-foreground hover:text-foreground">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                {/* Tafsilot */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.details}</h4>
                    {det.text && (
                      <button type="button" onClick={() => copy(det.text)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <Copy className="h-3 w-3" /> {T.copy ?? 'Nusxa'}
                      </button>
                    )}
                  </div>
                  {det.text ? (
                    <pre className={cn('max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-muted/40 p-4 text-xs leading-relaxed text-foreground', det.isJson && 'font-mono')}>
                      {det.text}
                    </pre>
                  ) : (
                    <p className="rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">—</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border/40 p-4">
                {adminId && onFilterAdmin && (
                  <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => { onFilterAdmin(adminId); onClose(); }}>
                    <UserRound className="mr-2 h-3.5 w-3.5" /> {T.thisAdmin ?? 'Shu admin'}
                  </Button>
                )}
                {onFilterEntity && (
                  <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => { onFilterEntity(log.entity); onClose(); }}>
                    <Filter className="mr-2 h-3.5 w-3.5" /> {entity}
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => copy(JSON.stringify(log, null, 2))}>
                  <Copy className="mr-2 h-3.5 w-3.5" /> JSON
                </Button>
              </div>
            </motion.aside>
          </>
        );
      })()}
    </AnimatePresence>
  );
}