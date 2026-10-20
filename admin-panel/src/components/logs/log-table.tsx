'use client';

import { motion } from 'framer-motion';
import { LogIn, LogOut, Plus, Pencil, Trash2, Upload, FileText, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ActivityLog } from '@/types';
import { ACTION_TONE, DEFAULT_TONE, getActionLabels, getEntityLabels } from '@/lib/api-logs';
import { formatDateTime, formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

export const ACTION_ICONS: Record<string, any> = {
  login: LogIn,
  logout: LogOut,
  create: Plus,
  update: Pencil,
  delete: Trash2,
  upload: Upload,
};

interface LogTableProps {
  logs: ActivityLog[];
  onSelect?: (log: ActivityLog) => void;
  onFilterAdmin?: (id: number) => void;
  onFilterEntity?: (entity: string) => void;
  selectedId?: number | null;
  /** Yangi kelgan yozuvlar (jonli rejimda yonib turadi) */
  highlightIds?: Set<number>;
}

export function LogTable({ logs, onSelect, onFilterAdmin, onFilterEntity, selectedId, highlightIds }: LogTableProps) {
  const { t } = useTranslation();
  const ACTION_LABELS = getActionLabels(t);
  const ENTITY_LABELS = getEntityLabels(t);
  const timeLabels = { now: t.timeNow, minutesAgo: t.timeMinutesAgo, hoursAgo: t.timeHoursAgo, daysAgo: t.timeDaysAgo };

  const copy = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Nusxalandi');
    } catch {
      toast.error(t.errorOccurred);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent">
            <TableHead className="pl-5">{t.action}</TableHead>
            <TableHead>{t.admin}</TableHead>
            <TableHead>{t.entity}</TableHead>
            <TableHead>{t.details}</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="pr-5">{t.date}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{t.logsNotFound}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log, index) => {
              const info = ACTION_LABELS[log.action] ?? { label: log.action, color: 'text-muted-foreground' };
              const tone = ACTION_TONE[log.action] ?? DEFAULT_TONE;
              const Icon = ACTION_ICONS[log.action] || FileText;
              const entityLabel = ENTITY_LABELS[log.entity] || log.entity;
              const adminId = log.admin?.id ?? (log as any).adminId;
              const initials = (log.admin?.name || 'A').split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);
              const isNew = highlightIds?.has(log.id);

              return (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.015, 0.3) }}
                  tabIndex={0}
                  onClick={() => onSelect?.(log)}
                  onKeyDown={(e) => e.key === 'Enter' && onSelect?.(log)}
                  className={cn(
                    'group cursor-pointer border-b border-border/30 outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40',
                    selectedId === log.id && 'bg-primary/5',
                    isNew && 'bg-primary/10'
                  )}
                >
                  <TableCell className="pl-5">
                    <span className={cn('inline-flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3 text-xs font-medium', tone.bg, tone.text)}>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/60">
                        <Icon className="h-3 w-3" />
                      </span>
                      {info.label}
                    </span>
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      disabled={!adminId || !onFilterAdmin}
                      onClick={(e) => {
                        e.stopPropagation();
                        adminId && onFilterAdmin?.(adminId);
                      }}
                      title={adminId ? 'Shu admin bo\'yicha filtrlash' : undefined}
                      className="flex items-center gap-2 rounded-lg text-left enabled:hover:opacity-80"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">{log.admin?.name || t.admin}</span>
                        <span className="block truncate text-xs text-muted-foreground">{log.admin?.email || ''}</span>
                      </span>
                    </button>
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilterEntity?.(log.entity);
                      }}
                      className="rounded-md text-sm text-foreground hover:text-primary"
                    >
                      {entityLabel}
                    </button>
                    {log.entityId && <span className="ml-1 font-mono text-xs text-muted-foreground">#{log.entityId}</span>}
                  </TableCell>

                  <TableCell>
                    <p className="line-clamp-1 max-w-[320px] text-sm text-muted-foreground">{log.details || '—'}</p>
                  </TableCell>

                  <TableCell>
                    {log.ip ? (
                      <button type="button" onClick={(e) => copy(e, log.ip!)} title="Nusxalash" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground">
                        {log.ip}
                        <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="pr-5">
                    <span title={formatDateTime(log.createdAt)} className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(log.createdAt, timeLabels)}
                    </span>
                  </TableCell>
                </motion.tr>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}