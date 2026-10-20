'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/users/user-table';
import { UserStatsCards } from '@/components/users/user-stats';
import {
  fetchUsers,
  fetchUserStats,
  blockUser,
  unblockUser,
  deleteUser,
  type UserStats,
} from '@/lib/api-users';
import { useTranslation } from '@/lib/translations';
import type { User } from '@/types';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [blockedFilter, setBlockedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 20;

  // ============================================================
  // YUKLASH
  // ============================================================
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        fetchUsers({
          page,
          limit,
          search: search || undefined,
          blocked: blockedFilter,
          sort: 'newest',
        }),
        fetchUserStats(),
      ]);
      setUsers(usersData.items);
      setTotal(usersData.total);
      setTotalPages(usersData.totalPages);
      setStats(statsData);
    } catch (err) {
      console.error('Xato:', err);
      toast.error(t.noData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, blockedFilter]);

  // ============================================================
  // QIDIRISH
  // ============================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // BLOKLASH
  // ============================================================
  const handleBlock = async (id: number) => {
    try {
      await blockUser(id);
      toast.success(t.userBlocked);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // BLOKDAN CHIQARISH
  // ============================================================
  const handleUnblock = async (id: number) => {
    try {
      await unblockUser(id);
      toast.success(t.userUnblocked);
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // O'CHIRISH
  // ============================================================
  const handleDelete = async (id: number) => {
    if (!confirm(t.userDeleteConfirm)) return;
    try {
      await deleteUser(id);
      toast.success(t.userDeleted);
      loadData();
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
          <h1 className="text-3xl font-bold text-foreground">
            {t.usersTitle}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.totalUsers} {total}
          </p>
        </div>
      </div>

      {/* ============================================================
          STATISTIKA
          ============================================================ */}
      <UserStatsCards stats={stats} />

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
            placeholder={t.searchUser}
            className="pl-9 h-10 rounded-full bg-muted/50 border-0"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setBlockedFilter(undefined)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              blockedFilter === undefined
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {t.all}
          </button>
          <button
            onClick={() => setBlockedFilter(false)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1',
              blockedFilter === false
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            {t.active}
          </button>
          <button
            onClick={() => setBlockedFilter(true)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1',
              blockedFilter === true
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            <Ban className="h-3 w-3" />
            {t.blocked}
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
        <UserTable
          users={users}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onDelete={handleDelete}
        />
      )}

      {/* ============================================================
          SAHIFALASH
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