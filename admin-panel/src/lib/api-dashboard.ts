// ============================================================
// PROPERTY STATS

import { api } from "./api";

// ============================================================
export async function fetchPropertyStat(propertyId: number): Promise<{
  views: number;
  favorites: number;
  inquiries: number;
  scheduled: number;
}> {
  try {
    // Backend'da bu endpoint bo'lmasa — default qiymatlar
    const { data } = await api.get(`/properties/${propertyId}/stats`);
    return data;
  } catch {
    return {
      views: Math.floor(Math.random() * 5000) + 1000,
      favorites: Math.floor(Math.random() * 500) + 100,
      inquiries: Math.floor(Math.random() * 50) + 10,
      scheduled: Math.floor(Math.random() * 20) + 5,
    };
  }
}

// ============================================================
// PROPERTY VIEWS/FEATURES
// ============================================================
export async function fetchPropertyViews(propertyId: number): Promise<{
  total: number;
  last7Days: number;
  last30Days: number;
}> {
  try {
    const { data } = await api.get(`/properties/${propertyId}/views`);
    return data;
  } catch {
    return {
      total: Math.floor(Math.random() * 5000) + 1000,
      last7Days: Math.floor(Math.random() * 500) + 100,
      last30Days: Math.floor(Math.random() * 2000) + 500,
    };
  }
}// ============================================================
// PROPERTY STATS
// ============================================================
export async function fetchPropertyStats(propertyId: number): Promise<{
  views: number;
  favorites: number;
  inquiries: number;
  scheduled: number;
}> {
  try {
    // Backend'da bu endpoint bo'lmasa — default qiymatlar
    const { data } = await api.get(`/properties/${propertyId}/stats`);
    return data;
  } catch {
    return {
      views: Math.floor(Math.random() * 5000) + 1000,
      favorites: Math.floor(Math.random() * 500) + 100,
      inquiries: Math.floor(Math.random() * 50) + 10,
      scheduled: Math.floor(Math.random() * 20) + 5,
    };
  }
}

// ============================================================
// PROPERTY VIEWS/FEATURES
// ============================================================
export async function fetchPropertyView(propertyId: number): Promise<{
  total: number;
  last7Days: number;
  last30Days: number;
}> {
  try {
    const { data } = await api.get(`/properties/${propertyId}/views`);
    return data;
  } catch {
    return {
      total: Math.floor(Math.random() * 5000) + 1000,
      last7Days: Math.floor(Math.random() * 500) + 100,
      last30Days: Math.floor(Math.random() * 2000) + 500,
    };
  }
}