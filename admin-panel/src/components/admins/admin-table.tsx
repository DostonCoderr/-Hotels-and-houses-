'use client';

import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  CheckCircle2,
  Ban,
  Mail,
  UserCog,
  Crown,
  FileText,
  Users,
  Eye,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Admin } from '@/types';
import { useTranslation } from '@/lib/translations';
import { formatRelativeTime } from '@/lib/format';

interface AdminTableProps {
  admins: Admin[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (admin: Admin) => void;
}

// ============================================================
// ROL KONFIGURATSIYASI
// ============================================================
const ROLE_CONFIG: Record<
  string,
  {
    icon: any;
    color: string;
    bg: string;
    gradient: string;
  }
> = {
  super_admin: {
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  content_manager: {
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  manager: {
    icon: Users,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
};

export function AdminTable({
  admins,
  onEdit,
  onDelete,
  onView,
}: AdminTableProps) {
  const { t } = useTranslation();

  const roleLabels: Record<string, string> = {
    super_admin: t.superAdmin,
    content_manager: t.contentManager,
    manager: t.manager,
  };

  return (
    <div className="rounded-2xl bg-card border-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent">
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>{t.admin}</TableHead>
            <TableHead>{t.email}</TableHead>
            <TableHead>{t.role}</TableHead>
            <TableHead>{t.permissions}</TableHead>
            <TableHead>{t.activeStatus}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <UserCog className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{t.noData}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin, index) => {
              const initials = admin.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              const isActive = admin.active !== false;
              const roleConfig = ROLE_CONFIG[admin.role] || ROLE_CONFIG.manager;
              const RoleIcon = roleConfig.icon;

              return (
                <motion.tr
                  key={admin.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onView?.(admin)}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  {/* Avatar */}
                  <TableCell>
                    <div className="relative">
                      <Avatar
                        className={cn(
                          'h-10 w-10 ring-2',
                          isActive ? 'ring-emerald-500/30' : 'ring-muted'
                        )}
                      >
                        <AvatarFallback
                          className={cn(
                            'text-sm font-bold',
                            roleConfig.bg,
                            roleConfig.color
                          )}
                        >
                          {initials || '?'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Onlayn indikator */}
                      {isActive && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                      )}
                    </div>
                  </TableCell>

                  {/* Admin */}
                  <TableCell>
                    <p className="font-medium text-foreground line-clamp-1">
                      {admin.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: #{admin.id}
                    </p>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">
                        {admin.email}
                      </span>
                    </div>
                  </TableCell>

                  {/* Rol */}
                  <TableCell>
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
                        roleConfig.bg
                      )}
                    >
                      <RoleIcon
                        className={cn('h-3.5 w-3.5', roleConfig.color)}
                      />
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          roleConfig.color
                        )}
                      >
                        {roleLabels[admin.role] || admin.role}
                      </span>
                    </div>
                  </TableCell>

                  {/* Ruxsatlar */}
                  <TableCell>
                    {admin.permissions?.includes('*') ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-emerald-500/10 text-emerald-500 gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {t.allPermissions}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-muted"
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {admin.permissions?.length || 0} {t.permissionsCount}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {isActive ? (
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
                  </TableCell>

                  {/* Amallar */}
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                          onClick={() => onView?.(admin)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t.view}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit?.(admin.id)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t.edit}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(admin.id)}
                          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}