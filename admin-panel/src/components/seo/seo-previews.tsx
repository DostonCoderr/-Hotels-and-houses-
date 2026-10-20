'use client';

import { useState } from 'react';
import { Check, Copy, Globe, ImageIcon, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { siteHost, type ImageState } from '@/lib/seo-utils';

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function Segmented<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { key: T; icon: any; label: string }[] }) {
  return (
    <div className="flex items-center rounded-full bg-muted/60 p-0.5" role="group">
      {items.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          aria-label={label}
          title={label}
          onClick={() => onChange(key)}
          className={cn('flex h-7 w-7 items-center justify-center rounded-full transition-colors', value === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

/* ---------------- Google ---------------- */
export function GooglePreview({ title, description, url, placeholderTitle, placeholderDescription }: {
  title: string; description: string; url: string; placeholderTitle: string; placeholderDescription: string;
}) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const mobile = device === 'mobile';
  const tMax = mobile ? 58 : 60;
  const dMax = mobile ? 120 : 160;
  const cutsTitle = title.length > tMax;
  const cutsDesc = description.length > dMax;
  const host = siteHost();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Google</h4>
        <Segmented value={device} onChange={setDevice} items={[{ key: 'desktop', icon: Monitor, label: 'Desktop' }, { key: 'mobile', icon: Smartphone, label: 'Mobile' }]} />
      </div>

      <div className={cn('rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#202124] dark:ring-white/10', mobile ? 'max-w-[360px]' : '')}>
        <div className="mb-1.5 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold uppercase text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
            {host[0]}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] text-neutral-800 dark:text-neutral-200">{host}</p>
            <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">{url}</p>
          </div>
        </div>
        <p className={cn('mb-1 text-[19px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]', !title && 'opacity-50')}>
          {cut(title || placeholderTitle, tMax)}
        </p>
        <p className={cn('text-sm leading-snug text-neutral-600 dark:text-neutral-300', !description && 'opacity-50')}>
          {cut(description || placeholderDescription, dMax)}
        </p>
      </div>

      {(cutsTitle || cutsDesc) && (
        <p className="mt-2 text-xs text-amber-500">
          {cutsTitle && `Title ${tMax} belgidan keyin kesiladi. `}
          {cutsDesc && `Description ${dMax} belgidan keyin kesiladi.`}
        </p>
      )}
    </div>
  );
}

/* ---------------- Ijtimoiy tarmoq kartasi ---------------- */
export function SocialPreview({ title, description, image, imageState }: {
  title: string; description: string; image: string; imageState: ImageState;
}) {
  const [layout, setLayout] = useState<'large' | 'compact'>('large');
  const host = siteHost().toUpperCase();
  const showImg = !!image && imageState.status !== 'error';

  const Img = (
    <div className={cn('relative flex-shrink-0 overflow-hidden bg-muted', layout === 'large' ? 'aspect-[1.91/1] w-full' : 'h-24 w-24 sm:h-28 sm:w-28')}>
      {showImg ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
          <ImageIcon className="h-6 w-6" />
          {layout === 'large' && (
            <span className="text-xs">{imageState.status === 'error' ? 'Rasm yuklanmadi' : 'Rasm yo‘q'}</span>
          )}
        </div>
      )}
      {imageState.status === 'ok' && layout === 'large' && (
        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] tabular-nums text-white">
          {imageState.w}×{imageState.h}
        </span>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Telegram · Facebook · X</h4>
        <Segmented value={layout} onChange={setLayout} items={[{ key: 'large', icon: Monitor, label: 'Katta' }, { key: 'compact', icon: Smartphone, label: 'Ixcham' }]} />
      </div>

      <div className={cn('overflow-hidden rounded-2xl bg-card ring-1 ring-border', layout === 'compact' && 'flex')}>
        {Img}
        <div className="min-w-0 space-y-1 p-3.5">
          <p className="text-[11px] tracking-wide text-muted-foreground">{host}</p>
          <p className={cn('line-clamp-2 text-sm font-semibold leading-snug text-foreground', !title && 'opacity-50')}>{title || '—'}</p>
          <p className={cn('line-clamp-2 text-xs leading-relaxed text-muted-foreground', !description && 'opacity-50')}>{description || '—'}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- <head> kodi ---------------- */
export function MetaTags({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Nusxalab bo‘lmadi');
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe className="h-4 w-4 text-muted-foreground" /> {'<head>'}
        </h4>
        <button type="button" onClick={copy} className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Nusxalandi' : 'Nusxalash'}
        </button>
      </div>
      <pre className="max-h-64 overflow-auto rounded-2xl bg-muted/40 p-4 font-mono text-[11px] leading-relaxed text-foreground">{code}</pre>
    </div>
  );
}