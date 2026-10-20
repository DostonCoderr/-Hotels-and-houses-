'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Upload,
  Loader2,
  Crown,
  FileText,
  Users,
  CheckCircle2,
  Ban,
  Mail,
  Calendar,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/format';
import { UPLOADS_URL } from '@/lib/constants';
import { uploadAvatar, deleteAvatar } from '@/lib/api-profile';

// ⚠️ YANGI: URL tozalash funksiyasi (alohida faylga chiqarish mumkin)
export function getFullImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:')) return path;

  // `/api` ni olib tashlash (agar UPLOADS_URL da bo'lsa)
  const baseUrl = UPLOADS_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

const ROLE_CONFIG: Record<
  string,
  { icon: any; color: string; bg: string }
> = {
  super_admin: {
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  content_manager: {
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  manager: {
    icon: Users,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
};

export function ProfileHeader() {
  const { t } = useTranslation();
  const admin = useAuthStore((s) => s.admin);
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const loadAdmin = useAuthStore((s) => s.loadAdmin);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [avatar, setAvatar] = useState<string | null>(
    (admin as any)?.avatar || null
  );

  useEffect(() => {
    setAvatar((admin as any)?.avatar || null);
    setImageError(false);
  }, [admin]);

  const roleLabels: Record<string, string> = {
    super_admin: t.superAdmin,
    content_manager: t.contentManager,
    manager: t.manager,
  };

  const roleConfig = ROLE_CONFIG[admin?.role || 'manager'] || ROLE_CONFIG.manager;
  const RoleIcon = roleConfig.icon;

  const initials = (admin?.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl = getFullImageUrl(avatar);

  // ============================================================
  // AVATAR YUKLASH
  // ============================================================
  const handleUploadAvatar = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.fileTooLarge);
      return;
    }

    try {
      setUploading(true);
      const result = await uploadAvatar(file);

      setAvatar(result.avatar);
      setImageError(false);

      if (setAdmin && admin) {
        setAdmin({ ...admin, avatar: result.avatar } as any);
      }

      await loadAdmin();
      toast.success(t.avatarUploaded);
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast.error(err?.response?.data?.error || t.errorOccurred);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ============================================================
  // AVATAR O'CHIRISH
  // ============================================================
  const handleDeleteAvatar = async () => {
    if (!confirm(t.avatarDeleteConfirm)) return;
    try {
      setDeleting(true);
      await deleteAvatar();
      setAvatar(null);
      setImageError(false);
      if (setAdmin && admin) {
        setAdmin({ ...admin, avatar: null } as any);
      }
      toast.success(t.avatarDeleted);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 bg-card rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.3),transparent_50%)]" />
        </div>

        <CardContent className="p-6 -mt-16 relative">
          <div className="flex items-end gap-6 flex-wrap">
            {/* AVATAR */}
            <div className="relative">
              <Avatar className="h-28 w-28 ring-4 ring-card shadow-2xl">
                {avatarUrl && !imageError ? (
                  <AvatarImage
                    src={avatarUrl}
                    alt={admin?.name || 'Admin'}
                    onError={() => setImageError(true)}
                  />
                ) : null}
                <AvatarFallback
                  className={cn(
                    'text-3xl font-bold',
                    roleConfig.bg,
                    roleConfig.color
                  )}
                >
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-primary-foreground" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadAvatar(file);
                }}
              />
            </div>

            {/* MA'LUMOT */}
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {admin?.name || 'Admin'}
                </h2>
                {(admin as any)?.active !== false ? (
                  <Badge
                    variant="outline"
                    className="border-0 bg-emerald-500/10 text-emerald-500 gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {t.adminActive}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-0 bg-rose-500/10 text-rose-500 gap-1"
                  >
                    <Ban className="h-3 w-3" />
                    {t.adminInactive}
                  </Badge>
                )}
              </div>

              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-3',
                  roleConfig.bg
                )}
              >
                <RoleIcon className={cn('h-4 w-4', roleConfig.color)} />
                <span className={cn('text-sm font-semibold', roleConfig.color)}>
                  {roleLabels[admin?.role || 'manager'] || admin?.role}
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{admin?.email}</span>
                </div>
                {(admin as any)?.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDateTime((admin as any).createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AMALLAR */}
            <div className="flex items-center gap-2 pb-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.uploading}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {t.uploadPhoto}
                  </>
                )}
              </Button>

              {avatarUrl && (
                <Button
                  variant="ghost"
                  onClick={handleDeleteAvatar}
                  disabled={deleting}
                  className="rounded-full text-destructive hover:text-destructive"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}