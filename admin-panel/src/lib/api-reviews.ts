import { api } from '@/lib/api';
import type { Review, PaginatedResponse } from '@/types';
import type { Translations } from '@/lib/translations';

// ============================================================
// TIPLAR
// ============================================================
export interface ReviewFilters {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  rating?: number;
  sort?: string;
}

export interface ReviewStats {
  total: number;
  published: number;
  pending: number;
  avgRating: number;
  byRating: { rating: number; count: number }[];
}

// ============================================================
// HAMMASI (public)
// ============================================================
export async function fetchReviews(
  params: ReviewFilters = {}
): Promise<PaginatedResponse<Review>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.published !== undefined)
    query.set('published', String(params.published));
  if (params.rating) query.set('rating', String(params.rating));
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/reviews?${query.toString()}`);
  return data;
}

// ============================================================
// HAMMASI (admin) — barcha, published yoki yo'q
// ============================================================
export async function fetchAdminReviews(
  params: ReviewFilters = {}
): Promise<PaginatedResponse<Review>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.published !== undefined)
    query.set('published', String(params.published));
  if (params.rating) query.set('rating', String(params.rating));
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/reviews/admin?${query.toString()}`);
  return data;
}

// ============================================================
// STATISTIKA
// ============================================================
export async function fetchReviewStats(): Promise<ReviewStats> {
  try {
    const { data } = await api.get('/reviews/stats');
    return data;
  } catch {
    return {
      total: 0,
      published: 0,
      pending: 0,
      avgRating: 0,
      byRating: [],
    };
  }
}

// ============================================================
// E'LON QILISH
// ============================================================
export async function publishReview(id: number): Promise<Review> {
  const { data } = await api.put(`/reviews/admin/${id}/publish`);
  return data.review || data;
}

// ============================================================
// YASHIRISH
// ============================================================
export async function unpublishReview(id: number): Promise<Review> {
  const { data } = await api.put(`/reviews/admin/${id}/unpublish`);
  return data.review || data;
}

// ============================================================
// O'CHIRISH
// ============================================================
export async function deleteReview(id: number): Promise<void> {
  await api.delete(`/reviews/admin/${id}`);
}

// ============================================================
// KONSTANTLAR — REYTING YORLIQLARI (tarjima qilinadigan)
// ============================================================
// ⚠️ MUHIM: Bu yorliqlar endi tarjima orqali ishlaydi.
// `getRatingLabels(t)` funksiyasi orqali ishlatiladi.

export function getRatingLabels(
  t: Translations
): Record<number, string> {
  return {
    5: t.ratingExcellent,
    4: t.ratingGood,
    3: t.ratingAverage,
    2: t.ratingBad,
    1: t.ratingVeryBad,
  };
}

// ⚠️ RATING_COLORS — tarjima kerak emas (bu ranglar)
export const RATING_COLORS: Record<number, string> = {
  5: 'text-emerald-500',
  4: 'text-blue-500',
  3: 'text-amber-500',
  2: 'text-orange-500',
  1: 'text-rose-500',
};