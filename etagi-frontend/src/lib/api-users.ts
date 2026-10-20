import { api, API_URL } from './api';

const SERVER_URL = API_URL.replace('/api', '');

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/users/login', { email, password });
  return data;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get('/users/profile');
  return data;
}

export async function updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
  const { data } = await api.put('/users/profile', payload);
  return data;
}

export async function getFavorites(): Promise<any[]> {
  const { data } = await api.get('/users/favorites');
  return data;
}

export async function getViewHistory(): Promise<any[]> {
  const { data } = await api.get('/users/history');
  return data;
}



export async function addToFavorites(propertyId: number) {
  const { data } = await api.post('/users/favorites', { propertyId });
  return data;
}

export async function removeFromFavorites(propertyId: number) {
  const { data } = await api.delete(`/users/favorites/${propertyId}`);
  return data;
}

export async function addToHistory(propertyId: number) {
  const { data } = await api.post('/users/views', { propertyId });
  return data;
}

export async function getScheduled(): Promise<any[]> {
  const { data } = await api.get('/users/scheduled');
  return data;
}