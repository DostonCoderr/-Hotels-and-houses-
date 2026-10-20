'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmployeeTable } from '@/components/employees/employee-table';
import {
  fetchAdminEmployees,
  deleteEmployee,
  toggleEmployee,
} from '@/lib/api-employees';
import type { Employee } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hiddenFilter, setHiddenFilter] = useState<boolean | undefined>(
    undefined
  );

  // ============================================================
  // YUKLASH
  // ============================================================
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminEmployees({
        search: search || undefined,
        hidden: hiddenFilter,
      });
      const items = Array.isArray(data) ? data : data.items;
      setEmployees(items);
    } catch (err) {
      console.error('Xato:', err);
      toast.error(t.employeesLoadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [hiddenFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // O'CHIRISH
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm(t.employeeDeleteConfirm)) return;
    try {
      await deleteEmployee(id);
      toast.success(t.employeeDeleted);
      loadEmployees();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // ALMASHTIRISH
  // ============================================================
  const handleToggle = async (id: number) => {
    try {
      await toggleEmployee(id);
      toast.success(t.statusChanged);
      loadEmployees();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {t.employeesTitle}
            </h1>
            <span className="text-sm text-muted-foreground">
              ({employees.length})
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {t.employeesSubtitle}
          </p>
        </div>

        <Link href="/employees/new">
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            {t.newEmployee}
          </Button>
        </Link>
      </div>

      {/* ============================================================
          FILTRLAR
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-card"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchEmployee}
            className="pl-9 h-10 rounded-full bg-muted/50 border-0"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setHiddenFilter(undefined)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              hiddenFilter === undefined
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.all}
          </button>
          <button
            onClick={() => setHiddenFilter(false)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              hiddenFilter === false
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.active}
          </button>
          <button
            onClick={() => setHiddenFilter(true)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              hiddenFilter === true
                ? 'bg-rose-500/10 text-rose-500'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.hidden}
          </button>
        </div>
      </motion.div>

      {/* ============================================================
          JADVAL
          ============================================================ */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-card animate-pulse"
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}