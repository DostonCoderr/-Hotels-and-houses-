import { api } from '@/lib/api';
import type { ActivityLog, PaginatedResponse } from '@/types';
import type { Translations } from '@/lib/translations';

// ============================================================
// TIPLAR
// ============================================================
export type LogRange = 'all' | 'today' | '7d' | '30d';

export interface LogFilters {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity?: string;
  adminId?: number;
  sort?: string;
  /** ISO sana. ⚠️ Backend `from`/`to` query parametrlarini qo'llab-quvvatlashi kerak */
  from?: string;
  to?: string;
}

export interface LogStats {
  total: number;
  today: number;
  week: number;
  month: number;
  byAction: { action: string; count: number }[];
  byEntity: { entity: string; count: number }[];
  topAdmins: {
    admin: { id: number; name: string; email: string };
    count: number;
  }[];
}

// ============================================================
// SO'ROVLAR
// ============================================================
export async function fetchLogs(params: LogFilters = {}): Promise<PaginatedResponse<ActivityLog>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.action) query.set('action', params.action);
  if (params.entity) query.set('entity', params.entity);
  if (params.adminId) query.set('adminId', String(params.adminId));
  if (params.sort) query.set('sort', params.sort);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);

  const { data } = await api.get(`/logs?${query.toString()}`);
  return data;
}

export async function fetchLogStats(): Promise<LogStats> {
  const { data } = await api.get('/logs/stats');
  return data;
}

export async function clearOldLogs(days: number = 30): Promise<{ message: string; deleted: number }> {
  const { data } = await api.delete(`/logs/clear?days=${days}`);
  return data;
}

// ============================================================
// YORLIQLAR (tarjima orqali)
// ============================================================
export function getActionLabels(t: Translations): Record<string, { label: string; color: string }> {
  return {
    login: { label: t.logActionLogin, color: 'text-blue-500' },
    logout: { label: t.logActionLogout, color: 'text-muted-foreground' },
    create: { label: t.logActionCreate, color: 'text-emerald-500' },
    update: { label: t.logActionUpdate, color: 'text-amber-500' },
    delete: { label: t.logActionDelete, color: 'text-rose-500' },
    upload: { label: t.logActionUpload, color: 'text-purple-500' },
  };
}

export function getEntityLabels(t: Translations): Record<string, string> {
  return {
    admin: t.logEntityAdmin,
    property: t.logEntityProperty ?? t.property,
    complex: t.logEntityComplex ?? t.complex,
    user: t.logEntityUser ?? t.user,
    application: t.logEntityApplication ?? t.application,
    promotion: t.logEntityPromotion ?? t.promotion,
    review: t.logEntityReview ?? t.review,
    employee: t.logEntityEmployee ?? t.employee,
    setting: t.logEntitySetting ?? t.setting,
    seo: t.logEntitySeo ?? t.seo,
  };
}

// ============================================================
// RANGLAR (nuqta, fon, matn)
// ============================================================
export const ACTION_TONE: Record<string, { text: string; bg: string; dot: string }> = {
  login: { text: 'text-blue-500', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
  logout: { text: 'text-muted-foreground', bg: 'bg-muted/60', dot: 'bg-muted-foreground' },
  create: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  update: { text: 'text-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  delete: { text: 'text-rose-500', bg: 'bg-rose-500/10', dot: 'bg-rose-500' },
  upload: { text: 'text-purple-500', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
};
export const DEFAULT_TONE = { text: 'text-muted-foreground', bg: 'bg-muted/60', dot: 'bg-muted-foreground' };

// ============================================================
// YORDAMCHILAR
// ============================================================
export function rangeToParams(range: LogRange): { from?: string; to?: string } {
  if (range === 'all') return {};
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  if (range === '7d') from.setDate(from.getDate() - 6);
  if (range === '30d') from.setDate(from.getDate() - 29);
  return { from: from.toISOString(), to: new Date().toISOString() };
}

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Jurnallarni kunlar bo'yicha guruhlaydi (Bugun / Kecha / sana) */
export function groupLogsByDay(
  logs: ActivityLog[],
  labels: { today: string; yesterday: string }
): { key: string; label: string; items: ActivityLog[] }[] {
  const now = new Date();
  const yest = new Date();
  yest.setDate(now.getDate() - 1);
  const todayKey = dayKey(now);
  const yestKey = dayKey(yest);

  const map = new Map<string, { key: string; label: string; items: ActivityLog[] }>();
  logs.forEach((log) => {
    const d = new Date(log.createdAt);
    const key = dayKey(d);
    if (!map.has(key)) {
      const label =
        key === todayKey
          ? labels.today
          : key === yestKey
            ? labels.yesterday
            : d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
      map.set(key, { key, label, items: [] });
    }
    map.get(key)!.items.push(log);
  });
  return Array.from(map.values());
}

/** details JSON bo'lsa chiroyli ko'rinishga keltiradi */
export function prettyDetails(details?: string | null): { text: string; isJson: boolean } {
  if (!details) return { text: '', isJson: false };
  const s = details.trim();
  if (s.startsWith('{') || s.startsWith('[')) {
    try {
      return { text: JSON.stringify(JSON.parse(s), null, 2), isJson: true };
    } catch {
      /* oddiy matn */
    }
  }
  return { text: details, isJson: false };
}

/** CSV (Excel uchun BOM bilan) */
export function logsToCsv(
  logs: ActivityLog[],
  labels: { actions: Record<string, { label: string }>; entities: Record<string, string> }
): string {
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
  const head = ['ID', 'Sana', 'Admin', 'Email', 'Amal', 'Obyekt', 'Obyekt ID', 'Tafsilot', 'IP'];
  const rows = logs.map((l) =>
    [
      l.id,
      new Date(l.createdAt).toISOString(),
      l.admin?.name,
      l.admin?.email,
      labels.actions[l.action]?.label ?? l.action,
      labels.entities[l.entity] ?? l.entity,
      l.entityId,
      l.details,
      l.ip,
    ]
      .map(esc)
      .join(',')
  );
  return '\uFEFF' + [head.map(esc).join(','), ...rows].join('\n');
}

export function downloadText(filename: string, text: string, mime = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}