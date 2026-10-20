// src/lib/constants.ts
import { API_URL } from './api';

// ✅ Rasm manzillari uchun
export const UPLOADS_URL = 
  process.env.NEXT_PUBLIC_UPLOADS_URL || 
  API_URL.replace('/api', '');

// Qolgan sozlamalar (o'zingizda bor bo'lsa, turing)
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];