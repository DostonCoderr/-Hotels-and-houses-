import { api, API_URL } from './api';

const SERVER_URL = API_URL.replace('/api', '');

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  area: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  material: string;
  style?: string;
  category: string;
  features: string[];
  published: boolean;
  images: { id: number; url: string; isMain: boolean }[];
  
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

function fixImageUrls(project: any) {
  if (!project) return project;
  if (project.images && Array.isArray(project.images)) {
    project.images = project.images.map((img: any) => ({
      ...img,
      url: img.url.startsWith('http') ? img.url : `${SERVER_URL}${img.url}`
    }));
  }
  return project;
}

export async function fetchProjects(params?: any) {
  const { data } = await api.get('/projects', { params });
  if (data.items) data.items = data.items.map(fixImageUrls);
  return data;
}

export async function fetchProjectById(id: number): Promise<Project> {
  const { data } = await api.get(`/projects/${id}`);
  return fixImageUrls(data);
}