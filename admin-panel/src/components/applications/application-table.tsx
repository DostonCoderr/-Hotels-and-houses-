'use client';

import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Phone,
  Mail,
  Building2,
  Hammer,
  CheckCircle2,
  MessageSquare,
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Application } from '@/types';
import {
  APPLICATION_STATUSES,
  APPLICATION_TYPES,
  APPLICATION_SOURCES,
} from '@/lib/api-applications';
import { formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface ApplicationTableProps {
  applications: Application[];
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
  onView?: (app: Application) => void;
  onChangeStatus?: (app: Application) => void;
  onDelete?: (id: number) => void;
}

export function ApplicationTable({
  applications,
  selectedIds = [],
  onToggleSelect,
  onView,
  onChangeStatus,
  onDelete,
}: ApplicationTableProps) {
  const { t } = useTranslation();

  const STATUS_MAP = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s.value, s])
  );

  const statusLabels: Record<string, string> = {
    new: t.statusNew,
    in_work: t.statusInWork,
    done: t.statusDone,
    closed: t.statusClosed,
  };

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
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>{t.client}</TableHead>
            <TableHead>{t.contact}</TableHead>
            <TableHead>{t.type}</TableHead>
            <TableHead>{t.source}</TableHead>
            <TableHead>{t.property}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead>{t.date}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    {t.applicationsNotFound}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app, index) => {
              const status = STATUS_MAP[app.status] || STATUS_MAP.new;
              const initials = app.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              const isSelected = selectedIds.includes(app.id);

              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onView?.(app)}
                  className={cn(
                    'border-b border-border/30 hover:bg-muted/30 transition-colors group cursor-pointer',
                    isSelected && 'bg-primary/5'
                  )}
                >
                  <TableCell
                    className="w-[40px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect?.(app.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>

                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={cn('text-sm font-bold', status.bg, status.color)}
                      >
                        {initials || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-foreground line-clamp-1">
                      {app.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: #{app.id}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{app.phone}</span>
                      </div>
                      {app.email && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">
                            {app.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs border-0 bg-primary/10 text-primary"
                    >
                      {APPLICATION_TYPES[app.type] || app.type}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {APPLICATION_SOURCES[app.source] || app.source}
                    </span>
                  </TableCell>

                  {/* ✅ OBYEKT (Project yoki Property) */}
                  <TableCell>
                    {app.project ? (
                      <div className="flex items-center gap-1 text-xs text-primary font-medium">
                        <Hammer className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {app.project.name}
                        </span>
                      </div>
                    ) : app.property ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {app.property.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        —
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-xs border-0 gap-1', status.bg, status.color)}
                    >
                      <span>{status.icon}</span>
                      {statusLabels[app.status] || status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {formatRelativeTime(app.createdAt, timeLabels)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onView?.(app);
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t.viewDetails}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onChangeStatus?.(app);
                          }}
                          className="cursor-pointer"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          {t.changeStatus}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(app.id);
                          }}
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