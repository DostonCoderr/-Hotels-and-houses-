'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  X,
  UserCog,
  Shield,
  ShieldCheck,
  Users,
  Ban,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Crown,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminTable } from '@/components/admins/admin-table';
import { AdminDetailSheet } from '@/components/admins/admin-detail-sheet';
import { AdminForm } from '@/components/forms/admin-form';
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  fetchRoles,
} from '@/lib/api-admins';
import { useTranslation } from '@/lib/translations';
import type { Admin, Role } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminsPage() {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const roleLabels: Record<string, string> = {
    super_admin: t.superAdmin,
    content_manager: t.contentManager,
    manager: t.manager,
  };

  // ============================================================
  // LOAD
  // ============================================================
  const loadData = async () => {
    try {
      setLoading(true);
      const [adminsData, rolesData] = await Promise.all([
        fetchAdmins({
          search: search || undefined,
          roleId: roleFilter,
        }),
        fetchRoles(),
      ]);
      setAdmins(adminsData.items);
      setRoles(rolesData);
    } catch (err) {
      console.error('Xato:', err);
      toast.error('Xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // STATS
  // ============================================================
  const stats = {
    total: admins.length,
    active: admins.filter((a) => a.active !== false).length,
    inactive: admins.filter((a) => a.active === false).length,
    superAdmins: admins.filter((a) => a.role === 'super_admin').length,
  };

  // ============================================================
  // RESET FILTERS
  // ============================================================
  const resetFilters = () => {
    setRoleFilter(undefined);
    setSearch('');
  };

  const activeFiltersCount = roleFilter !== undefined ? 1 : 0;

  // ============================================================
  // OPEN CREATE
  // ============================================================
  const handleCreate = () => {
    setEditingAdmin(null);
    setFormOpen(true);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================
  const handleEdit = (id: number) => {
    const admin = admins.find((a) => a.id === id);
    if (admin) {
      setEditingAdmin(admin);
      setFormOpen(true);
    }
  };

  // ============================================================
  // OPEN VIEW
  // ============================================================
  const handleView = (admin: Admin) => {
    setViewAdmin(admin);
    setDetailOpen(true);
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (data: any) => {
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, data);
        toast.success(t.adminUpdated);
      } else {
        await createAdmin(data as any);
        toast.success(t.adminCreated);
      }
      setFormOpen(false);
      setEditingAdmin(null);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
      throw err;
    }
  };

  // ============================================================
  // DELETE
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm(t.adminDeleteConfirm)) return;
    try {
      await deleteAdmin(id);
      toast.success(t.adminDeleted);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  // ============================================================
  // STATS CARDS
  // ============================================================
  const statsCards = [
    {
      label: t.totalAdmins,
      value: stats.total,
      icon: Users,
      color: 'primary',
    },
    {
      label: t.adminActive,
      value: stats.active,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      label: t.adminInactive,
      value: stats.inactive,
      icon: Ban,
      color: 'rose',
    },
    {
      label: t.superAdmin,
      value: stats.superAdmins,
      icon: Crown,
      color: 'amber',
    },
  ];

  const COLORS = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t.adminsTitle}
            </h1>
            <p className="text-muted-foreground mt-0.5">
              {t.adminsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="rounded-full"
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', loading && 'animate-spin')}
            />
            Yangilash
          </Button>
          <Button onClick={handleCreate} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            {t.newAdmin}
          </Button>
        </div>
      </motion.div>

      {/* ============================================================
          STATS
          ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const color = COLORS[card.color as keyof typeof COLORS];

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-0 bg-card rounded-2xl">
                <CardContent className="p-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                      color.bg
                    )}
                  >
                    <Icon className={cn('h-5 w-5', color.text)} />
                  </div>
                  <p className="text-2xl font-bold text-foreground tabular-nums mb-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ============================================================
          FILTERS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex flex-col lg:flex-row gap-3 p-3 rounded-2xl bg-card">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchAdmin}
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

          {/* Filters toggle */}
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

          {/* Reset */}
          {(activeFiltersCount > 0 || search) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="rounded-full"
            >
              <X className="mr-2 h-4 w-4" />
              {t.resetFilters}
            </Button>
          )}
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                  {t.role}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setRoleFilter(undefined)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                      roleFilter === undefined
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {t.all}
                  </button>
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setRoleFilter(role.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                        roleFilter === role.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {roleLabels[role.name] || role.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ============================================================
          TABLE
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
      ) : (
        <AdminTable
          admins={admins}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* ============================================================
          FORM MODAL (Side Panel)
          ============================================================ */}
      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setFormOpen(false);
                setEditingAdmin(null);
              }}
              className="fixed inset-x-0 bottom-0 top-10 z-[200] bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-10 bottom-0 z-[201] w-full max-w-lg bg-card shadow-2xl flex flex-col h-screen"
            >
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {editingAdmin ? t.editAdmin : t.newAdmin}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {editingAdmin ? editingAdmin.email : t.adminInfo}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFormOpen(false);
                    setEditingAdmin(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                <AdminForm
                  initialData={editingAdmin}
                  roles={roles}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setFormOpen(false);
                    setEditingAdmin(null);
                  }}
                  mode={editingAdmin ? 'edit' : 'create'}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============================================================
          DETAIL SHEET
          ============================================================ */}
      <AdminDetailSheet
        admin={viewAdmin}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setViewAdmin(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}