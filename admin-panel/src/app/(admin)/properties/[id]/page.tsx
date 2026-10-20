'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Trash2, Copy } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { PropertyForm } from '@/components/forms/property-form';
import {
  fetchPropertyById,
  updateProperty,
  deleteProperty,
  duplicateProperty,
  fetchComplexesForSelect,
} from '@/lib/api-properties';
import type { Property, ComplexShort } from '@/types';
import type { PropertyFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { t } = useTranslation();

  const [property, setProperty] = useState<Property | null>(null);
  const [complexes, setComplexes] = useState<ComplexShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [prop, comps] = await Promise.all([
          fetchPropertyById(id),
          fetchComplexesForSelect(),
        ]);
        setProperty(prop);
        setComplexes(comps);
      } catch (err) {
        toast.error(t.noData);
        router.push('/properties');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router, t]);

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await updateProperty(id, data as any);
      toast.success(t.propertyUpdated);
      router.push('/properties');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await deleteProperty(id);
      toast.success(t.propertyDeleted);
      router.push('/properties');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  const handleDuplicate = async () => {
    try {
      const copy = await duplicateProperty(id);
      toast.success(t.propertyDuplicated);
      router.push(`/properties/${copy.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-card rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <Link href={`/properties/view/${property.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {property.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              ID: #{property.id} · {property.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDuplicate}
            className="rounded-full"
          >
            <Copy className="mr-2 h-4 w-4" />
            {t.duplicate}
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
      <PropertyForm
        initialData={property}
        complexes={complexes}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  );
}