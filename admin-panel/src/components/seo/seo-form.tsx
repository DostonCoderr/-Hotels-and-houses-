'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Loader2, Globe, Tag, Link2, ImageIcon, RotateCcw, Trash2, Download,
  Wand2, ChevronDown, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Field, KeywordsInput } from '@/components/seo/seo-field';
import { GooglePreview, SocialPreview, MetaTags } from '@/components/seo/seo-previews';
import { Checklist, ScoreRing } from '@/components/seo/seo-score';
import { useLooseT } from '@/components/dashboard/dashboard-kit';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';
import {
  bulkUpdateSeo, deleteSeo, fetchSeoPages, getSeoPages, updateSeo,
  type SeoRecord, type ServerFieldError,
} from '@/lib/api-seo';
import {
  EMPTY_DRAFT, FIELD_KEYS, LIMITS, analyzeSeo, buildMetaTags, displayUrl, downloadText,
  payloadOf, resolveImageUrl, sameDraft, scoreTone, serverFieldText, toDraft, useImageMeta,
  validateDraft, type FieldErrors, type FieldKey, type SeoDraft,
} from '@/lib/seo-utils';

interface SeoFormProps {
  onSave?: (page: string, data: Partial<SeoRecord>) => Promise<void>;
}

export function SeoForm({ onSave }: SeoFormProps) {
  const { t } = useTranslation();
  const T = useLooseT();
  const tRef = useRef(t);
  tRef.current = t;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [extraPages, setExtraPages] = useState<string[]>([]);
  const [active, setActive] = useState('home');
  const [server, setServer] = useState<Record<string, SeoDraft>>({});
  const [drafts, setDrafts] = useState<Record<string, SeoDraft>>({});
  const [exists, setExists] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, FieldErrors>>({});
  const [showMeta, setShowMeta] = useState(false);

  const allPages = useMemo(
    () => [...getSeoPages(t), ...extraPages.map((p) => ({ value: p, label: p, icon: '📄' }))],
    [t, extraPages]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchSeoPages();
        if (!alive) return;
        const defs = getSeoPages(tRef.current).map((p) => p.value);
        const extra = data.map((r) => r.page).filter((p) => !defs.includes(p));
        const map: Record<string, SeoDraft> = {};
        [...defs, ...extra].forEach((p) => { map[p] = toDraft(data.find((r) => r.page === p)); });
        setExtraPages(extra);
        setServer(map);
        setDrafts(map);
        setExists(new Set(data.map((r) => r.page)));
        setActive(defs[0] ?? extra[0] ?? 'home');
      } catch {
        toast.error(tRef.current.seoLoadFailed);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const draft = drafts[active] ?? EMPTY_DRAFT;
  const img = useImageMeta(draft.ogImage);

  const dirtyPages = useMemo(
    () => allPages.map((p) => p.value).filter((p) => drafts[p] && !sameDraft(drafts[p], server[p])),
    [allPages, drafts, server]
  );
  const isDirty = dirtyPages.includes(active);

  const analyses = useMemo(() => {
    const out: Record<string, ReturnType<typeof analyzeSeo>> = {};
    allPages.forEach((p) => {
      const d = drafts[p.value];
      if (!d) return;
      const others = allPages.filter((o) => o.value !== p.value && drafts[o.value]).map((o) => ({ page: o.value, draft: drafts[o.value] }));
      out[p.value] = analyzeSeo(d, others, p.value === active ? img : undefined);
    });
    return out;
  }, [allPages, drafts, active, img]);

  const overview = useMemo(() => {
    const list = Object.values(analyses);
    const avg = list.length ? Math.round(list.reduce((a, x) => a + x.score, 0) / list.length) : 0;
    const problems = list.reduce((a, x) => a + x.checks.filter((c) => c.level === 'bad').length, 0);
    const dups = list.filter((x) => x.checks.some((c) => (c.id === 'uniqueTitle' || c.id === 'uniqueDescription') && c.level === 'bad' && c.hint)).length;
    return { avg, problems, dups, configured: allPages.filter((p) => exists.has(p.value)).length };
  }, [analyses, allPages, exists]);

  const current = analyses[active] ?? { score: 0, checks: [] };
  const currentInfo = allPages.find((p) => p.value === active);
  const err = errors[active] ?? {};

  const setField = (k: FieldKey, v: string) => {
    setDrafts((d) => ({ ...d, [active]: { ...d[active], [k]: v } }));
    if (err[k]) setErrors((e) => ({ ...e, [active]: { ...e[active], [k]: undefined } }));
  };

  const syncOg = () => setDrafts((d) => ({ ...d, [active]: { ...d[active], ogTitle: d[active].title, ogDescription: d[active].description } }));
  const revert = () => { setDrafts((d) => ({ ...d, [active]: server[active] })); setErrors((e) => ({ ...e, [active]: {} })); };

  const applySaved = (page: string, saved: SeoRecord) => {
    const dd = toDraft(saved);
    setServer((s) => ({ ...s, [page]: dd }));
    setDrafts((d) => ({ ...d, [page]: dd }));
    setExists((e) => new Set(e).add(page));
    setErrors((e) => ({ ...e, [page]: {} }));
  };

  const mapFields = (f: Record<string, ServerFieldError>): FieldErrors => {
    const out: FieldErrors = {};
    Object.entries(f).forEach(([k, v]) => { if ((FIELD_KEYS as readonly string[]).includes(k)) out[k as FieldKey] = serverFieldText(v); });
    return out;
  };

  const handleServerError = (e: any, page?: string) => {
    const data = e?.response?.data;
    if (data?.fields && typeof data.fields === 'object') {
      if (page) setErrors((er) => ({ ...er, [page]: mapFields(data.fields) }));
      else {
        setErrors((er) => {
          const next = { ...er };
          Object.entries(data.fields).forEach(([p, f]) => { next[p] = mapFields(f as any); });
          return next;
        });
      }
    }
    toast.error(data?.error || tRef.current.errorOccurred);
  };

  const saveCurrent = async () => {
    const d = drafts[active];
    if (!d || saving) return;
    const e = validateDraft(d);
    if (Object.keys(e).length) {
      setErrors((er) => ({ ...er, [active]: e }));
      toast.error(T.seoFixErrors ?? 'Maydonlarni tekshiring');
      return;
    }
    try {
      setSaving(true);
      const res = await updateSeo(active, payloadOf(d));
      applySaved(active, res);
      toast.success(t.seoSaved);
      if (onSave) await onSave(active, d);
    } catch (e: any) {
      handleServerError(e, active);
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    if (saving || !dirtyPages.length) return;
    const valid: string[] = [];
    const bad: Record<string, FieldErrors> = {};
    dirtyPages.forEach((p) => {
      const e = validateDraft(drafts[p]);
      if (Object.keys(e).length) bad[p] = e; else valid.push(p);
    });
    if (Object.keys(bad).length) setErrors((er) => ({ ...er, ...bad }));
    if (!valid.length) { toast.error(T.seoFixErrors ?? 'Maydonlarni tekshiring'); return; }

    try {
      setSaving(true);
      const res = await bulkUpdateSeo(valid.map((p) => ({ page: p, ...payloadOf(drafts[p]) })));
      res.forEach((r) => applySaved(r.page, r));
      toast.success(`${res.length} ${T.pagesSaved ?? 'ta sahifa saqlandi'}`);
      if (Object.keys(bad).length) toast.warning(`${Object.keys(bad).length} ${T.pagesSkipped ?? "ta sahifada xato bor — o'tkazib yuborildi"}`);
    } catch (e: any) {
      handleServerError(e);
    } finally {
      setSaving(false);
    }
  };

  const resetPage = async () => {
    if (!exists.has(active)) return;
    if (!confirm(T.seoResetConfirm ?? "Bu sahifaning SEO ma'lumotlari butunlay o'chiriladi. Davom etasizmi?")) return;
    try {
      await deleteSeo(active);
      setExists((e) => { const n = new Set(e); n.delete(active); return n; });
      setServer((s) => ({ ...s, [active]: EMPTY_DRAFT }));
      setDrafts((d) => ({ ...d, [active]: EMPTY_DRAFT }));
      toast.success(T.seoDeleted ?? "SEO o'chirildi");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || t.errorOccurred);
    }
  };

  const exportJson = () => {
    const rows = allPages.filter((p) => exists.has(p.value)).map((p) => ({ page: p.value, ...server[p.value] }));
    downloadText(`seo-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(rows, null, 2));
  };

  const saveRef = useRef(saveCurrent);
  saveRef.current = saveCurrent;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!dirtyPages.length) return;
    const onBefore = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, [dirtyPages.length]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-3xl bg-card" />
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="h-64 animate-pulse rounded-3xl bg-card" />
          <div className="h-[28rem] animate-pulse rounded-3xl bg-card" />
        </div>
      </div>
    );
  }

  const avgTone = scoreTone(overview.avg);
  const imageNote =
    img.status === 'loading' ? { cls: 'text-muted-foreground', text: 'Tekshirilmoqda…', icon: <Loader2 className="h-3 w-3 animate-spin" /> }
    : img.status === 'ok' ? { cls: 'text-emerald-500', text: `${img.w}×${img.h} px`, icon: <CheckCircle2 className="h-3 w-3" /> }
    : img.status === 'error' ? { cls: 'text-rose-500', text: 'Rasm yuklanmadi', icon: <AlertCircle className="h-3 w-3" /> }
    : null;

  return (
    <div className="space-y-6 pb-32">
      {/* ===================== STATISTIKA ===================== */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border/40 lg:grid-cols-4">
        <div className="bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            {T.seoConfigured ?? 'Sozlangan sahifalar'}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {overview.configured}
            <span className="text-lg font-medium text-muted-foreground"> / {allPages.length}</span>
          </p>
        </div>

        <div className="flex items-center justify-between bg-card p-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {T.seoAvgScore ?? "O'rtacha SEO ball"}
            </p>
            <p className={cn('mt-2 text-3xl font-bold tabular-nums', avgTone.text)}>
              {overview.avg}
            </p>
          </div>
          <div className="flex-shrink-0">
            <ScoreRing score={overview.avg} size={52} stroke={6} />
          </div>
        </div>

        <div className="bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            {T.seoProblems ?? 'Muammolar'}
          </p>
          <p className={cn('mt-2 text-3xl font-bold tabular-nums', overview.problems ? 'text-rose-500' : 'text-emerald-500')}>
            {overview.problems}
          </p>
        </div>

        <div className="bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">
            {T.seoDuplicates ?? 'Takrorlanishlar'}
          </p>
          <p className={cn('mt-2 text-3xl font-bold tabular-nums', overview.dups ? 'text-amber-500' : 'text-foreground')}>
            {overview.dups}
          </p>
        </div>
      </div>

      {/* ===================== ASOSIY GRID ===================== */}
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        {/* ===================== SAHIFALAR ===================== */}
        <nav aria-label="SEO sahifalari" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0 lg:self-start">
          {allPages.map((p) => {
            const a = analyses[p.value];
            const tone = scoreTone(a?.score ?? 0);
            const selected = active === p.value;
            const dirty = dirtyPages.includes(p.value);
            const hasErr = Object.values(errors[p.value] ?? {}).some(Boolean);
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setActive(p.value)}
                aria-current={selected ? 'page' : undefined}
                className="relative flex flex-shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
              >
                {selected && (
                  <motion.span layoutId="seo-active" className="absolute inset-0 rounded-2xl bg-card shadow-sm ring-1 ring-border/60" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
                )}
                <span className="relative text-lg">{p.icon}</span>
                <span className="relative min-w-0 flex-1">
                  <span className={cn('block truncate text-sm font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>{p.label}</span>
                  {!exists.has(p.value) && <span className="block text-[11px] text-muted-foreground/70">{T.seoNotConfigured ?? 'Sozlanmagan'}</span>}
                </span>
                <span className="relative flex items-center gap-1.5">
                  {(dirty || hasErr) && (
                    <span className={cn('h-2 w-2 rounded-full', hasErr ? 'bg-rose-500' : 'bg-amber-500')} title={hasErr ? 'Xato' : 'Saqlanmagan'} />
                  )}
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums', tone.bg, tone.text)}>{a?.score ?? 0}</span>
                </span>
              </button>
            );
          })}

          <button type="button" onClick={exportJson} disabled={!exists.size} className="mt-2 hidden items-center gap-2 rounded-2xl px-3 py-2 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 lg:flex">
            <Download className="h-3.5 w-3.5" /> {T.exportJson ?? 'JSON eksport'}
          </button>
        </nav>

        {/* ===================== TAHRIRLASH ===================== */}
        <div className="space-y-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-6">
              <Card className="rounded-3xl border-0 bg-card p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/60 text-xl">{currentInfo?.icon}</span>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">{currentInfo?.label}</h2>
                      <p className="font-mono text-xs text-muted-foreground">{displayUrl(active, draft.slug)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={revert} disabled={!isDirty} className="rounded-full">
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> {T.revert ?? 'Bekor qilish'}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={resetPage} disabled={!exists.has(active)} className="rounded-full text-destructive hover:text-destructive">
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> {T.delete ?? "O'chirish"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-5">
                  <Field id="title" label="Title" required error={err.title} meter={{ value: draft.title.length, min: LIMITS.title.min, max: LIMITS.title.max }}>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="title" value={draft.title} onChange={(e) => setField('title', e.target.value)} placeholder={t.seoTitlePlaceholder} maxLength={LIMITS.title.hard} aria-invalid={!!err.title} className="h-11 border-0 bg-muted/30 pl-10 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50" />
                    </div>
                  </Field>

                  <Field id="description" label="Description" required error={err.description} meter={{ value: draft.description.length, min: LIMITS.description.min, max: LIMITS.description.max }}>
                    <Textarea id="description" value={draft.description} onChange={(e) => setField('description', e.target.value)} placeholder={t.seoDescriptionPlaceholder} rows={3} maxLength={LIMITS.description.hard} aria-invalid={!!err.description} className="resize-none border-0 bg-muted/30 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50" />
                  </Field>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field id="slug" label="Canonical / og:url" error={err.slug} hint="/novostroyki yoki to'liq URL">
                      <div className="relative">
                        <Link2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="slug" value={draft.slug} onChange={(e) => setField('slug', e.target.value)} placeholder={active === 'home' ? '/' : `/${active}`} aria-invalid={!!err.slug} className="h-11 border-0 bg-muted/30 pl-10 font-mono text-sm aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50" />
                      </div>
                    </Field>
                    <Field id="keywords" label="Keywords" hint={<span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />Enter yoki vergul bilan qo'shing</span>}>
                      <KeywordsInput id="keywords" value={draft.keywords} onChange={(v) => setField('keywords', v)} placeholder={t.seoKeywordsPlaceholder} />
                    </Field>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border-0 bg-card p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{t.seoOpenGraph}</h3>
                  <Button type="button" variant="outline" size="sm" onClick={syncOg} className="rounded-full">
                    <Wand2 className="mr-1.5 h-3.5 w-3.5" /> {T.seoSyncOg ?? "Title va Description'dan to'ldirish"}
                  </Button>
                </div>

                <div className="space-y-5">
                  <Field id="ogTitle" label="OG Title" error={err.ogTitle} hint="Bo'sh qoldirsangiz Title ishlatiladi">
                    <Input id="ogTitle" value={draft.ogTitle} onChange={(e) => setField('ogTitle', e.target.value)} placeholder={draft.title || t.seoOgTitlePlaceholder} className="h-11 border-0 bg-muted/30" />
                  </Field>

                  <Field id="ogDescription" label="OG Description" error={err.ogDescription} hint="Bo'sh qoldirsangiz Description ishlatiladi">
                    <Textarea id="ogDescription" value={draft.ogDescription} onChange={(e) => setField('ogDescription', e.target.value)} placeholder={draft.description || t.seoOgDescriptionPlaceholder} rows={3} className="resize-none border-0 bg-muted/30" />
                  </Field>

                  <Field
                    id="ogImage"
                    label="OG Image URL"
                    error={err.ogImage}
                    hint="Tavsiya: 1200×630 px (1.91:1)"
                    action={imageNote && <span className={cn('flex items-center gap-1 text-xs font-medium', imageNote.cls)}>{imageNote.icon}{imageNote.text}</span>}
                  >
                    <div className="relative">
                      <ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="ogImage" value={draft.ogImage} onChange={(e) => setField('ogImage', e.target.value)} placeholder="https://example.com/og.jpg" aria-invalid={!!err.ogImage} className="h-11 border-0 bg-muted/30 pl-10 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50" />
                    </div>
                  </Field>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===================== BALL + KO'RINISHLAR ===================== */}
        <aside className="space-y-6 lg:col-span-2 xl:col-span-1 xl:sticky xl:top-6 xl:self-start">
          <Card className="rounded-3xl border-0 bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <ScoreRing score={current.score} />
              <div>
                <p className="text-sm font-semibold text-foreground">SEO ball</p>
                <p className="text-xs text-muted-foreground">
                  {current.checks.filter((c) => c.level === 'bad').length} muammo · {current.checks.filter((c) => c.level === 'warn').length} ogohlantirish
                </p>
              </div>
            </div>
            <Checklist checks={current.checks} />
          </Card>

          <Card className="space-y-6 rounded-3xl border-0 bg-card p-6 shadow-sm">
            <GooglePreview
              title={draft.title}
              description={draft.description}
              url={displayUrl(active, draft.slug)}
              placeholderTitle={t.seoTitlePlaceholder}
              placeholderDescription={t.seoDescriptionPlaceholder}
            />
            <SocialPreview
              title={draft.ogTitle || draft.title}
              description={draft.ogDescription || draft.description}
              image={draft.ogImage ? resolveImageUrl(draft.ogImage) : ''}
              imageState={img}
            />
          </Card>

          <Card className="rounded-3xl border-0 bg-card p-6 shadow-sm">
            <button type="button" onClick={() => setShowMeta((v) => !v)} aria-expanded={showMeta} className="flex w-full items-center justify-between text-sm font-semibold text-foreground">
              {T.seoHeadCode ?? '<head> kodi'}
              <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', showMeta && 'rotate-180')} />
            </button>
            {showMeta && <div className="mt-4"><MetaTags code={buildMetaTags(draft, active)} /></div>}
          </Card>
        </aside>
      </div>

      {/* ===================== SAQLASH PANELI (FIXED) ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/95 p-3 shadow-2xl backdrop-blur-md md:sticky md:bottom-4 md:left-auto md:right-auto md:mt-6 md:rounded-3xl md:border md:border-border/60 md:p-3 md:pl-5"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
            {dirtyPages.length ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                {dirtyPages.length} {T.unsavedPages ?? "ta sahifada saqlanmagan o'zgarish"}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {T.allSaved ?? 'Hammasi saqlangan'}
              </>
            )}
            <kbd className="ml-1 hidden rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">Ctrl S</kbd>
          </p>

          <div className="flex items-center gap-2">
            {dirtyPages.length > 1 && (
              <Button type="button" variant="outline" onClick={saveAll} disabled={saving} className="rounded-full">
                {T.saveAll ?? 'Hammasini saqlash'} ({dirtyPages.length})
              </Button>
            )}
            <Button type="button" onClick={saveCurrent} disabled={saving || !isDirty} className="min-w-[140px] rounded-full">
              {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.saving}</>) : (<><Save className="mr-2 h-4 w-4" />{t.save}</>)}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}