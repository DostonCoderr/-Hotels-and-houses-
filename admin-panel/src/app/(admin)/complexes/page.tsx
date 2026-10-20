'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComplexTable } from '@/components/complexes/complex-table';
import {
  fetchComplexes,
  deleteComplex,
  toggleComplex,
  COMPLEX_STATUSES,
} from '@/lib/api-complexes';
import { useTranslation } from '@/lib/translations';
import type { ResidentialComplex } from '@/types';

export default function ComplexesPage() {
  const { t } = useTranslation();
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 20;

  // ============================================================
  // STATUS LABELS — TARJIMA
  // ============================================================
  const statusLabels: Record<string, string> = {
    building: t.statusBuilding,
    completed: t.statusCompleted,
    planned: t.statusPlanned,
  };

  // ============================================================
  // LOAD
  // ============================================================
  const loadComplexes = async () => {
    try {
      setLoading(true);
      const data = await fetchComplexes({
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
        sort: 'newest',
      });
      setComplexes(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Xato:', err);
      toast.error(t.noData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplexes();
  }, [page, statusFilter]);

  // ============================================================
  // SEARCH
  // ============================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadComplexes();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm(t.complexDeleteConfirm)) return;
    try {
      await deleteComplex(id);
      toast.success(t.complexDeleted);
      loadComplexes();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  // ============================================================
  // TOGGLE
  // ============================================================
  const handleToggle = async (id: number) => {
    try {
      await toggleComplex(id);
      toast.success(t.complexUpdated);
      loadComplexes();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {t.complexesTitle}
            </h1>
            <span className="text-sm text-muted-foreground">
              ({total})
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {t.complexesSubtitle}
          </p>
        </div>

        <Link href="/complexes/new">
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            {t.newComplex}
          </Button>
        </Link>
      </div>

      {/* ============================================================
          FILTERS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-card"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchComplex}
            className="pl-9 h-10 rounded-full bg-muted/50 border-0"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === ''
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {t.all}
          </button>
          {COMPLEX_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === status.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {statusLabels[status.value] || status.value}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ============================================================
          TABLE
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
        <ComplexTable
          complexes={complexes}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}

      {/* ============================================================
          PAGINATION
          ============================================================ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t.page} {page} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full"
            >
              {t.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full"
            >
              {t.next}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}