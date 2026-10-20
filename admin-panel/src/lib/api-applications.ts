import { api } from '@/lib/api';
import type { Application, PaginatedResponse } from '@/types';

// ============================================================
// TYPES
// ============================================================
export type ApplicationStatus = 'new' | 'in_work' | 'done' | 'closed';

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  type?: string;
  source?: string;
  sort?: string;
}

export interface ApplicationStats {
  total: number;
  new: number;
  in_work: number;
  done: number;
  closed: number;
  today: number;
  week: number;
  month: number;
  byType: { type: string; count: number }[];
}

// ============================================================
// GET ALL
// ============================================================
export async function fetchApplications(
  params: ApplicationFilters = {}
): Promise<PaginatedResponse<Application>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.type) query.set('type', params.type);
  if (params.source) query.set('source', params.source);
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/applications?${query.toString()}`);
  return data;
}

// ============================================================
// GET BY ID
// ============================================================
export async function fetchApplicationById(id: number): Promise<Application> {
  const { data } = await api.get(`/applications/${id}`);
  return data;
}

// ============================================================
// STATS
// ============================================================
export async function fetchApplicationStats(): Promise<ApplicationStats> {
  const { data } = await api.get('/applications/stats');
  return data;
}

// ============================================================
// UPDATE STATUS
// ============================================================
export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus
): Promise<Application> {
  const { data } = await api.put(`/applications/${id}/status`, { status });
  return data;
}

// ============================================================
// UPDATE
// ============================================================
export async function updateApplication(
  id: number,
  payload: Partial<Application>
): Promise<Application> {
  const { data } = await api.put(`/applications/${id}`, payload);
  return data;
}

// ============================================================
// DELETE
// ============================================================
export async function deleteApplication(id: number): Promise<void> {
  await api.delete(`/applications/${id}`);
}

// ============================================================
// CONSTANTS
// ============================================================
export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  color: string;
  bg: string;
  icon: string;
}[] = [
  {
    value: 'new',
    label: 'Yangi',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    icon: '🔵',
  },
  {
    value: 'in_work',
    label: 'Ishda',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    icon: '🟡',
  },
  {
    value: 'done',
    label: 'Bajarildi',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    icon: '🟢',
  },
  {
    value: 'closed',
    label: 'Yopilgan',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    icon: '⚫',
  },
];

export const APPLICATION_TYPES: Record<string, string> = {
  consultation: 'Konsultatsiya',
  viewing: 'Ko\'rish',
  purchase: 'Sotib olish',
  callback: 'Qo\'ng\'iroq',
  mortgage: 'Ipoteka',
  other: 'Boshqa',
};



// ============================================================
// EXPORT CSV
// ============================================================
export async function exportApplicationsCSV(
  filters: ApplicationFilters = {}
): Promise<Blob> {
  const query = new URLSearchParams();
  if (filters.search) query.set('search', filters.search);
  if (filters.status) query.set('status', filters.status);
  if (filters.type) query.set('type', filters.type);

  const response = await api.get(
    `/applications/export?${query.toString()}`,
    { responseType: 'blob' }
  );
  return response.data;
}

// ============================================================
// DATE RANGES
// ============================================================
export const DATE_RANGES = [
  { value: 'today', label: 'Bugun' },
  { value: 'week', label: '7 kun' },
  { value: 'month', label: '30 kun' },
  { value: 'all', label: 'Hammasi' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Yangi' },
  { value: 'oldest', label: 'Eski' },
  { value: 'name', label: 'Ism (A-Z)' },
];


export const APPLICATION_SOURCES: Record<string, string> = {
  site: 'Sayt',
  phone: 'Telefon',
  office: 'Ofis',
  telegram: 'Telegram',
  instagram: 'Instagram',
};