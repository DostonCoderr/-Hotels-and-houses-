import { api } from '@/lib/api';
import type { User, Property, Application, PaginatedResponse } from '@/types';

// ============================================================
// TYPES
// ============================================================
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  blocked?: boolean;
  sort?: string;
}

export interface UserStats {
  total: number;
  blocked: number;
  active: number;
  today: number;
}

export interface UserView {
  id: number;
  propertyId: number;
  viewedAt: string;
  property: Property;
  createdAt: string; 
}

export interface UserFavorite {
  id: number;
  userId: number;
  propertyId: number;
  createdAt: string;
  property: Property;
}

// ============================================================
// GET ALL
// ============================================================
export async function fetchUsers(
  params: UserFilters = {}
): Promise<PaginatedResponse<User>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.blocked !== undefined) query.set('blocked', String(params.blocked));
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/users?${query.toString()}`);
  return data;
}

// ============================================================
// STATS
// ============================================================
export async function fetchUserStats(): Promise<UserStats> {
  const { data } = await api.get('/users/stats');
  return data;
}

// ============================================================
// GET BY ID
// ============================================================
export async function fetchUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

// ============================================================
// FAVORITES
// ============================================================
export async function fetchUserFavorites(
  id: number
): Promise<UserFavorite[]> {
  const { data } = await api.get(`/users/${id}/favorites`);
  return data.items || data;
}

// ============================================================
// VIEWS
// ============================================================
export async function fetchUserViews(id: number): Promise<UserView[]> {
  const { data } = await api.get(`/users/${id}/views`);
  return data.items || data;
}

// ============================================================
// APPLICATIONS
// ============================================================
export async function fetchUserApplications(
  id: number
): Promise<Application[]> {
  const { data } = await api.get(`/users/${id}/applications`);
  return data.items || data;
}

// ============================================================
// BLOCK
// ============================================================
export async function blockUser(id: number): Promise<User> {
  const { data } = await api.post(`/users/${id}/block`);
  return data.user || data;
}

// ============================================================
// UNBLOCK
// ============================================================
export async function unblockUser(id: number): Promise<User> {
  const { data } = await api.post(`/users/${id}/unblock`);
  return data.user || data;
}

// ============================================================
// DELETE
// ============================================================
export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}


