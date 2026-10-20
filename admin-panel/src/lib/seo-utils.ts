'use client';

import { useEffect, useState } from 'react';
import type { SeoRecord, ServerFieldError } from '@/lib/api-seo';

// ============================================================
// KONSTANTALAR
// ============================================================
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://etagi.uz';

export const LIMITS = {
  title: { min: 30, max: 60, hard: 200, serverMin: 3 },
  description: { min: 120, max: 160, hard: 500, serverMin: 10 },
  keywords: { min: 3, max: 10 },
};

export const FIELD_KEYS = ['title', 'description', 'keywords', 'ogTitle', 'ogDescription', 'ogImage', 'slug'] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];
export type SeoDraft = Record<FieldKey, string>;
export type FieldErrors = Partial<Record<FieldKey, string>>;

export const EMPTY_DRAFT: SeoDraft = {
  title: '', description: '', keywords: '', ogTitle: '', ogDescription: '', ogImage: '', slug: '',
};

export function toDraft(s?: Partial<SeoRecord> | null): SeoDraft {
  return {
    title: s?.title || '',
    description: s?.description || '',
    keywords: s?.keywords || '',
    ogTitle: s?.ogTitle || '',
    ogDescription: s?.ogDescription || '',
    ogImage: s?.ogImage || '',
    slug: (s as any)?.slug || '',
  };
}

export const payloadOf = (d: SeoDraft): SeoDraft =>
  Object.fromEntries(FIELD_KEYS.map((k) => [k, d[k].trim()])) as SeoDraft;

export const sameDraft = (a?: SeoDraft, b?: SeoDraft) =>
  !!a && !!b && FIELD_KEYS.every((k) => a[k].trim() === b[k].trim());

// ============================================================
// KALIT SO'ZLAR
// ============================================================
export function keywordsToList(s: string): string[] {
  const seen = new Set<string>();
  return s
    .split(',')
    .map((x) => x.trim())
    .filter((x) => {
      const k = x.toLowerCase();
      if (!x || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
}
export const listToKeywords = (l: string[]) => l.join(', ');

// ============================================================
// URL YORDAMCHILARI
// ============================================================
export function siteHost(): string {
  try { return new URL(SITE_URL).host; } catch { return SITE_URL.replace(/^https?:\/\//, ''); }
}

export function resolveImageUrl(url: string): string {
  const u = url.trim();
  if (u.startsWith('/')) return SITE_URL.replace(/\/$/, '') + u;
  return u;
}

const pathOf = (slug: string, page: string) =>
  (slug || (page === 'home' ? '' : page))
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+|\/+$/g, '');

/** Google ko'rinishidagi manzil: etagi.uz › novostroyki */
export function displayUrl(page: string, slug: string): string {
  const crumbs = pathOf(slug, page).split('/').filter(Boolean).join(' › ');
  return siteHost() + (crumbs ? ` › ${crumbs}` : '');
}

export function canonicalUrl(page: string, slug: string): string {
  if (/^https?:\/\//i.test(slug)) return slug;
  const p = pathOf(slug, page);
  return SITE_URL.replace(/\/$/, '') + (p ? `/${p}` : '/');
}

// ============================================================
// <head> KODI (backend getOgData bilan bir xil fallback mantiq)
// ============================================================
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildMetaTags(d: SeoDraft, page: string): string {
  const lines: string[] = [];
  if (d.title) lines.push(`<title>${esc(d.title)}</title>`);
  if (d.description) lines.push(`<meta name="description" content="${esc(d.description)}">`);
  if (d.keywords) lines.push(`<meta name="keywords" content="${esc(d.keywords)}">`);
  lines.push(`<link rel="canonical" href="${esc(canonicalUrl(page, d.slug))}">`);
  lines.push('');
  lines.push(`<meta property="og:type" content="website">`);
  lines.push(`<meta property="og:title" content="${esc(d.ogTitle || d.title)}">`);
  lines.push(`<meta property="og:description" content="${esc(d.ogDescription || d.description)}">`);
  if (d.ogImage) lines.push(`<meta property="og:image" content="${esc(resolveImageUrl(d.ogImage))}">`);
  lines.push(`<meta property="og:url" content="${esc(canonicalUrl(page, d.slug))}">`);
  lines.push(`<meta name="twitter:card" content="summary_large_image">`);
  return lines.join('\n');
}

// ============================================================
// RASM TEKSHIRUVI (yuklanishi va o'lchami)
// ============================================================
export interface ImageState { status: 'idle' | 'loading' | 'ok' | 'error'; w: number; h: number }

export function useImageMeta(url: string): ImageState {
  const [state, setState] = useState<ImageState>({ status: 'idle', w: 0, h: 0 });

  useEffect(() => {
    const u = url.trim();
    if (!u) { setState({ status: 'idle', w: 0, h: 0 }); return; }

    let alive = true;
    setState((s) => ({ ...s, status: 'loading' }));
    const timer = setTimeout(() => {
      const img = new Image();
      img.onload = () => alive && setState({ status: 'ok', w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => alive && setState({ status: 'error', w: 0, h: 0 });
      img.src = resolveImageUrl(u);
    }, 400);

    return () => { alive = false; clearTimeout(timer); };
  }, [url]);

  return state;
}

// ============================================================
// TAHLIL VA BALL (0–100)
// ============================================================
export type CheckLevel = 'ok' | 'warn' | 'bad';
export interface SeoCheck { id: string; label: string; hint?: string; level: CheckLevel; weight: number }

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * img === undefined  → rasm o'lchami tekshirilmaydi (faqat URL formati)
 * Matnlar hozircha o'zbekcha — i18n kerak bo'lsa, `id` bo'yicha tarjima qiling.
 */
export function analyzeSeo(
  d: SeoDraft,
  others: { page: string; draft: SeoDraft }[],
  img?: ImageState
): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = [];
  const add = (c: SeoCheck) => checks.push(c);

  // Title
  const tl = d.title.trim().length;
  add({
    id: 'title', weight: 20, label: 'Title uzunligi',
    ...(tl < LIMITS.title.serverMin
      ? { level: 'bad', hint: tl === 0 ? 'Title kiritilmagan' : `Kamida ${LIMITS.title.serverMin} belgi kerak` }
      : tl < LIMITS.title.min
        ? { level: 'warn', hint: `Qisqa: ${tl}. Tavsiya: ${LIMITS.title.min}–${LIMITS.title.max}` }
        : tl > LIMITS.title.max
          ? { level: 'warn', hint: `Qidiruvda kesilib qoladi: ${tl} / ${LIMITS.title.max}` }
          : { level: 'ok' }),
  } as SeoCheck);

  // Description
  const dl = d.description.trim().length;
  add({
    id: 'description', weight: 20, label: 'Description uzunligi',
    ...(dl < LIMITS.description.serverMin
      ? { level: 'bad', hint: dl === 0 ? 'Description kiritilmagan' : `Kamida ${LIMITS.description.serverMin} belgi kerak` }
      : dl < LIMITS.description.min
        ? { level: 'warn', hint: `Qisqa: ${dl}. Tavsiya: ${LIMITS.description.min}–${LIMITS.description.max}` }
        : dl > LIMITS.description.max
          ? { level: 'warn', hint: `Kesilib qoladi: ${dl} / ${LIMITS.description.max}` }
          : { level: 'ok' }),
  } as SeoCheck);

  // Og'Image
  const oi = d.ogImage.trim();
  const validUrl = /^https?:\/\/\S+$/i.test(oi) || oi.startsWith('/');
  let imgCheck: Pick<SeoCheck, 'level' | 'hint'>;
  if (!oi) imgCheck = { level: 'bad', hint: "Ijtimoiy tarmoqda rasm chiqmaydi" };
  else if (!validUrl) imgCheck = { level: 'bad', hint: "URL noto'g'ri (https:// yoki / bilan boshlansin)" };
  else if (img?.status === 'error') imgCheck = { level: 'bad', hint: 'Rasm yuklanmadi — havolani tekshiring' };
  else if (img?.status === 'ok') {
    const ratio = img.w / img.h;
    if (img.w < 600) imgCheck = { level: 'warn', hint: `Kichik: ${img.w}×${img.h}. Tavsiya: 1200×630` };
    else if (ratio < 1.6 || ratio > 2.1) imgCheck = { level: 'warn', hint: `Nisbat ${ratio.toFixed(2)}:1 — tavsiya 1.91:1 (1200×630)` };
    else imgCheck = { level: 'ok', hint: `${img.w}×${img.h}` };
  } else imgCheck = { level: 'ok' };
  add({ id: 'ogImage', weight: 20, label: 'OG rasm', ...imgCheck });

  // Takrorlanish
  const dupTitle = tl >= LIMITS.title.serverMin && others.find((o) => norm(o.draft.title) === norm(d.title));
  add({
    id: 'uniqueTitle', weight: 10, label: 'Title noyob',
    level: tl < LIMITS.title.serverMin ? 'bad' : dupTitle ? 'bad' : 'ok',
    hint: dupTitle ? `Boshqa sahifa bilan bir xil: ${dupTitle.page}` : undefined,
  });
  const dupDesc = dl >= LIMITS.description.serverMin && others.find((o) => norm(o.draft.description) === norm(d.description));
  add({
    id: 'uniqueDescription', weight: 10, label: 'Description noyob',
    level: dl < LIMITS.description.serverMin ? 'bad' : dupDesc ? 'bad' : 'ok',
    hint: dupDesc ? `Boshqa sahifa bilan bir xil: ${dupDesc.page}` : undefined,
  });

  // Qolganlar
  const kw = keywordsToList(d.keywords).length;
  add({
    id: 'keywords', weight: 5, label: 'Kalit so\'zlar',
    level: kw === 0 ? 'warn' : kw > LIMITS.keywords.max ? 'warn' : 'ok',
    hint: kw === 0 ? "Bo'sh (Google e'tibor bermaydi, lekin ba'zi qidiruvchilar o'qiydi)" : kw > LIMITS.keywords.max ? `Juda ko'p: ${kw}` : undefined,
  });
  add({ id: 'ogTitle', weight: 5, label: 'OG Title', level: d.ogTitle.trim() ? 'ok' : 'warn', hint: d.ogTitle.trim() ? undefined : "Bo'sh — Title ishlatiladi" });
  add({ id: 'ogDescription', weight: 5, label: 'OG Description', level: d.ogDescription.trim() ? 'ok' : 'warn', hint: d.ogDescription.trim() ? undefined : "Bo'sh — Description ishlatiladi" });
  add({ id: 'slug', weight: 5, label: 'Canonical / og:url', level: d.slug.trim() ? 'ok' : 'warn', hint: d.slug.trim() ? undefined : 'Belgilanmagan' });

  const score = Math.round(
    checks.reduce((a, c) => a + c.weight * (c.level === 'ok' ? 1 : c.level === 'warn' ? 0.5 : 0), 0)
  );
  return { score, checks };
}

export const scoreTone = (score: number) =>
  score >= 80
    ? { text: 'text-emerald-500', bg: 'bg-emerald-500/10', hex: '#10b981' }
    : score >= 50
      ? { text: 'text-amber-500', bg: 'bg-amber-500/10', hex: '#f59e0b' }
      : { text: 'text-rose-500', bg: 'bg-rose-500/10', hex: '#f43f5e' };

// ============================================================
// VALIDATSIYA (backend sxemasi bilan bir xil)
// ============================================================
export function validateDraft(d: SeoDraft): FieldErrors {
  const e: FieldErrors = {};
  const t = d.title.trim(), de = d.description.trim();
  if (!t) e.title = 'Majburiy maydon';
  else if (t.length < LIMITS.title.serverMin) e.title = `Kamida ${LIMITS.title.serverMin} belgi`;
  if (!de) e.description = 'Majburiy maydon';
  else if (de.length < LIMITS.description.serverMin) e.description = `Kamida ${LIMITS.description.serverMin} belgi`;
  const oi = d.ogImage.trim();
  if (oi && !(/^https?:\/\/\S+$/i.test(oi) || oi.startsWith('/'))) e.ogImage = "Noto'g'ri URL";
  const sl = d.slug.trim();
  if (sl && !/^(https?:\/\/\S+|\/?[a-z0-9\-_\/]+)$/i.test(sl)) e.slug = "Noto'g'ri format (masalan: /novostroyki)";
  return e;
}

export function serverFieldText(err: ServerFieldError): string {
  switch (err.code) {
    case 'required': return 'Majburiy maydon';
    case 'too_short': return `Kamida ${err.min} belgi`;
    case 'too_long': return `Ko'pi bilan ${err.max} belgi`;
    default: return "Noto'g'ri format";
  }
}

export function downloadText(filename: string, text: string, mime = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}