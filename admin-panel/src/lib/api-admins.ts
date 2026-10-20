import { api } from '@/lib/api';
import type { Admin, Role, PaginatedResponse } from '@/types';
import type { Translations } from '@/lib/translations';

// ============================================================
// TIPLAR
// ============================================================
export interface AdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  roleId?: number;
}

// ============================================================
// HAMMASI
// ============================================================
export async function fetchAdmins(
  params: AdminFilters = {}
): Promise<PaginatedResponse<Admin>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.active !== undefined) query.set('active', String(params.active));
  if (params.roleId) query.set('roleId', String(params.roleId));

  const { data } = await api.get(`/admins?${query.toString()}`);
  return data;
}

// ============================================================
// ID BO'YICHA
// ============================================================
export async function fetchAdminById(id: number): Promise<Admin> {
  const { data } = await api.get(`/admins/${id}`);
  return data;
}

// ============================================================
// YARATISH
// ============================================================
export async function createAdmin(payload: {
  name: string;
  email: string;
  password: string;
  roleId: number;
  active: boolean;
}): Promise<Admin> {
  const { data } = await api.post('/admins', payload);
  return data;
}

// ============================================================
// YANGILASH
// ============================================================
export async function updateAdmin(
  id: number,
  payload: Partial<Admin>
): Promise<Admin> {
  const { data } = await api.put(`/admins/${id}`, payload);
  return data;
}

// ============================================================
// O'CHIRISH
// ============================================================
export async function deleteAdmin(id: number): Promise<void> {
  await api.delete(`/admins/${id}`);
}

// ============================================================
// ROLLAR
// ============================================================
export async function fetchRoles(): Promise<Role[]> {
  const { data } = await api.get('/admins/roles');
  return data.items || data;
}

// ============================================================
// ROL YORLIQLARI (DINAMIK — tarjima orqali)
// ============================================================
export function getRoleLabels(t: Translations): Record<string, string> {
  return {
    super_admin: t.superAdmin,
    content_manager: t.contentManager,
    manager: t.manager,
  };
}