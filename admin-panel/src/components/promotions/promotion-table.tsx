'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Gift,
  Calendar,
  Percent,
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
import type { Promotion } from '@/types';
import { UPLOADS_URL } from '@/lib/constants';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { PROMOTION_STATUS_MAP } from '@/lib/api-promotions';
import { useTranslation } from '@/lib/translations';

interface PromotionTableProps {
  promotions: Promotion[];
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
}

// ✅ EXPORT FUNCTION — BU BO'LISHI KERAK
export function PromotionTable({
  promotions,
  onDelete,
  onToggle,
}: PromotionTableProps) {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    active: t.promotionActive,
    inactive: t.promotionInactive,
    hidden: t.promotionHidden,
  };

  return (
    <div className="rounded-2xl bg-card border-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent">
            <TableHead className="w-[80px]">{t.image}</TableHead>
            <TableHead>{t.promotionName}</TableHead>
            <TableHead>{t.promotionDiscount}</TableHead>
            <TableHead>{t.promotionStartDate}</TableHead>
            <TableHead>{t.promotionEndDate}</TableHead>
            <TableHead>{t.propertiesCount}</TableHead>
            <TableHead>{t.promotionStatus}</TableHead>
            <TableHead>{t.createdAt}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Gift className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{t.noData}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            promotions.map((promo, index) => {
              const status =
                PROMOTION_STATUS_MAP[promo.status] ||
                PROMOTION_STATUS_MAP.active;

              return (
                <motion.tr
                  key={promo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                >
                  {/* Rasm */}
                  <TableCell>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      {promo.image ? (
                        <img
                          src={
                            promo.image.startsWith('http')
                              ? promo.image
                              : `${UPLOADS_URL}${promo.image}`
                          }
                          alt={promo.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gift className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>

                  {/* Nomi */}
                  <TableCell>
                    <Link
                      href={`/promotions/${promo.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {promo.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {promo.description}
                    </p>
                  </TableCell>

                  {/* Chegirma */}
                  <TableCell>
                    {promo.discount ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-orange-500/10 text-orange-500"
                      >
                        <Percent className="mr-1 h-3 w-3" />
                        {promo.discount}%
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        —
                      </span>
                    )}
                  </TableCell>

                  {/* Boshlanish */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(promo.startDate)}
                    </div>
                  </TableCell>

                  {/* Tugash */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(promo.endDate)}
                    </div>
                  </TableCell>

                  {/* Obyektlar */}
                  <TableCell>
                    <span className="text-sm text-foreground font-medium tabular-nums">
                      {promo._count?.properties || 0}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs border-0',
                        status.bg,
                        status.color
                      )}
                    >
                      {statusLabels[promo.status] || promo.status}
                    </Badge>
                  </TableCell>

                  {/* Sana */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatRelativeTime(promo.createdAt)}
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
                            href={`/promotions/${promo.id}`}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggle?.(promo.id)}
                          className="cursor-pointer"
                        >
                          {promo.status === 'hidden' ? (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              {t.show}
                            </>
                          ) : (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              {t.hide}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(promo.id)}
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