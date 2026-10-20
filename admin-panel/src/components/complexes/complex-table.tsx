'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Calendar,
  Layers,
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
import { cn } from '@/lib/utils';
import type { ResidentialComplex } from '@/types';
import { UPLOADS_URL } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface ComplexTableProps {
  complexes: ResidentialComplex[];
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
}

// ============================================================
// STATUS COLORS
// ============================================================
const STATUS_COLORS: Record<string, string> = {
  building: 'bg-amber-500/10 text-amber-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  planned: 'bg-blue-500/10 text-blue-500',
};

export function ComplexTable({
  complexes,
  onDelete,
  onToggle,
}: ComplexTableProps) {
  const { t } = useTranslation();

  // ============================================================
  // STATUS LABELS — TARJIMA
  // ============================================================
  const statusLabels: Record<string, string> = {
    building: t.statusBuilding,
    completed: t.statusCompleted,
    planned: t.statusPlanned,
  };

  // ============================================================
  // TIME LABELS — TARJIMA
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
            <TableHead className="w-[80px]">{t.image}</TableHead>
            <TableHead>{t.complexName}</TableHead>
            <TableHead>{t.district}</TableHead>
            <TableHead>{t.builder}</TableHead>
            <TableHead>{t.completionYear}</TableHead>
            <TableHead>{t.price}</TableHead>
            <TableHead>{t.propertiesCount}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complexes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Building2 className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    {t.noData}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            complexes.map((complex, index) => (
              <motion.tr
                key={complex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
              >
                {/* Rasm */}
                <TableCell>
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                    {complex.images?.[0] ? (
                      <img
                        src={`${UPLOADS_URL}${complex.images[0].url}`}
                        alt={complex.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                {/* Nomi */}
                <TableCell>
                  <Link
                    href={`/complexes/${complex.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {complex.name}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {complex.builder}
                  </p>
                </TableCell>

                {/* Tuman */}
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{complex.district}</span>
                  </div>
                </TableCell>

                {/* Quruvchi */}
                <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {complex.builder}
                </TableCell>

                {/* Topshirish */}
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{complex.completionYear}</span>
                  </div>
                </TableCell>

                {/* Narx */}
                <TableCell>
                  <p className="font-semibold text-foreground text-sm">
                    {formatPrice(complex.minPrice)} —{' '}
                    {formatPrice(complex.maxPrice)}
                  </p>
                </TableCell>

                {/* Obyektlar */}
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Layers className="h-3 w-3" />
                    {complex._count?.properties || 0}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs border-0',
                      STATUS_COLORS[complex.status] || 'bg-muted'
                    )}
                  >
                    {statusLabels[complex.status] || complex.status}
                  </Badge>
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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/complexes/${complex.id}`}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t.edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/complexes/${complex.id}`}
                          target="_blank"
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t.view}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggle?.(complex.id)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {complex.published ? t.hideFromSite : t.showOnSite}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete?.(complex.id)}
                        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}