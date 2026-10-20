'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { PropertyForm } from '@/components/forms/property-form';
import { createProperty, fetchComplexesForSelect } from '@/lib/api-properties';
import type { ComplexShort } from '@/types';
import type { PropertyFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';

export default function NewPropertyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [complexes, setComplexes] = useState<ComplexShort[]>([]);

  useEffect(() => {
    fetchComplexesForSelect().then(setComplexes);
  }, []);

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      const property = await createProperty(data as any);
      toast.success(t.propertyCreated);
      router.push(`/properties/${property.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/properties">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t.newProperty}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.newPropertySubtitle}
          </p>
        </div>
      </motion.div>

      {/* ============================================================
          FORM
          ============================================================ */}
      <PropertyForm
        complexes={complexes}
        onSubmit={handleSubmit}
        mode="create"
      />
    </div>
  );
}