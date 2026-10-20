'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { PromotionForm } from '@/components/forms/promotion-form';
import { createPromotion } from '@/lib/api-promotions';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';

export default function NewPromotionPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (data: any) => {
    try {
      const promotion = await createPromotion(data);
      toast.success(t.promotionCreated);
      router.push(`/promotions/${promotion.id}`);
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/promotions">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t.newPromotion}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.promotionsSubtitle}
          </p>
        </div>
      </motion.div>

      {/* ============================================================
          FORM
          ============================================================ */}
      <PromotionForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}