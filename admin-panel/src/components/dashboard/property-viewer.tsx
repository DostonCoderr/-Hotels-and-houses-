'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, Heart, Share2, MoreVertical, Info, ArrowUpRight, X, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertySwiper } from '@/components/dashboard/property-swiper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { useTranslation } from '@/lib/translations';
import type { Property } from '@/types';
import { useLooseT } from './dashboard-kit';

interface PropertyViewerProps {
  properties: Property[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const glass =
  'flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55';

export function PropertyViewer({ properties, selectedId, onSelect, onEdit, onDelete }: PropertyViewerProps) {
  const { t } = useTranslation();
  const T = useLooseT();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const property = properties.find((p) => p.id === selectedId) || null;

  // Boshqa uyga o'tganda "yoqtirilgan" holati va panel tiklanadi
  useEffect(() => {
    setIsFavorite(false);
    setShowDetails(false);
  }, [selectedId]);

  if (!property) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/30">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t.selectProperty}</p>
        </div>
      </div>
    );
  }

  const viewUrl = () => `${window.location.origin}/properties/view/${property.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(viewUrl());
      toast.success(T.linkCopied ?? 'Havola nusxalandi');
    } catch {
      toast.error(t.errorOccurred);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: property.name, text: property.address, url: viewUrl() });
      else await copyLink();
    } catch {
      /* foydalanuvchi bekor qildi */
    }
  };

  const toggleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      await api.post(`/favorites/${property.id}/toggle`);
    } catch {
      setIsFavorite(!next);
      toast.error(t.errorOccurred);
    }
  };

  const specs = [
    { label: t.rooms, value: `${property.rooms}` },
    { label: t.area, value: `${property.area} m²` },
    { label: t.floor, value: `${property.floor} / ${property.floorsTotal}` },
    { label: t.pricePerM2, value: formatPrice(property.priceM2) },
  ];
  const features = property.features ?? [];
  const advantages = property.advantages ?? [];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-muted/30">
      <div className="group relative m-3 mb-2 min-h-0 flex-1 overflow-hidden rounded-3xl">
        <PropertySwiper properties={properties} selectedId={selectedId} onSelect={onSelect} />

        {/* Tafsilotlar paneli */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute inset-x-0 bottom-0 z-40 max-h-[70%] overflow-y-auto rounded-t-3xl bg-card/95 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{t.propertyBasicInfo}</h3>
                <button type="button" onClick={() => setShowDetails(false)} aria-label={T.close ?? 'Yopish'} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border/40 lg:grid-cols-4">
                {specs.map((s) => (
                  <div key={s.label} className="bg-card p-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              {features.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-muted-foreground">{t.features}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {features.map((f, i) => <Badge key={i} variant="outline" className="text-xs font-normal">{f}</Badge>)}
                  </div>
                </div>
              )}
              {advantages.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-muted-foreground">{t.advantages}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {advantages.map((a, i) => (
                      <Badge key={i} variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Amallar */}
        <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5">
          <button type="button" onClick={toggleFavorite} aria-pressed={isFavorite} aria-label={T.favorite ?? 'Sevimli'} className={glass}>
            <Heart className={cn('h-4 w-4 transition-all', isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white')} />
          </button>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            aria-pressed={showDetails}
            aria-label={T.details ?? 'Tafsilotlar'}
            className={cn(glass, showDetails && 'bg-primary text-primary-foreground hover:bg-primary')}
          >
            <Info className="h-4 w-4" />
          </button>
          <button type="button" onClick={share} aria-label={T.share ?? 'Ulashish'} className={glass}>
            <Share2 className="h-4 w-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label={T.more ?? 'Yana'} className={glass}>
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[110] w-56">
              <DropdownMenuItem onClick={() => onEdit?.(property)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> {t.editProperty}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
                <Link2 className="mr-2 h-4 w-4" /> {T.copyLink ?? 'Havolani nusxalash'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`/properties/view/${property.id}`, '_blank')} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> {T.openNewTab ?? 'Yangi oynada ochish'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(property)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> {t.deleteProperty}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pastki panel */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit?.(property)} className="rounded-full">
            <Pencil className="mr-2 h-3.5 w-3.5" /> {t.editProperty}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete?.(property)} className="rounded-full text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5" /> {t.deleteProperty}
          </Button>
        </div>
        <Button size="sm" onClick={() => router.push(`/properties/view/${property.id}`)} className="rounded-full">
          {t.viewProperty} <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}