import { api } from './api';

export interface Project {
  id?: number;
  name: string;
  description: string;
  price: number;
  area: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  material: string;
  style?: string;
  category: string;
  features?: string[];
  published?: boolean;
  images?: any[];

  // Yangi maydonlar
  terassa?: boolean;
  wallHeight?: number;
  foundation?: string;
  roof?: string;
  kitchenArea?: number;
  companyName?: string;
  companyExp?: number;
  companyDesc?: string;
  packages?: any[];
}

export async function fetchProjects(params?: any) {
  const { data } = await api.get('/projects', { params });
  return data;
}

export async function fetchProjectById(id: number): Promise<Project> {
  const { data } = await api.get(`/projects/${id}`);
  return data;
}

export async function createProject(payload: Project) {
  const { data } = await api.post('/projects/admin', payload);
  return data;
}

export async function updateProject(id: number, payload: Partial<Project>) {
  const { data } = await api.put(`/projects/admin/${id}`, payload);
  return data;
}

export async function deleteProject(id: number) {
  await api.delete(`/projects/admin/${id}`);
}