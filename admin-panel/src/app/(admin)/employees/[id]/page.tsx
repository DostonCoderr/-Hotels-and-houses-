'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { EmployeeForm } from '@/components/forms/employee-form';
import {
  fetchEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployee,
} from '@/lib/api-employees';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';
import { useTranslation } from '@/lib/translations';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { t } = useTranslation();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        toast.error(t.employeeNotFound);
        router.push('/employees');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router, t]);

  // ============================================================
  // SAQLASH
  // ============================================================
  const handleSubmit = async (data: any) => {
    try {
      await updateEmployee(id, data);
      toast.success(t.employeeUpdated);
      router.push('/employees');
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // O'CHIRISH
  // ============================================================
  const handleDelete = async () => {
    if (!confirm(t.employeeDeleteConfirm)) return;
    try {
      await deleteEmployee(id);
      toast.success(t.employeeDeleted);
      router.push('/employees');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // ALMASHTIRISH
  // ============================================================
  const handleToggle = async () => {
    try {
      const updated = await toggleEmployee(id);
      setEmployee(updated);
      toast.success(
        updated.hidden ? t.employeeHidden : t.employeeShown
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // YUKLANMOQDA
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

  if (!employee) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t.employeeNotFound}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {employee.name}
              </h1>
              {employee.hidden ? (
                <Badge
                  variant="outline"
                  className="border-0 bg-rose-500/10 text-rose-500"
                >
                  {t.hidden}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-0 bg-emerald-500/10 text-emerald-500"
                >
                  {t.active}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {employee.position} · ID: #{employee.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleToggle}
            className="rounded-full"
          >
            {employee.hidden ? (
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
          FORMA
          ============================================================ */}
      <EmployeeForm
        initialData={employee}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  );
}