import { api } from '@/lib/api';
import type { Property, PaginatedResponse } from '@/types';

// ============================================================
// TYPES
// ============================================================
export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  complexId?: number;
  sort?: string;
}

// ⚠️ YANGI: Statistika uchun tiplar
export interface PropertyStatsTotals {
  views: number;
  favorites: number;
  inquiries: number;
  scheduled: number;
}

export interface PropertyStatsDaily {
  label: string;
  views: number;
  favorites: number;
  inquiries: number;
  scheduled: number;
}

export interface PropertyStatsResponse extends PropertyStatsTotals {
  daily: PropertyStatsDaily[];
}

// ============================================================
// GET ALL
// ============================================================
export async function fetchProperties(
  params: PropertyFilters = {}
): Promise<PaginatedResponse<Property>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.type) query.set('type', params.type);
  if (params.status) query.set('status', params.status);
  if (params.complexId) query.set('complexId', String(params.complexId));
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/properties?${query.toString()}`);
  return data;
}

// ============================================================
// GET BY ID
// ============================================================
export async function fetchPropertyById(id: number): Promise<Property> {
  const { data } = await api.get(`/properties/${id}`);
  return data;
}

// ============================================================
// GET STATS (Chart va Kartochkalar uchun)
// ============================================================
export async function fetchPropertyStats(
  id: number
): Promise<PropertyStatsResponse> {
  const { data } = await api.get(`/properties/${id}/stats`);
  return data;
}

// ============================================================
// CREATE
// ============================================================
export async function createProperty(
  payload: Partial<Property>
): Promise<Property> {
  const { data } = await api.post('/properties/admin', payload);
  return data;
}

// ============================================================
// UPDATE
// ============================================================
export async function updateProperty(
  id: number,
  payload: Partial<Property>
): Promise<Property> {
  const { data } = await api.put(`/properties/admin/${id}`, payload);
  return data;
}

// ============================================================
// DELETE
// ============================================================
export async function deleteProperty(id: number): Promise<void> {
  await api.delete(`/properties/admin/${id}`);
}

// ============================================================
// DUPLICATE
// ============================================================
export async function duplicateProperty(id: number): Promise<Property> {
  const { data } = await api.post(`/properties/admin/${id}/duplicate`);
  return data;
}

// ============================================================
// PROPERTY TYPES (slug — translation key)
// ============================================================
export const PROPERTY_TYPES = [
  { id: 1, slug: 'apartment' },
  { id: 2, slug: 'studio' },
  { id: 3, slug: 'house' },
  { id: 4, slug: 'office' },
  { id: 5, slug: 'shop' },
  { id: 6, slug: 'parking' },
  { id: 7, slug: 'garage' },
  { id: 8, slug: 'storage' },
];

// ============================================================
// PROPERTY STATUSES (value — translation key)
// ============================================================
export const PROPERTY_STATUSES = [
  { value: 'available' },
  { value: 'booked' },
  { value: 'sold' },
];

// ============================================================
// COMPLEXES (dropdown uchun)
// ============================================================
export async function fetchComplexesForSelect(): Promise<
  { id: number; name: string; slug: string }[]
> {
  try {
    const { data } = await api.get('/complexes?limit=100');
    const items = data.items || data;
    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
    }));
  } catch {
    return [];
  }
}