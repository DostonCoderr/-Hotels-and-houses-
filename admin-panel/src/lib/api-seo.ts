import { api } from '@/lib/api';
import type { Seo } from '@/types';
import type { Translations } from '@/lib/translations';

export type SeoRecord = Seo & { slug?: string | null; updatedAt?: string };

// Server maydon xatosi: { code: 'too_short', min: 3 } va h.k.
export interface ServerFieldError {
  code: 'required' | 'too_short' | 'too_long' | 'invalid';
  min?: number;
  max?: number;
}

// ============================================================
// SO'ROVLAR
// ⚠️ Eski kodda yo'l /seo/page/:page edi — backend esa /seo/:page.
//    Shu sababli saqlash 404 berardi. Endi to'g'rilangan.
// ============================================================
export async function fetchSeoPages(): Promise<SeoRecord[]> {
  const { data } = await api.get('/seo');
  return data.items || data;
}

export async function fetchSeoByPage(page: string): Promise<SeoRecord> {
  const { data } = await api.get(`/seo/${page}`);
  return data;
}

export async function updateSeo(page: string, payload: Partial<Seo>): Promise<SeoRecord> {
  const { data } = await api.put(`/seo/${page}`, payload);
  return data;
}

/** Bir nechta sahifani bitta tranzaksiyada saqlash */
export async function bulkUpdateSeo(
  items: (Partial<Seo> & { page: string })[]
): Promise<SeoRecord[]> {
  const { data } = await api.put('/seo', { items });
  return data.items || data;
}

export async function deleteSeo(page: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/seo/${page}`);
  return data;
}

// ============================================================
// SAHIFA YORLIQLARI (tarjima orqali)
// ============================================================
export function getSeoPages(t: Translations) {
  return [
    { value: 'home', label: t.seoPageHome, icon: '🏠' },
    { value: 'novostroyki', label: t.seoPageNovostroyki, icon: '🏢' },
    { value: 'stroitelstvo', label: t.seoPageStroitelstvo, icon: '🏗️' },
    { value: 'commercial', label: t.seoPageCommercial, icon: '🏬' },
    { value: 'project', label: t.seoPageProject, icon: '📐' },
  ];
}