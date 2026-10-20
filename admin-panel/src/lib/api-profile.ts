import { api } from '@/lib/api';
import type { Admin, ActivityLog, PaginatedResponse } from '@/types';

// ============================================================
// GET PROFILE
// ============================================================
export async function fetchProfile(): Promise<Admin> {
  const { data } = await api.get('/admins/me');
  return data;
}

// ============================================================
// UPDATE PROFILE
// ============================================================
export async function updateProfile(payload: {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  address?: string;
}): Promise<Admin> {
  const { data } = await api.put('/admins/me', payload);
  return data;
}

// ============================================================
// UPLOAD AVATAR
// ============================================================
export async function uploadAvatar(file: File): Promise<{ avatar: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const { data } = await api.post('/admins/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ============================================================
// DELETE AVATAR
// ============================================================
export async function deleteAvatar(): Promise<void> {
  await api.delete('/admins/me/avatar');
}

// ============================================================
// CHANGE PASSWORD
// ============================================================
export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await api.put('/admins/me/password', payload);
}

// ============================================================
// GET MY ACTIVITY
// ============================================================
export async function fetchMyActivity(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedResponse<ActivityLog>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const { data } = await api.get(`/admins/me/activity?${query.toString()}`);
  return data;
}