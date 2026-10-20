'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Trash2, RefreshCw, SlidersHorizontal, X, ChevronDown, AlertTriangle,
  Download, List, History, BarChart3, Radio, RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LogTable } from '@/components/logs/log-table';
import { LogTimeline } from '@/components/logs/log-timeline';
import { LogDetail } from '@/components/logs/log-detail';
import { LogInsights } from '@/components/logs/log-insights';
import { LogStatsCards } from '@/components/logs/log-stats';
import { useLooseT } from '@/components/dashboard/dashboard-kit';
import {
  fetchLogs, fetchLogStats, clearOldLogs, getActionLabels, getEntityLabels,
  rangeToParams, logsToCsv, downloadText, ACTION_TONE, DEFAULT_TONE,
  type LogStats, type LogRange,
} from '@/lib/api-logs';
import type { ActivityLog } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

const LIVE_INTERVAL = 15_000;
const LIMITS = [25, 50, 100];
const CLEAR_PRESETS = [7, 30, 90, 180];

function pageList(page: number, total: number): (number | '…')[] {
  const set = new Set([1, total, page - 1, page, page + 1]);
  const arr = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  arr.forEach((p, i) => {
    if (i > 0 && p - arr[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export default function LogsPage() {
  const { t } = useTranslation();
  const T = useLooseT();
  const tRef = useRef(t);
  tRef.current = t;
  const searchRef = useRef<HTMLInputElement>(null);

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filtrlar
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState<number | undefined>();
  const [range, setRange] = useState<LogRange>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Ko'rinish
  const [view, setView] = useState<'table' | 'timeline'>('table');
  const [showInsights, setShowInsights] = useState(true);
  const [selected, setSelected] = useState<ActivityLog | null>(null);

  // Sahifalash
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Jonli rejim
  const [live, setLive] = useState(false);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const knownIds = useRef<Set<number>>(new Set());

  // Tozalash modali
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearDays, setClearDays] = useState(30);
  const [clearing, setClearing] = useState(false);

  const ACTION_LABELS = getActionLabels(t);
  const ENTITY_LABELS = getEntityLabels(t);

  // ---------- Filtrlarni o'zgartirish (har doim 1-sahifaga qaytadi) ----------
  const toggleAction = (k: string) => { setActionFilter((c) => (c === k ? '' : k)); setPage(1); };
  const toggleEntity = (k: string) => { setEntityFilter((c) => (c === k ? '' : k)); setPage(1); };
  const toggleAdmin = (id: number) => { setAdminFilter((c) => (c === id ? undefined : id)); setPage(1); };
  const pickRange = (r: LogRange) => { setRange(r); setPage(1); };

  const adminName = useMemo(() => {
    if (!adminFilter) return '';
    return stats?.topAdmins.find((a) => a.admin.id === adminFilter)?.admin.name ?? `Admin #${adminFilter}`;
  }, [adminFilter, stats]);

  const chips = [
    actionFilter && { key: 'a', label: ACTION_LABELS[actionFilter]?.label ?? actionFilter, onRemove: () => toggleAction(actionFilter) },
    entityFilter && { key: 'e', label: ENTITY_LABELS[entityFilter] ?? entityFilter, onRemove: () => toggleEntity(entityFilter) },
    adminFilter && { key: 'u', label: adminName, onRemove: () => toggleAdmin(adminFilter) },
    range !== 'all' && { key: 'r', label: RANGE_LABEL(range, t.today, T), onRemove: () => pickRange('all') },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  const hasFilters = chips.length > 0 || !!search;

  const resetFilters = () => {
    setActionFilter(''); setEntityFilter(''); setAdminFilter(undefined);
    setRange('all'); setSearch(''); setDebouncedSearch(''); setPage(1);
  };

  // ---------- Qidiruv debounce (page ham shu yerda 1 ga tushadi → bitta so'rov) ----------
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  // ---------- Yuklash ----------
  const reqId = useRef(0);

  const load = useCallback(
    async (silent = false) => {
      const id = ++reqId.current;
      try {
        if (!silent) { setLoading(true); setError(false); }
        const res = await fetchLogs({
          page, limit, sort: 'newest',
          search: debouncedSearch || undefined,
          action: actionFilter || undefined,
          entity: entityFilter || undefined,
          adminId: adminFilter,
          ...rangeToParams(range),
        });
        if (id !== reqId.current) return; // eski javob — tashlab yuboramiz

        if (silent && knownIds.current.size > 0) {
          const fresh = res.items.filter((l) => !knownIds.current.has(l.id)).map((l) => l.id);
          if (fresh.length) {
            setNewIds(new Set(fresh));
            setTimeout(() => setNewIds(new Set()), 5000);
          }
        }
        knownIds.current = new Set(res.items.map((l) => l.id));

        setLogs(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        if (id !== reqId.current) return;
        console.error('Xato:', err);
        if (!silent) { setError(true); toast.error(tRef.current.logsLoadFailed); }
      } finally {
        if (id === reqId.current && !silent) setLoading(false);
      }
    },
    [page, limit, debouncedSearch, actionFilter, entityFilter, adminFilter, range]
  );

  const loadStats = useCallback(async () => {
    try { setStats(await fetchLogStats()); } catch { /* statistika majburiy emas */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // ---------- Jonli rejim: faqat 1-sahifada va tab ochiq bo'lsa ----------
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      if (document.hidden || page !== 1) return;
      load(true);
      loadStats();
    }, LIVE_INTERVAL);
    return () => clearInterval(id);
  }, [live, page, load, loadStats]);

  // ---------- Klaviatura: "/" qidiruvga ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === '/' && !/INPUT|TEXTAREA/.test(el.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Modal: Escape
  useEffect(() => {
    if (!showClearModal) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !clearing && setShowClearModal(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showClearModal, clearing]);

  const refresh = () => { load(); loadStats(); };

  const exportCsv = () => {
    if (!logs.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadText(`logs-${stamp}-p${page}.csv`, logsToCsv(logs, { actions: ACTION_LABELS, entities: ENTITY_LABELS }));
    toast.success(`${logs.length} ${T.rowsExported ?? 'ta yozuv yuklandi'}`);
  };

  const handleClearOld = async () => {
    if (!Number.isFinite(clearDays) || clearDays < 1) return;
    try {
      setClearing(true);
      const result = await clearOldLogs(clearDays);
      toast.success(result.message);
      setShowClearModal(false);
      setPage(1);
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    } finally {
      setClearing(false);
    }
  };

  const RANGES: { key: LogRange; label: string }[] = [
    { key: 'all', label: T.rangeAll ?? 'Barcha vaqt' },
    { key: 'today', label: t.today },
    { key: '7d', label: T.range7d ?? '7 kun' },
    { key: '30d', label: T.range30d ?? '30 kun' },
  ];

  const firstLoad = loading && logs.length === 0;

  return (
    <div className="space-y-6">
      {/* ===================== SARLAVHA ===================== */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{t.logsTitle}</h1>
            <Badge variant="outline" className="border-0 bg-primary/10 tabular-nums text-primary">{total.toLocaleString()}</Badge>
            {live && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                LIVE
              </span>
            )}
          </div>
          <p className="mt-1 text-muted-foreground">{t.logsSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={live ? 'default' : 'outline'} onClick={() => setLive((v) => !v)} aria-pressed={live} className="rounded-full">
            <Radio className="mr-2 h-4 w-4" /> {T.live ?? 'Jonli'}
          </Button>
          <Button variant="outline" onClick={exportCsv} disabled={!logs.length} className="rounded-full">
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={refresh} disabled={loading} className="rounded-full">
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} /> {t.refresh}
          </Button>
          <Button variant="outline" onClick={() => setShowClearModal(true)} className="rounded-full text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> {t.clear}
          </Button>
        </div>
      </motion.div>

      {/* ===================== STATISTIKA ===================== */}
      <LogStatsCards stats={stats} />

      {/* ===================== TAHLIL (bosilsa filtr qo'llanadi) ===================== */}
      <div>
        <button
          type="button"
          onClick={() => setShowInsights((v) => !v)}
          aria-expanded={showInsights}
          className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <BarChart3 className="h-4 w-4 text-primary" />
          {T.analysis ?? 'Tahlil'}
          <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', showInsights && 'rotate-180')} />
          <span className="text-xs font-normal text-muted-foreground">{T.clickToFilter ?? 'bosib filtrlang'}</span>
        </button>
        <AnimatePresence initial={false}>
          {showInsights && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <LogInsights
                stats={stats}
                actionLabels={ACTION_LABELS}
                entityLabels={ENTITY_LABELS}
                action={actionFilter}
                entity={entityFilter}
                adminId={adminFilter}
                onAction={toggleAction}
                onEntity={toggleEntity}
                onAdmin={toggleAdmin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================== TOOLBAR ===================== */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-3xl bg-card p-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t.searchLog}  ( / )`}
              className="h-10 rounded-full border-0 bg-muted/50 pl-9 pr-9"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label={T.clear ?? 'Tozalash'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sana oralig'i */}
          <div className="flex items-center rounded-full bg-muted/50 p-1" role="group" aria-label={T.period ?? 'Davr'}>
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                aria-pressed={range === r.key}
                onClick={() => pickRange(r.key)}
                className={cn(
                  'relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  range === r.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {range === r.key && (
                  <motion.span layoutId="range-pill" className="absolute inset-0 rounded-full bg-background shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                )}
                <span className="relative">{r.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant={showFilters ? 'default' : 'outline'} onClick={() => setShowFilters((v) => !v)} className="gap-2 rounded-full">
              <SlidersHorizontal className="h-4 w-4" />
              {t.filters}
              {chips.length > 0 && <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 rounded-full px-1.5 text-xs">{chips.length}</Badge>}
            </Button>

            {/* Ko'rinish */}
            <div className="flex items-center rounded-full bg-muted/50 p-1" role="group" aria-label={T.view ?? "Ko'rinish"}>
              {([['table', List, T.viewTable ?? 'Jadval'], ['timeline', History, T.viewTimeline ?? 'Lenta']] as const).map(([key, Icon, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  aria-label={label}
                  title={label}
                  onClick={() => setView(key)}
                  className={cn('flex h-8 w-8 items-center justify-center rounded-full transition-colors', view === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kengaytirilgan filtrlar */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="space-y-4 rounded-3xl bg-card p-5">
                <FilterRow label={t.action}>
                  <Pill active={actionFilter === ''} onClick={() => { setActionFilter(''); setPage(1); }}>{t.all}</Pill>
                  {Object.entries(ACTION_LABELS).map(([key, info]) => (
                    <Pill key={key} active={actionFilter === key} onClick={() => toggleAction(key)} dot={(ACTION_TONE[key] ?? DEFAULT_TONE).dot}>
                      {info.label}
                    </Pill>
                  ))}
                </FilterRow>
                <FilterRow label={t.entity}>
                  <Pill active={entityFilter === ''} onClick={() => { setEntityFilter(''); setPage(1); }}>{t.all}</Pill>
                  {Object.entries(ENTITY_LABELS).map(([key, label]) => (
                    <Pill key={key} active={entityFilter === key} onClick={() => toggleEntity(key)}>{label}</Pill>
                  ))}
                </FilterRow>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Faol filtr chiplari */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <span key={c.key} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary">
                {c.label}
                <button type="button" onClick={c.onRemove} aria-label={`${c.label} — olib tashlash`} className="rounded-full p-0.5 hover:bg-primary/20">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted py-1 pl-3 pr-1.5 text-xs font-medium text-foreground">
                “{debouncedSearch}”
                <button type="button" onClick={() => setSearch('')} aria-label="Qidiruvni tozalash" className="rounded-full p-0.5 hover:bg-background">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> {T.resetAll ?? 'Hammasini tozalash'}
            </button>
          </div>
        )}
      </div>

      {/* ===================== NATIJA ===================== */}
      {firstLoad ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-14 animate-pulse rounded-2xl bg-card" />)}
        </div>
      ) : error && logs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card py-14 text-center">
          <AlertTriangle className="h-10 w-10 text-rose-500/70" />
          <p className="text-sm text-muted-foreground">{t.logsLoadFailed}</p>
          <Button variant="outline" onClick={refresh} className="rounded-full"><RefreshCw className="mr-2 h-4 w-4" />{T.retry ?? 'Qayta urinish'}</Button>
        </div>
      ) : (
        <div className={cn('transition-opacity', loading && 'opacity-60')}>
          {view === 'table' ? (
            <LogTable logs={logs} onSelect={setSelected} selectedId={selected?.id} highlightIds={newIds} onFilterAdmin={toggleAdmin} onFilterEntity={toggleEntity} />
          ) : (
            <LogTimeline logs={logs} onSelect={setSelected} selectedId={selected?.id} highlightIds={newIds} />
          )}
        </div>
      )}

      {/* ===================== SAHIFALASH ===================== */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {t.page} <span className="font-medium text-foreground">{page}</span> / {Math.max(totalPages, 1)} · {t.total} {total.toLocaleString()}
            </span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              aria-label={T.perPage ?? 'Sahifada'}
              className="h-8 rounded-full border-0 bg-card px-3 text-xs text-foreground"
            >
              {LIMITS.map((n) => <option key={n} value={n}>{n} / {T.pageShort ?? 'sah.'}</option>)}
            </select>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-full">{t.previous}</Button>
              {pageList(page, totalPages).map((p, i) =>
                p === '…' ? (
                  <span key={`d${i}`} className="px-1 text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={p === page ? 'page' : undefined}
                    className={cn('h-8 min-w-8 rounded-full px-2 text-xs font-medium tabular-nums transition-colors', p === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
                  >
                    {p}
                  </button>
                )
              )}
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-full">{t.next}</Button>
            </div>
          )}
        </div>
      )}

      {/* ===================== BATAFSIL PANEL ===================== */}
      <LogDetail log={selected} onClose={() => setSelected(null)} onFilterAdmin={toggleAdmin} onFilterEntity={toggleEntity} />

      {/* ===================== TOZALASH MODALI ===================== */}
      <AnimatePresence>
        {showClearModal && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !clearing && setShowClearModal(false)} className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" />
            <motion.div
              key="md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl"
            >
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
                  <AlertTriangle className="h-8 w-8 text-rose-500" />
                </div>
                <h2 id="clear-title" className="mb-2 text-xl font-bold text-foreground">{t.clearLogsTitle}</h2>
                <p className="mb-5 text-sm text-muted-foreground">{t.clearLogsDesc}</p>

                <div className="mb-4 flex flex-wrap justify-center gap-2">
                  {CLEAR_PRESETS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setClearDays(d)}
                      className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-colors', clearDays === d ? 'bg-foreground text-background' : 'bg-muted/60 text-muted-foreground hover:text-foreground')}
                    >
                      {d} {t.days}
                    </button>
                  ))}
                </div>

                <div className="mx-auto mb-3 flex max-w-[200px] items-center gap-2">
                  <Input type="number" value={clearDays} onChange={(e) => setClearDays(Number(e.target.value))} min={1} className="h-11 border-0 bg-muted/30 text-center" />
                  <span className="text-sm text-muted-foreground">{t.days}</span>
                </div>
                <p className="mb-6 text-xs text-rose-500">
                  {clearDays} {t.days} {T.olderWillBeDeleted ?? "dan eski yozuvlar o'chiriladi. Bu amalni qaytarib bo'lmaydi."}
                </p>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowClearModal(false)} disabled={clearing} className="flex-1 rounded-full">{t.cancel}</Button>
                  <Button variant="destructive" onClick={handleClearOld} disabled={clearing || !(clearDays >= 1)} className="flex-1 rounded-full">
                    {clearing ? t.clearing : t.clear}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- kichik yordamchi komponentlar ---------- */

function RANGE_LABEL(r: LogRange, today: string, T: Record<string, string | undefined>) {
  return r === 'today' ? today : r === '7d' ? (T.range7d ?? '7 kun') : (T.range30d ?? '30 kun');
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, dot, children }: { active: boolean; onClick: () => void; dot?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'bg-foreground text-background' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />}
      {children}
    </button>
  );
}