'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Crown,
  FileText,
  Users,
  Mail,
  Shield,
  CheckCircle2,
  Ban,
  Clock,
  Calendar,
  Hash,
  Lock,
  Edit,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Admin } from '@/types';
import { useTranslation } from '@/lib/translations';
import { formatDateTime, formatRelativeTime } from '@/lib/format';

interface AdminDetailSheetProps {
  admin: Admin | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

// ============================================================
// ROL KONFIGURATSIYASI
// ============================================================
export function getRoleConfig(t: any): Record<
  string,
  {
    icon: any;
    label: string;
    color: string;
    bg: string;
    description: string;
  }
> {
  return {
    super_admin: {
      icon: Crown,
      label: t.superAdmin,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      description: t.roleSuperAdminDesc,
    },
    content_manager: {
      icon: FileText,
      label: t.contentManager,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      description: t.roleContentManagerDesc,
    },
    manager: {
      icon: Users,
      label: t.manager,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      description: t.roleManagerDesc,
    },
  };
}

export function AdminDetailSheet({
  admin,
  open,
  onClose,
  onEdit,
  onDelete,
}: AdminDetailSheetProps) {
  const { t } = useTranslation();

  if (!admin && open) return null;

  const ROLE_CONFIG = getRoleConfig(t);

  return (
    <AnimatePresence>
      {open && admin && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-x-0 bottom-0 top-10 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-10 bottom-0 z-[201] w-full max-w-lg bg-card shadow-2xl flex flex-col h-screen"
          >
            {/* ============================================================
                SARLAVHA
                ============================================================ */}
            <div className="flex-shrink-0 flex items-start justify-between p-5 border-b border-border/40">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    {admin.name}
                  </h2>
                  {admin.active !== false ? (
                    <Badge
                      variant="outline"
                      className="text-xs border-0 bg-emerald-500/10 text-emerald-500 gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {t.adminActive}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs border-0 bg-rose-500/10 text-rose-500 gap-1"
                    >
                      <Ban className="h-3 w-3" />
                      {t.adminInactive}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  ID: #{admin.id}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ============================================================
                KONTENT
                ============================================================ */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-5 space-y-5">
                {/* ============================================================
                    AVATAR + ROL
                    ============================================================ */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                    <AvatarFallback
                      className={cn(
                        'text-2xl font-bold',
                        ROLE_CONFIG[admin.role]?.bg || 'bg-primary/10',
                        ROLE_CONFIG[admin.role]?.color || 'text-primary'
                      )}
                    >
                      {admin.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    {(() => {
                      const config =
                        ROLE_CONFIG[admin.role] || ROLE_CONFIG.manager;
                      const RoleIcon = config.icon;
                      return (
                        <>
                          <div
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-2',
                              config.bg
                            )}
                          >
                            <RoleIcon
                              className={cn('h-4 w-4', config.color)}
                            />
                            <span
                              className={cn(
                                'text-sm font-semibold',
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {config.description}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* ============================================================
                    EMAIL
                    ============================================================ */}
                <a
                  href={`mailto:${admin.email}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {t.email}
                    </p>
                    <p className="font-medium text-foreground truncate">
                      {admin.email}
                    </p>
                  </div>
                </a>

                {/* ============================================================
                    RUXSATLAR
                    ============================================================ */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
                    {t.permissions}
                  </p>

                  {admin.permissions?.includes('*') ? (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        <p className="font-medium text-amber-500">
                          {t.allPermissions}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-7">
                        {t.allPermissionsDesc}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {admin.permissions?.length > 0 ? (
                        admin.permissions.map((perm, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-0 bg-muted gap-1"
                          >
                            <Shield className="h-3 w-3" />
                            {perm}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t.noData}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* ============================================================
                    METAMA'LUMOT
                    ============================================================ */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
                    {t.adminInfo}
                  </p>

                  <div className="space-y-3">
                    <InfoRow
                      icon={Hash}
                      label="ID"
                      value={`#${admin.id}`}
                    />
                    <InfoRow
                      icon={Shield}
                      label={t.role}
                      value={
                        ROLE_CONFIG[admin.role]?.label || admin.role
                      }
                    />
                    {admin.createdAt && (
                      <InfoRow
                        icon={Calendar}
                        label={t.createdAt}
                        value={formatDateTime(admin.createdAt)}
                      />
                    )}
                    {admin.updatedAt && (
                      <InfoRow
                        icon={Clock}
                        label={t.lastUpdated}
                        value={formatRelativeTime(admin.updatedAt)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================
                FOOTER
                ============================================================ */}
            <div className="flex-shrink-0 p-4 border-t border-border/40 bg-card">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onEdit?.(admin.id);
                  }}
                  className="flex-1 rounded-full"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t.edit}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onDelete?.(admin.id);
                  }}
                  className="flex-1 rounded-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.delete}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
      <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}