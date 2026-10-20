import { api } from '@/lib/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'application' | 'user' | 'system' | 'success';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchNotifications(limit = 10) {
  const { data } = await api.get(`/notifications?limit=${limit}`);
  return data as { items: Notification[]; unreadCount: number };
}

export async function markAllAsRead() {
  await api.put('/notifications/read-all');
}

export async function markAsRead(id: number) {
  await api.put(`/notifications/${id}/read`);
}