'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { ComplexForm } from '@/components/forms/complex-form';
import { createComplex } from '@/lib/api-complexes';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';

export default function NewComplexPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (data: any) => {
    try {
      const complex = await createComplex(data);
      toast.success(t.complexCreated);
      router.push(`/complexes/${complex.id}`);
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/complexes">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t.newComplex}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.newComplexSubtitle}
          </p>
        </div>
      </motion.div>

      <ComplexForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}