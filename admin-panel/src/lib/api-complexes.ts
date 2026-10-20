import { api } from '@/lib/api';
import type { ResidentialComplex, PaginatedResponse } from '@/types';

// ============================================================
// TYPES
// ============================================================
export interface ComplexFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  district?: string;
  sort?: string;
}

// ============================================================
// GET ALL
// ============================================================
export async function fetchComplexes(
  params: ComplexFilters = {}
): Promise<PaginatedResponse<ResidentialComplex>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.district) query.set('district', params.district);
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/complexes?${query.toString()}`);
  return data;
}

// ============================================================
// GET BY ID
// ============================================================
export async function fetchComplexById(
  id: number
): Promise<ResidentialComplex> {
  const { data } = await api.get(`/complexes/${id}`);
  return data;
}

// ============================================================
// GET BY SLUG
// ============================================================
export async function fetchComplexBySlug(
  slug: string
): Promise<ResidentialComplex> {
  const { data } = await api.get(`/complexes/slug/${slug}`);
  return data;
}

// ============================================================
// CREATE
// ============================================================
export async function createComplex(
  payload: Partial<ResidentialComplex>
): Promise<ResidentialComplex> {
  const { data } = await api.post('/complexes/admin', payload);
  return data;
}

// ============================================================
// UPDATE
// ============================================================
export async function updateComplex(
  id: number,
  payload: Partial<ResidentialComplex>
): Promise<ResidentialComplex> {
  const { data } = await api.put(`/complexes/admin/${id}`, payload);
  return data;
}

// ============================================================
// DELETE
// ============================================================
export async function deleteComplex(id: number): Promise<void> {
  await api.delete(`/complexes/admin/${id}`);
}

// ============================================================
// TOGGLE
// ============================================================
export async function toggleComplex(id: number): Promise<ResidentialComplex> {
  const { data } = await api.post(`/complexes/admin/${id}/toggle`);
  return data;
}

// ============================================================
// STATS
// ============================================================
export async function fetchComplexStats(id: number): Promise<{
  properties: number;
  totalValue: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}> {
  const { data } = await api.get(`/complexes/${id}/stats`);
  return data;
}

// ============================================================
// CONSTANTS — label OLIB TASHLANDI
// ============================================================
export const COMPLEX_STATUSES = [
  { value: 'building' },
  { value: 'completed' },
  { value: 'planned' },
];