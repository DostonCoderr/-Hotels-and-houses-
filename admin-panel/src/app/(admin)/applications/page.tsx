'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  CheckSquare,
  Square,
  Trash2,
  FileSpreadsheet,
  Inbox,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApplicationStatsCards } from '@/components/applications/application-stats';
import { ApplicationTable } from '@/components/applications/application-table';
import { ApplicationStatusModal } from '@/components/applications/application-status-modal';
import { ApplicationDetailSheet } from '@/components/applications/application-detail-sheet';
import {
  fetchApplications,
  fetchApplicationStats,
  updateApplicationStatus,
  deleteApplication,
  exportApplicationsCSV,
  APPLICATION_STATUSES,
  DATE_RANGES,
  SORT_OPTIONS,
  type ApplicationStats,
  type ApplicationStatus,
} from '@/lib/api-applications';
import type { Application } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

export default function ApplicationsPage() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filtrlar
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Sahifalash
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Tanlash
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modallar
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const limit = 20;

  // ============================================================
  // FAOL FILTRLAR SONI
  // ============================================================
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter) count++;
    if (dateRange !== 'all') count++;
    if (sort !== 'newest') count++;
    return count;
  }, [statusFilter, dateRange, sort]);

  // ============================================================
  // YUKLASH
  // ============================================================
  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, statsData] = await Promise.all([
        fetchApplications({
          page,
          limit,
          search: search || undefined,
          status: statusFilter || undefined,
          sort,
        }),
        fetchApplicationStats(),
      ]);
      setApplications(appsData.items);
      setTotal(appsData.total);
      setTotalPages(appsData.totalPages);
      setStats(statsData);
    } catch (err) {
      console.error('Xato:', err);
      toast.error(t.applicationsLoadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, statusFilter, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // FILTRLARNI TOZALASH
  // ============================================================
  const resetFilters = () => {
    setStatusFilter('');
    setDateRange('all');
    setSort('newest');
    setSearch('');
    setPage(1);
  };

  // ============================================================
  // KO'RISH
  // ============================================================
  const handleView = (app: Application) => {
    setSelectedApp(app);
    setDetailOpen(true);
  };

  // ============================================================
  // STATUS MODALINI OCHISH
  // ============================================================
  const handleOpenStatusModal = (app: Application) => {
    setSelectedApp(app);
    setStatusModalOpen(true);
  };

  // ============================================================
  // STATUSNI SAQLASH
  // ============================================================
  const handleSubmitStatus = async (
    id: number,
    status: ApplicationStatus
  ) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success(t.statusChanged);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // O'CHIRISH
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm(t.applicationDeleteConfirm)) return;
    try {
      await deleteApplication(id);
      toast.success(t.applicationDeleted);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // OMBAVIY O'CHIRISH
  // ============================================================
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `${selectedIds.length} ${t.applicationsBulkDeleteConfirm}`
      )
    )
      return;

    try {
      await Promise.all(selectedIds.map((id) => deleteApplication(id)));
      toast.success(`${selectedIds.length} ${t.applicationsDeleted}`);
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // TANLASHNI ALMASHTIRISH
  // ============================================================
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  // ============================================================
  // CSV EKSPORT
  // ============================================================
  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportApplicationsCSV({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t.csvDownloaded);
    } catch (err: any) {
      toast.error(t.exportError);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {t.applicationsTitle}
            </h1>
            <Badge
              variant="outline"
              className="border-0 bg-primary/10 text-primary"
            >
              {total}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {t.applicationsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-full"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {exporting ? t.exporting : t.exportCSV}
          </Button>
        </div>
      </motion.div>

      {/* ============================================================
          STATISTIKA
          ============================================================ */}
      <ApplicationStatsCards stats={stats} />

      {/* ============================================================
          FILTRLAR
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {/* Asosiy filtr paneli */}
        <div className="flex flex-col lg:flex-row gap-3 p-3 rounded-2xl bg-card">
          {/* Qidirish */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchApplication}
              className="pl-9 pr-9 h-10 rounded-full bg-muted/50 border-0"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Kengaytirilgan filtrlar tugmasi */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.filters}
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 px-1.5 rounded-full text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform',
                showFilters && 'rotate-180'
              )}
            />
          </Button>

          {/* Tozalash */}
          {(activeFiltersCount > 0 || search) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="rounded-full"
            >
              <X className="mr-2 h-4 w-4" />
              {t.clear}
            </Button>
          )}
        </div>

        {/* Kengaytirilgan filtrlar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-card space-y-4">
                {/* Status */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                    {t.status}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setStatusFilter('')}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                        statusFilter === ''
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t.all}
                    </button>
                    {APPLICATION_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setStatusFilter(status.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5',
                          statusFilter === status.value
                            ? `${status.bg} ${status.color} ring-2 ring-inset ring-current`
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <span>{status.icon}</span>
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sana */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                    {t.date}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {DATE_RANGES.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setDateRange(range.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5',
                          dateRange === range.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <Calendar className="h-3 w-3" />
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saralash */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                    {t.sorting}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5',
                          sort === option.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ommaviy amallar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-primary/10 border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {selectedIds.length} {t.selected}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="rounded-full"
                >
                  {t.cancel}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="rounded-full"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {t.delete}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ============================================================
          JADVAL O'RAMI — Barchasini tanlash
          ============================================================ */}
      {!loading && applications.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {selectedIds.length === applications.length ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span>
              {selectedIds.length === applications.length
                ? t.deselectAll
                : t.selectAll}
            </span>
          </button>
        </div>
      )}

      {/* ============================================================
          JADVAL
          ============================================================ */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-card animate-pulse"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
            <Inbox className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {t.applicationsNotFound}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search || statusFilter
              ? t.noResultsByFilter
              : t.noApplicationsYet}
          </p>
          {(search || statusFilter) && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="rounded-full"
            >
              <X className="mr-2 h-4 w-4" />
              {t.clearFilters}
            </Button>
          )}
        </motion.div>
      ) : (
        <ApplicationTable
          applications={applications}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onView={handleView}
          onChangeStatus={handleOpenStatusModal}
          onDelete={handleDelete}
        />
      )}

      {/* ============================================================
          SAHIFALASH
          ============================================================ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t.page}{' '}
            <span className="font-medium text-foreground">{page}</span> /{' '}
            {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="rounded-full"
            >
              {t.first}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full"
            >
              {t.previous}
            </Button>

            {/* Sahifa raqamlari */}
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-full text-sm font-medium transition-colors',
                      page === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full"
            >
              {t.next}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="rounded-full"
            >
              {t.last}
            </Button>
          </div>
        </div>
      )}

      {/* ============================================================
          MODALLAR
          ============================================================ */}
      <ApplicationStatusModal
        application={selectedApp}
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSubmit={handleSubmitStatus}
      />

      <ApplicationDetailSheet
        application={selectedApp}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onChangeStatus={() => {
          setDetailOpen(false);
          setStatusModalOpen(true);
        }}
        onDelete={(id) => {
          setDetailOpen(false);
          handleDelete(id);
        }}
      />
    </div>
  );
}