'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Pencil, Trash2, Eye, Heart, MessageSquare, Calendar,
  MapPin, Bed, Maximize, Building2, Loader2, Share2, Tag, Layers,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertySlider } from '@/components/dashboard/property-slider';
import {
  PropertyStatsChart,
  sumOf,
  pctChange,
  METRIC_COLORS,
  type MetricKey,
  type Totals,
  type SeriesPoint,
} from '@/components/properties/property-stats-chart';
import {
  CountUp,
  Delta,
  Sparkline,
  InterestScore,
  PropertyFunnel,
} from '@/components/properties/property-insights';
import { useTranslation } from '@/lib/translations';
import { formatPrice } from '@/lib/format';
import { STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Property } from '@/types';

// ⚠️ Faqat api-properties dan import qilinadi
import { 
  fetchPropertyById, 
  fetchPropertyStats, 
  deleteProperty 
} from '@/lib/api-properties';

export default function PropertyViewPage() {
  const { t } = useTranslation();
  const T = t as unknown as Record<string, string | undefined>;
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const tRef = useRef(t);
  tRef.current = t;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // Holatlar
  const [stats, setStats] = useState<Totals>({ views: 0, favorites: 0, inquiries: 0, scheduled: 0 });
  // ⚠️ Chart ma'lumotlari
  const [series, setSeries] = useState<SeriesPoint[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        
        // 1. Uyni yuklash (api-properties orqali)
        const data = await fetchPropertyById(id);
        setProperty(data);

        // 2. Statistikani yuklash (api-properties orqali)
        try {
          const s = await fetchPropertyStats(id);
          
          setStats({
            views: s.views || 0,
            favorites: s.favorites || 0,
            inquiries: s.inquiries || 0,
            scheduled: s.scheduled || 0,
          });

          // Faqat backenddan kelgan real ma'lumotni saqlaymiz
          if (s.daily && Array.isArray(s.daily) && s.daily.length > 0) {
            setSeries(s.daily);
          } else {
            setSeries([]);
          }
        } catch (err) {
          console.error("Stats yuklashda xato:", err);
          // Hech qanday mock yozmaymiz. Bo'sh qoladi.
          setStats({ views: 0, favorites: 0, inquiries: 0, scheduled: 0 });
          setSeries([]);
        }
      } catch {
        toast.error(tRef.current.noData);
        router.push('/properties');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router]);

  const handleDelete = async () => {
    if (!property) return;
    if (!confirm(t.deleteConfirm)) return;
    try {
      // ⚠️ deleteProperty orqali o'chirish
      await deleteProperty(property.id);
      toast.success(t.propertyDeleted);
      router.push('/properties');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(T.linkCopied ?? 'Havola nusxalandi');
    } catch {
      toast.error(T.errorOccurred ?? 'Xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!property) return null;

  const statusLabels: Record<string, string> = {
    available: t.statusAvailable,
    booked: t.statusBooked,
    sold: t.statusSold,
  };

  const STAT_CARDS: { key: MetricKey; label: string; icon: typeof Eye }[] = [
    { key: 'views', label: t.totalViews, icon: Eye },
    { key: 'favorites', label: t.savedFavorites, icon: Heart },
    { key: 'inquiries', label: t.inquiries, icon: MessageSquare },
    { key: 'scheduled', label: t.scheduledViewings, icon: Calendar },
  ];

  const specs = [
    { icon: Bed, label: t.rooms, value: `${property.rooms}` },
    { icon: Maximize, label: t.area, value: `${property.area} m²` },
    { icon: Layers, label: t.floor, value: `${property.floor} / ${property.floorsTotal}` },
    { icon: Tag, label: t.pricePerM2, value: formatPrice(property.priceM2) },
  ];

  const hasFeatures = !!property.features?.length;
  const hasAdvantages = !!property.advantages?.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* ===================== SARLAVHA ===================== */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex min-w-0 items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/properties')}
            className="shrink-0 rounded-full"
            aria-label={T.back ?? 'Orqaga'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-2xl font-bold text-foreground">{property.name}</h1>
              <Badge variant="outline" className={cn('border-0 text-xs', STATUS_COLORS[property.status] || 'bg-muted')}>
                {statusLabels[property.status] || property.status}
              </Badge>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{property.address}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full" aria-label={T.share ?? 'Ulashish'}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button onClick={() => router.push(`/properties/${property.id}`)} className="rounded-full">
            <Pencil className="mr-2 h-4 w-4" /> {t.editProperty}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="rounded-full text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t.deleteProperty}
          </Button>
        </div>
      </motion.header>

      {/* ===================== HERO ===================== */}
      <motion.section
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[62vh] max-h-[720px] min-h-[420px] w-full overflow-hidden rounded-[2rem] bg-muted shadow-lg"
      >
        {property.images && property.images.length > 0 ? (
          <PropertySlider images={property.images} propertyName={property.name} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Building2 className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t.imageNotUploaded}</p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20" />

        <div className="pointer-events-none absolute left-5 top-5 z-10 flex gap-2">
          <Badge className="border-0 bg-white/90 px-3 py-1 text-foreground backdrop-blur">
            {property.type?.name}
          </Badge>
          {property.complex?.name && (
            <Badge className="border-0 bg-black/40 px-3 py-1 text-white backdrop-blur">
              {property.complex.name}
            </Badge>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 sm:inset-x-6 sm:bottom-6">
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/15 bg-black/35 p-5 text-white backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/90">
              <span className="flex items-center gap-1.5"><Bed className="h-4 w-4" /> {property.rooms} {t.rooms}</span>
              <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4" /> {property.area} m²</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {property.floor}/{property.floorsTotal} {t.floor}</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold leading-none sm:text-4xl">{formatPrice(property.price)}</p>
              <p className="mt-1.5 text-sm text-white/75">{formatPrice(property.priceM2)} / m²</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================== KO'RSATKICHLAR ===================== */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((c, i) => {
          const Icon = c.icon;
          const color = METRIC_COLORS[c.key];
          
          // Xavfsiz hisoblash
          const last30 = series.slice(-30);
          const prev30 = series.slice(-60, -30);
          const delta = pctChange(sumOf(last30, c.key), sumOf(prev30, c.key));

          return (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <Card className="overflow-hidden rounded-3xl border-0 bg-card shadow-sm">
                <CardContent className="p-5 pb-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Icon className="h-4 w-4" style={{ color }} />
                    {c.label}
                  </div>
                  <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">
                    <CountUp value={stats[c.key]} />
                  </p>
                  <div className="mt-1">
                    <Delta value={delta} suffix={` ${T.last30days ?? 'oxirgi 30 kun'}`} />
                  </div>
                  <div className="-mx-5 mt-2">
                    {/* Sparkline faqat ma'lumot bo'lsa chiqadi */}
                    {last30.length > 0 && (
                      <Sparkline id={c.key} color={color} data={last30.map((r) => r[c.key])} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* ===================== CHART + TAHLIL ===================== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyStatsChart data={series} />
        </div>
        <div className="space-y-6">
          <InterestScore totals={stats} />
          <PropertyFunnel totals={stats} />
        </div>
      </section>

      {/* ===================== MA'LUMOTLAR ===================== */}
      <section className="space-y-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border/40 md:grid-cols-4">
          {specs.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card p-5">
                <Icon className="mb-3 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-0.5 text-lg font-semibold text-foreground">{s.value}</p>
              </div>
            );
          })}
        </div>

        {(hasFeatures || hasAdvantages) && (
          <Card className="rounded-3xl border-0 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{t.propertyBasicInfo}</CardTitle>
            </CardHeader>
            <CardContent className={cn('grid gap-8', hasFeatures && hasAdvantages && 'md:grid-cols-2')}>
              {hasFeatures && (
                <div>
                  <p className="mb-3 text-xs text-muted-foreground">{t.features}</p>
                  <div className="flex flex-wrap gap-2">
                    {property.features!.map((f, i) => (
                      <Badge key={i} variant="outline" className="bg-muted/50 px-3 py-1 text-xs font-normal">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {hasAdvantages && (
                <div>
                  <p className="mb-3 text-xs text-muted-foreground">{t.advantages}</p>
                  <div className="flex flex-wrap gap-2">
                    {property.advantages!.map((a, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-normal text-emerald-600 dark:text-emerald-400"
                      >
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}