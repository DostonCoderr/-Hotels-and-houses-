'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { UserDetailTabs } from '@/components/users/user-detail-tabs';
import {
  fetchUserById,
  blockUser,
  unblockUser,
  deleteUser,
} from '@/lib/api-users';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { formatDateTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { t } = useTranslation();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // YUKLASH
  // ============================================================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        toast.error(t.noData);
        router.push('/users');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router, t]);

  // ============================================================
  // BLOKLASH / BLOKDAN CHIQARISH
  // ============================================================
  const handleBlock = async () => {
    if (!user) return;
    try {
      const updated = user.blocked
        ? await unblockUser(user.id)
        : await blockUser(user.id);
      setUser(updated);
      toast.success(
        updated.blocked ? t.userBlocked : t.userUnblocked
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // O'CHIRISH
  // ============================================================
  const handleDelete = async () => {
    if (!user) return;
    if (!confirm(t.userDeleteConfirm)) return;
    try {
      await deleteUser(user.id);
      toast.success(t.userDeleted);
      router.push('/users');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  // ============================================================
  // YUKLANMOQDA
  // ============================================================
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-40 bg-card rounded-2xl animate-pulse" />
        <div className="h-96 bg-card rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t.noData}</p>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              ID: #{user.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleBlock}
            className={cn(
              'rounded-full',
              user.blocked
                ? 'text-emerald-500 hover:text-emerald-500'
                : 'text-amber-500 hover:text-amber-500'
            )}
          >
            {user.blocked ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                {t.unblock}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {t.block}
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
          FOYDALANUVCHI KARTASI
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-card rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-6 flex-wrap">
              <Avatar className="h-20 w-20">
                <AvatarFallback
                  className={cn(
                    'text-2xl font-bold',
                    user.blocked
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.name}
                  </h2>
                  {user.blocked ? (
                    <Badge
                      variant="outline"
                      className="border-0 bg-rose-500/10 text-rose-500"
                    >
                      <Ban className="mr-1 h-3 w-3" />
                      {t.blocked}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-0 bg-emerald-500/10 text-emerald-500"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t.active}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoRow
                    icon={Mail}
                    label={t.email}
                    value={user.email}
                  />
                  <InfoRow
                    icon={Phone}
                    label={t.phone}
                    value={user.phone || '—'}
                  />
                  <InfoRow
                    icon={Calendar}
                    label={t.registeredAt}
                    value={formatDateTime(user.createdAt)}
                  />
                  <InfoRow
                    icon={Shield}
                    label={t.userId}
                    value={`#${user.id}`}
                  />
                </div>

                {/* Statistika */}
                <div className="flex items-center gap-6 pt-3 border-t border-border/40">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.favorites}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {user._count?.favorites || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.views}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {user._count?.views || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.applications}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {user._count?.applications || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          TABLAR
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UserDetailTabs userId={user.id} />
      </motion.div>
    </div>
  );
}

// ============================================================
// MA'LUMOT QATORI
// ============================================================
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}