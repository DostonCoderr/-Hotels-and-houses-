'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { ComplexForm } from '@/components/forms/complex-form';
import {
  fetchComplexById,
  updateComplex,
  deleteComplex,
  toggleComplex,
} from '@/lib/api-complexes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ResidentialComplex } from '@/types';
import { useTranslation } from '@/lib/translations';

export default function EditComplexPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { t } = useTranslation();

  const [complex, setComplex] = useState<ResidentialComplex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchComplexById(id);
        setComplex(data);
      } catch (err) {
        toast.error(t.noData);
        router.push('/complexes');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router, t]);

  const handleSubmit = async (data: any) => {
    try {
      await updateComplex(id, data);
      toast.success(t.complexUpdated);
      router.push('/complexes');
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.complexDeleteConfirm)) return;
    try {
      await deleteComplex(id);
      toast.success(t.complexDeleted);
      router.push('/complexes');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  const handleToggle = async () => {
    try {
      const updated = await toggleComplex(id);
      setComplex(updated);
      toast.success(
        updated.published ? t.showOnSite : t.hideFromSite
      );
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

  if (!complex) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <Link href="/complexes">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {complex.name}
              </h1>
              <Badge
                variant="outline"
                className={
                  complex.published
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-muted text-muted-foreground border-0'
                }
              >
                {complex.published ? t.published : t.hidden}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              ID: #{complex.id} · {complex.district}, {complex.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleToggle}
            className="rounded-full"
          >
            {complex.published ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                {t.hide}
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                {t.show}
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

      <ComplexForm
        initialData={complex}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  );
}