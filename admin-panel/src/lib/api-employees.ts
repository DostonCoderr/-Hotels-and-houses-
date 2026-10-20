import { api } from '@/lib/api';
import type { Employee, PaginatedResponse } from '@/types';

// ============================================================
// TIPLAR
// ============================================================
export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  hidden?: boolean;
  sort?: string;
}

export interface EmployeeStats {
  total: number;
  visible: number;
  hidden: number;
}

// ============================================================
// HAMMASI (public)
// ============================================================
export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await api.get('/employees');
  return data.items || data;
}

// ============================================================
// HAMMASI (admin)
// ============================================================
export async function fetchAdminEmployees(
  params: EmployeeFilters = {}
): Promise<PaginatedResponse<Employee> | Employee[]> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.hidden !== undefined) query.set('hidden', String(params.hidden));
  if (params.sort) query.set('sort', params.sort);

  const { data } = await api.get(`/employees?${query.toString()}`);
  return data;
}

// ============================================================
// ID BO'YICHA
// ============================================================
export async function fetchEmployeeById(id: number): Promise<Employee> {
  const { data } = await api.get(`/employees/${id}`);
  return data;
}

// ============================================================
// YARATISH
// ============================================================
export async function createEmployee(
  payload: Partial<Employee>
): Promise<Employee> {
  const { data } = await api.post('/employees/admin', payload);
  return data;
}

// ============================================================
// YANGILASH
// ============================================================
export async function updateEmployee(
  id: number,
  payload: Partial<Employee>
): Promise<Employee> {
  const { data } = await api.put(`/employees/admin/${id}`, payload);
  return data;
}

// ============================================================
// O'CHIRISH
// ============================================================
export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/admin/${id}`);
}

// ============================================================
// YASHIRISHNI ALMASHTIRISH
// ============================================================
export async function toggleEmployee(id: number): Promise<Employee> {
  const { data } = await api.post(`/employees/admin/${id}/toggle`);
  return data.employee || data;
}

// ============================================================
// QAYTA TARTIBLASH
// ============================================================
export async function reorderEmployees(
  orders: { id: number; order: number }[]
): Promise<void> {
  // MUHIM: "order" — array, "orders" emas
  await api.post('/employees/admin/reorder', { order: orders });
}