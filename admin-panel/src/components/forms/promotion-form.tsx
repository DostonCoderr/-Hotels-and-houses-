'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  Gift,
  Percent,
  Calendar,
  FileText,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Promotion } from '@/types';
import { PROMOTION_STATUSES } from '@/lib/api-promotions';
import { promotionSchema, type PromotionFormData } from '@/lib/validations';
import { UPLOADS_URL } from '@/lib/constants';
import { useTranslation } from '@/lib/translations';

interface PromotionFormProps {
  initialData?: Promotion | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function PromotionForm({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create',
}: PromotionFormProps) {
  const router = useRouter();
  const { t } = useTranslation(); // ✅ Komponent ichida
  const [image, setImage] = useState<string | null>(
    initialData?.image || null
  );

  // ============================================================
  // STATUS LABELS — TARJIMA
  // ============================================================
  const statusLabels: Record<string, string> = {
    active: t.promotionActive,
    inactive: t.promotionInactive,
    hidden: t.promotionHidden,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      discount: initialData?.discount ?? null,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().slice(0, 10)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
      status: (initialData?.status as any) || 'active',
      image: initialData?.image || null,
    },
  });

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleFormSubmit = async (data: any) => {
    const payload: any = {
      name: data.name,
      description: data.description,
      discount:
        data.discount !== null && data.discount !== undefined && data.discount !== 0
          ? Number(data.discount)
          : null,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      status: data.status,
      image: image || null,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ============================================================
          ASOSIY MA'LUMOT
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              {t.promotionName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nomi */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.promotionName} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t.promotionName}
                {...register('name')}
                className="h-11 bg-muted/30 border-0"
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Tavsif */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {t.promotionDescription}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t.promotionDescription}
                rows={4}
                {...register('description')}
                className="bg-muted/30 border-0 resize-none"
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Chegirma */}
            <div className="space-y-2">
              <Label htmlFor="discount">{t.promotionDiscount} (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="10"
                  {...register('discount', { valueAsNumber: true })}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
              {errors.discount && (
                <p className="text-xs text-destructive">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          SANA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {t.promotionStartDate} — {t.promotionEndDate}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  {t.promotionStartDate}{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className="h-11 bg-muted/30 border-0"
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  {t.promotionEndDate}{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className="h-11 bg-muted/30 border-0"
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          STATUS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {t.promotionStatus}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 flex-wrap">
                  {PROMOTION_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => field.onChange(status.value)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all',
                        field.value === status.value
                          ? `${status.bg} ${status.color} ring-2 ring-inset ring-current`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {statusLabels[status.value] || status.value}
                    </button>
                  ))}
                </div>
              )}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          RASM (URL orqali)
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              {t.promotionDescription} (URL)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Preview */}
            {image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted">
                <img
                  src={
                    image.startsWith('http')
                      ? image
                      : `${UPLOADS_URL}${image}`
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}

            {/* URL input */}
            <div className="flex gap-2">
              <Input
                value={image || ''}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-11 bg-muted/30 border-0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              https://example.com/image.jpg
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          ACTIONS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-2xl border-0"
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => (onCancel ? onCancel() : router.back())}
          disabled={isSubmitting}
          className="rounded-full"
        >
          {t.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.saving}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === 'create' ? t.create : t.save}
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}