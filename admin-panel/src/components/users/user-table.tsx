'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Ban,
  CheckCircle2,
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
import type { User } from '@/types';
import { formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface UserTableProps {
  users: User[];
  onBlock?: (id: number) => void;
  onUnblock?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function UserTable({
  users,
  onBlock,
  onUnblock,
  onDelete,
}: UserTableProps) {
  const { t } = useTranslation();

  // ============================================================
  // VAQT YORLIQLARI
  // ============================================================
  const timeLabels = {
    now: t.timeNow,
    minutesAgo: t.timeMinutesAgo,
    hoursAgo: t.timeHoursAgo,
    daysAgo: t.timeDaysAgo,
  };

  return (
    <div className="rounded-2xl bg-card border-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent">
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>{t.user}</TableHead>
            <TableHead>{t.email}</TableHead>
            <TableHead>{t.phone}</TableHead>
            <TableHead>{t.favorites}</TableHead>
            <TableHead>{t.views}</TableHead>
            <TableHead>{t.applications}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead>{t.createdAt}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Ban className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{t.noData}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                >
                  {/* Avatar */}
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={cn(
                          'text-sm font-bold',
                          user.blocked
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {initials || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  {/* Foydalanuvchi */}
                  <TableCell>
                    <Link
                      href={`/users/${user.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {user.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      ID: #{user.id}
                    </p>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>

                  {/* Telefon */}
                  <TableCell>
                    {user.phone ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        —
                      </span>
                    )}
                  </TableCell>

                  {/* Sevimlilar */}
                  <TableCell>
                    <span className="text-sm text-foreground font-medium tabular-nums">
                      {user._count?.favorites || 0}
                    </span>
                  </TableCell>

                  {/* Ko'rishlar */}
                  <TableCell>
                    <span className="text-sm text-foreground font-medium tabular-nums">
                      {user._count?.views || 0}
                    </span>
                  </TableCell>

                  {/* Zayavkalar */}
                  <TableCell>
                    <span className="text-sm text-foreground font-medium tabular-nums">
                      {user._count?.applications || 0}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {user.blocked ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-rose-500/10 text-rose-500"
                      >
                        <Ban className="mr-1 h-3 w-3" />
                        {t.blocked}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-emerald-500/10 text-emerald-500"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t.active}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Sana */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatRelativeTime(user.createdAt, timeLabels)}
                  </TableCell>

                  {/* Amallar */}
                  <TableCell className="text-right">
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
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/${user.id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t.view}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.blocked ? (
                          <DropdownMenuItem
                            onClick={() => onUnblock?.(user.id)}
                            className="cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500"
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            {t.unblock}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onBlock?.(user.id)}
                            className="cursor-pointer text-amber-500 focus:bg-amber-500/10 focus:text-amber-500"
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            {t.block}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete?.(user.id)}
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