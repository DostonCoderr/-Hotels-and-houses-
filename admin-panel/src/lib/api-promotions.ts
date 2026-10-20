import { api } from '@/lib/api';
import type { Promotion, PaginatedResponse } from '@/types';

// ============================================================
// TYPES
// ============================================================
export interface PromotionFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

// ============================================================
// GET ALL
// ============================================================
export async function fetchPromotions(
  params: PromotionFilters = {}
): Promise<PaginatedResponse<Promotion>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/promotions?${query.toString()}`);
  return data;
}

// ============================================================
// GET BY ID
// ============================================================
export async function fetchPromotionById(id: number): Promise<Promotion> {
  const { data } = await api.get(`/promotions/${id}`);
  return data;
}

// ============================================================
// CREATE
// ============================================================
export async function createPromotion(
  payload: Partial<Promotion>
): Promise<Promotion> {
  const { data } = await api.post('/promotions/admin', payload);
  return data;
}

// ============================================================
// UPDATE
// ============================================================
export async function updatePromotion(
  id: number,
  payload: Partial<Promotion>
): Promise<Promotion> {
  const { data } = await api.put(`/promotions/admin/${id}`, payload);
  return data;
}

// ============================================================
// DELETE
// ============================================================
export async function deletePromotion(id: number): Promise<void> {
  await api.delete(`/promotions/admin/${id}`);
}

// ============================================================
// TOGGLE
// ============================================================
export async function togglePromotion(id: number): Promise<Promotion> {
  const { data } = await api.post(`/promotions/admin/${id}/toggle`);
  return data.promotion || data;
}

// ============================================================
// CONSTANTS
// ============================================================
export const PROMOTION_STATUSES = [
  {
    value: 'active',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    value: 'inactive',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
  {
    value: 'hidden',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
];

export const PROMOTION_STATUS_MAP: Record<string, {
  value: string;
  color: string;
  bg: string;
}> = Object.fromEntries(
  PROMOTION_STATUSES.map((s) => [s.value, s])
);
