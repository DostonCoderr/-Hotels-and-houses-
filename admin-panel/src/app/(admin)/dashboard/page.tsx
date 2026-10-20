'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PropertyList } from '@/components/dashboard/property-list';
import { PropertyViewer } from '@/components/dashboard/property-viewer';
import { ConversionFunnel } from '@/components/dashboard/conversion-funnel';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/translations';
import type { Property } from '@/types';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Funnel uchun backend statistikasi
  const [funnelData, setFunnelData] = useState({
    views: 0,
    clicks: 0,
    inquiries: 0,
    scheduled: 0,
  });

  useEffect(() => {
    // ✅ Agar auth tekshirilayotgan bo'lsa, hech narsa qilmaymiz
    if (authLoading) return;

    // ✅ Agar foydalanuvchi tizimga kirmagan bo'lsa, login ga yuboramiz
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    async function load() {
      try {
        setLoading(true);
        
        // 1. Uylar
        const { data } = await api.get('/properties?limit=20');
        const items: Property[] = data.items || data;
        setProperties(items);
        if (items.length > 0) setSelectedId(items[0].id);

        // 2. Funnel ma'lumotlari
        const { data: s } = await api.get('/stats/dashboard?period=7d');
        if (s && s.counts) {
          setFunnelData({
            views: s.counts.views || 0,
            clicks: Math.round((s.counts.views || 0) * 0.25),
            inquiries: s.counts.applications.total || 0,
            scheduled: s.counts.applications.new || 0,
          });
        }
      } catch (err: any) {
        toast.error(t.noData);
        // Agar token eskirgan bo'lsa (401 xato), tizimdan chiqaramiz
        if (err?.response?.status === 401) {
          useAuthStore.getState().logout();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [t, isAuthenticated, authLoading, router]);

  const handleDelete = async (property: Property) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await api.delete(`/properties/admin/${property.id}`);
      const remaining = properties.filter((p) => p.id !== property.id);
      setProperties(remaining);
      setSelectedId(remaining[0]?.id ?? null);
      toast.success(t.propertyDeleted);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  if (loading) {
    return (
      <div className="-m-4 flex h-[calc(100vh-4rem)]">
        <div className="w-72 space-y-3 border-r border-border/40 bg-card p-5 xl:w-80">
          <div className="h-7 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 animate-pulse rounded-full bg-muted" />
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />)}
        </div>
        <div className="flex-1 space-y-3 p-4">
          <div className="h-24 animate-pulse rounded-3xl bg-muted" />
          <div className="h-[calc(100%-7rem)] animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="-m-4 flex h-[calc(100vh-4rem)] overflow-hidden bg-background"
    >
      {/* 1. Chap ustun: Ro'yxat */}
      <PropertyList properties={properties} selectedId={selectedId} onSelect={setSelectedId} />

      {/* 2. Markaz: Rasm va Amallar */}
      <div className="flex flex-1 overflow-hidden relative">
        <PropertyViewer
          properties={properties}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={(p) => router.push(`/properties/${p.id}`)}
          onDelete={handleDelete}
        />
      </div>

      {/* 3. O'ng ustun: Tahlil (Faqat katta ekranlarda) */}
      <aside className="hidden w-96 flex-shrink-0 overflow-y-auto border-l border-border/40 bg-card p-5 xl:block">
        <ConversionFunnel data={funnelData} />
      </aside>
    </motion.div>
  );
}