'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ACTION_TONE, DEFAULT_TONE, type LogStats } from '@/lib/api-logs';
import { useLooseT } from '@/components/dashboard/dashboard-kit';

interface Props {
  stats: LogStats | null;
  actionLabels: Record<string, { label: string; color: string }>;
  entityLabels: Record<string, string>;
  action: string;
  entity: string;
  adminId?: number;
  onAction: (key: string) => void;
  onEntity: (key: string) => void;
  onAdmin: (id: number) => void;
}

interface Row {
  key: string;
  label: string;
  count: number;
  active: boolean;
  dot?: string;
  lead?: React.ReactNode;
  onClick: () => void;
}

function BarList({ title, rows, empty }: { title: string; rows: Row[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  const sum = rows.reduce((a, r) => a + r.count, 0) || 1;

  return (
    <div className="p-5">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-1">
          {rows.map((r, i) => (
            <li key={r.key}>
              <button
                type="button"
                onClick={r.onClick}
                aria-pressed={r.active}
                className={cn(
                  'group w-full rounded-xl px-2 py-1.5 text-left transition-colors',
                  r.active ? 'bg-primary/10' : 'hover:bg-muted/50'
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2">
                    {r.lead}
                    <span className={cn('truncate font-medium', r.active ? 'text-primary' : 'text-foreground')}>{r.label}</span>
                  </span>
                  <span className="flex flex-shrink-0 items-baseline gap-1.5 tabular-nums">
                    <span className="text-muted-foreground">{Math.round((r.count / sum) * 100)}%</span>
                    <span className="font-semibold text-foreground">{r.count.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn('h-full rounded-full', r.dot ?? 'bg-primary')}
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.count / max) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LogInsights({ stats, actionLabels, entityLabels, action, entity, adminId, onAction, onEntity, onAdmin }: Props) {
  const T = useLooseT();

  const initials = (name: string) =>
    (name || 'A').split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const actionRows: Row[] = (stats?.byAction ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((x) => ({
      key: x.action,
      label: actionLabels[x.action]?.label ?? x.action,
      count: x.count,
      active: action === x.action,
      dot: (ACTION_TONE[x.action] ?? DEFAULT_TONE).dot,
      onClick: () => onAction(x.action),
    }));

  const entityRows: Row[] = (stats?.byEntity ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((x) => ({
      key: x.entity,
      label: entityLabels[x.entity] ?? x.entity,
      count: x.count,
      active: entity === x.entity,
      onClick: () => onEntity(x.entity),
    }));

  const adminRows: Row[] = (stats?.topAdmins ?? []).slice(0, 5).map((x) => ({
    key: String(x.admin.id),
    label: x.admin.name,
    count: x.count,
    active: adminId === x.admin.id,
    lead: (
      <Avatar className="h-5 w-5">
        <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">{initials(x.admin.name)}</AvatarFallback>
      </Avatar>
    ),
    onClick: () => onAdmin(x.admin.id),
  }));

  const empty = T.noData ?? "Ma'lumot yo'q";

  return (
    <div className="grid grid-cols-1 divide-y divide-border/40 overflow-hidden rounded-3xl bg-card md:grid-cols-3 md:divide-x md:divide-y-0">
      <BarList title={T.byAction ?? "Amallar bo'yicha"} rows={actionRows} empty={empty} />
      <BarList title={T.byEntity ?? "Obyektlar bo'yicha"} rows={entityRows} empty={empty} />
      <BarList title={T.topAdmins ?? 'Eng faol adminlar'} rows={adminRows} empty={empty} />
    </div>
  );
}