'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { UPLOADS_URL } from '@/lib/constants';
import type { Property } from '@/types';
import { useLooseT } from './dashboard-kit';

interface PropertyListProps {
  properties: Property[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

type Filter = 'all' | 'available' | 'booked' | 'sold';
const DOT: Record<string, string> = {
  available: 'bg-emerald-500',
  booked: 'bg-amber-500',
  sold: 'bg-rose-500',
};

export function PropertyList({ properties, selectedId, onSelect }: PropertyListProps) {
  const { t } = useTranslation();
  const T = useLooseT();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: T.all ?? 'Hammasi' },
    { key: 'available', label: t.statusAvailable },
    { key: 'booked', label: t.statusBooked },
    { key: 'sold', label: t.statusSold },
  ];

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: properties.length };
    properties.forEach((p) => (c[p.status] = (c[p.status] || 0) + 1));
    return c;
  }, [properties]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return properties.filter(
      (p) =>
        (filter === 'all' || p.status === filter) &&
        (!needle || `${p.name} ${p.address}`.toLowerCase().includes(needle))
    );
  }, [properties, q, filter]);

  // Slayder orqali tanlanganda ro'yxat ham o'sha elementga o'tadi
  useEffect(() => {
    if (selectedId == null) return;
    document.getElementById(`pl-${selectedId}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-72 flex-shrink-0 flex-col border-r border-border/40 bg-card xl:w-80"
    >
      <div className="space-y-3 p-5 pb-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-foreground">{t.propertyList}</h2>
          <span className="text-xs tabular-nums text-muted-foreground">{filtered.length} / {properties.length}</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchProperties}
            className="h-10 rounded-full border-0 bg-muted/50 pl-9 text-sm focus-visible:ring-1"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter === f.key ? 'bg-foreground text-background' : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label} <span className="opacity-60">{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {filtered.length === 0 && (
          <p className="px-2 py-10 text-center text-sm text-muted-foreground">{t.noData}</p>
        )}
        {filtered.map((property) => {
          const isSelected = property.id === selectedId;
          return (
            <button
              key={property.id}
              id={`pl-${property.id}`}
              type="button"
              onClick={() => onSelect(property.id)}
              className="relative flex w-full items-center gap-3 rounded-2xl p-2 text-left"
            >
              {isSelected && (
                <motion.span
                  layoutId="pl-active"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                {property.images?.[0] ? (
                  <img src={`${UPLOADS_URL}${property.images[0].url}`} alt={property.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <span className={cn('absolute bottom-1 right-1 h-2 w-2 rounded-full ring-2 ring-card', DOT[property.status] || 'bg-muted-foreground')} />
              </div>
              <div className="relative min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', isSelected ? 'text-primary' : 'text-foreground')}>{property.name}</p>
                <p className="truncate text-xs text-muted-foreground">{property.address}</p>
              </div>
              <p className="relative flex-shrink-0 text-xs font-semibold tabular-nums text-foreground/80">
                {formatPrice(property.price)}
              </p>
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
}