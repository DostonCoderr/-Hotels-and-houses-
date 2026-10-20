import { api, API_URL } from './api';

const SERVER_URL = API_URL.replace('/api', '');

export interface Property {
  id: number;
  name: string;
  address: string;
  price: number;
  priceM2: number;
  area: number;
  rooms: number | null;
  floor: number;
  floorsTotal: number;
  status: string;
  description: string;
  published: boolean;
  type: { id: number; name: string };
  complex: { id: number; name: string } | null;
  images: { id: number; url: string; isMain: boolean }[];
  lat?: number;
  lng?: number;
  
  // Novostroyka maxsus maydonlari
  imo?: string;
  wall?: string;
  cls?: string;
  metro?: string;
  metroTime?: string;
  metroDist?: string;
  features?: string[];
  advantages?: string[];
  videos?: any[];
  progressPhotos?: any[];
  genplan?: any;

  // Yangi qo'shilgan maydonlar (Xatoliklar shu yerga yozilmagani uchun chiqdi)
  videoUrl?: string;
  completionDate?: string;
  constructionStatus?: string;
  reviewsCount?: number;
  rating?: number;
  declarations?: string; // Backenddan Textarea (string) ko'rinishida keladi
  updatedAt?: string;
}

function fixImageUrls(property: any) {
  if (!property) return property;
  
  if (property.images && Array.isArray(property.images)) {
    property.images = property.images.map((img: any) => ({
      ...img,
      url: img.url.startsWith('http') ? img.url : `${SERVER_URL}${img.url}`
    }));
  }
  return property;
}

export async function fetchProperties(params?: {
  page?: number;
  limit?: number;
  search?: string;
  typeId?: number;
  rooms?: number;
  status?: string;
  published?: boolean;
}) {
  const { data } = await api.get('/properties', { params });
  if (data.items) {
    data.items = data.items.map(fixImageUrls);
  }
  return data;
}

export async function fetchPropertyById(id: number): Promise<Property> {
  const { data } = await api.get(`/properties/${id}`);
  return fixImageUrls(data);
}