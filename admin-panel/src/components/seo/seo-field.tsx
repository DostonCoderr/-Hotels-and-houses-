'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { keywordsToList, listToKeywords, LIMITS } from '@/lib/seo-utils';

/** Uzunlik o'lchagich: sariq (qisqa) → yashil (yaxshi) → qizil (uzun) */
export function Meter({ value, min, max }: { value: number; min: number; max: number }) {
  const over = value > max;
  const tone =
    value === 0 ? 'bg-muted-foreground/30'
    : value < min ? 'bg-amber-500'
    : over ? 'bg-rose-500'
    : 'bg-emerald-500';
  const text =
    value === 0 ? 'text-muted-foreground'
    : value < min ? 'text-amber-500'
    : over ? 'text-rose-500'
    : 'text-emerald-500';

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all duration-300', tone)} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
        {/* "yaxshi zona" boshlanishi */}
        <span className="absolute top-0 h-full w-px bg-background/80" style={{ left: `${(min / max) * 100}%` }} aria-hidden />
      </div>
      <span className={cn('w-14 text-right text-xs font-medium tabular-nums', text)}>{value} / {max}</span>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  meter?: { value: number; min: number; max: number };
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ id, label, required, error, hint, meter, action, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-sm">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {action}
      </div>
      {children}
      {meter && <Meter {...meter} />}
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export const inputCls =
  'w-full rounded-xl border-0 bg-muted/30 px-3.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/50';

/** Kalit so'zlar: chip ko'rinishida, Enter / vergul bilan qo'shiladi */
export function KeywordsInput({ id, value, onChange, placeholder }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const list = keywordsToList(value);

  const commit = (raw: string) => {
    const next = keywordsToList(listToKeywords([...list, ...raw.split(',')]));
    if (next.length !== list.length) onChange(listToKeywords(next));
    setDraft('');
  };

  const remove = (i: number) => onChange(listToKeywords(list.filter((_, idx) => idx !== i)));

  return (
    <div>
      <div
        onClick={() => ref.current?.focus()}
        className="flex min-h-11 cursor-text flex-wrap items-center gap-1.5 rounded-xl bg-muted/30 p-2 focus-within:ring-2 focus-within:ring-primary/40"
      >
        {list.map((k, i) => (
          <span key={k} className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary">
            {k}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(i); }} aria-label={`${k} — olib tashlash`} className="rounded-full p-0.5 hover:bg-primary/20">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={ref}
          id={id}
          value={draft}
          onChange={(e) => (e.target.value.includes(',') ? commit(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); if (draft.trim()) commit(draft); }
            else if (e.key === 'Backspace' && !draft && list.length) remove(list.length - 1);
          }}
          onBlur={() => draft.trim() && commit(draft)}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text');
            if (text.includes(',') || text.includes('\n')) { e.preventDefault(); commit(text.replace(/\n/g, ',')); }
          }}
          placeholder={list.length ? '' : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      <p className={cn('mt-2 text-xs tabular-nums', list.length > LIMITS.keywords.max ? 'text-amber-500' : 'text-muted-foreground')}>
        {list.length} · {LIMITS.keywords.min}–{LIMITS.keywords.max}
      </p>
    </div>
  );
}