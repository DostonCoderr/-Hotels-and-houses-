'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { PromotionForm } from '@/components/forms/promotion-form';
import {
  fetchPromotionById,
  updatePromotion,
  deletePromotion,
  togglePromotion,
  PROMOTION_STATUS_MAP,
} from '@/lib/api-promotions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Promotion } from '@/types';
import { useTranslation } from '@/lib/translations';

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { t } = useTranslation();

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // STATUS LABELS — TARJIMA
  // ============================================================
  const statusLabels: Record<string, string> = {
    active: t.promotionActive,
    inactive: t.promotionInactive,
    hidden: t.promotionHidden,
  };

  // ============================================================
  // LOAD
  // ============================================================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchPromotionById(id);
        setPromotion(data);
      } catch (err) {
        toast.error(t.noData);
        router.push('/promotions');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router, t]);

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (data: any) => {
    try {
      await updatePromotion(id, data);
      toast.success(t.promotionUpdated);
      router.push('/promotions');
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async () => {
    if (!confirm(t.promotionDeleteConfirm)) return;
    try {
      await deletePromotion(id);
      toast.success(t.promotionDeleted);
      router.push('/promotions');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  // ============================================================
  // TOGGLE
  // ============================================================
  const handleToggle = async () => {
    try {
      const updated = await togglePromotion(id);
      setPromotion(updated);
      toast.success(
        updated.status === 'hidden'
          ? t.promotionHidden
          : t.promotionActive
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-card rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t.noData}</p>
      </div>
    );
  }

  const status = PROMOTION_STATUS_MAP[promotion.status];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <Link href="/promotions">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {promotion.name}
              </h1>
              {status && (
                <Badge
                  variant="outline"
                  className={cn('border-0', status.bg, status.color)}
                >
                  {statusLabels[promotion.status] || status.value}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              ID: #{promotion.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleToggle}
            className="rounded-full"
          >
            {promotion.status === 'hidden' ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                {t.show}
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                {t.hide}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="rounded-full text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t.delete}
          </Button>
        </div>
      </motion.div>

      {/* ============================================================
          FORM
          ============================================================ */}
      <PromotionForm
        initialData={promotion}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  );
}