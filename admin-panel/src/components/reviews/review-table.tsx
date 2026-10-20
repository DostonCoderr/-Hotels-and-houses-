'use client';

import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Eye,
  EyeOff,
  Trash2,
  Star,
  MessageSquare,
  User,
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
import type { Review } from '@/types';
import { formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface ReviewTableProps {
  reviews: Review[];
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function ReviewTable({
  reviews,
  onPublish,
  onUnpublish,
  onDelete,
}: ReviewTableProps) {
  const { t } = useTranslation();

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
            <TableHead>{t.rating}</TableHead>
            <TableHead>{t.review}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead>{t.date}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    {t.reviewsNotFound}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review, index) => {
              const initials = review.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <motion.tr
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                >
                  {/* Avatar */}
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {initials || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  {/* Foydalanuvchi */}
                  <TableCell>
                    <p className="font-medium text-foreground line-clamp-1">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: #{review.id}
                    </p>
                  </TableCell>

                  {/* Reyting */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'h-3.5 w-3.5',
                              star <= review.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                  </TableCell>

                  {/* Sharh */}
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-[400px]">
                      {review.text}
                    </p>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {review.published ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-emerald-500/10 text-emerald-500"
                      >
                        {t.published}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-amber-500/10 text-amber-500"
                      >
                        {t.pending}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Sana */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatRelativeTime(review.createdAt, timeLabels)}
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
                        {review.published ? (
                          <DropdownMenuItem
                            onClick={() => onUnpublish?.(review.id)}
                            className="cursor-pointer text-amber-500 focus:bg-amber-500/10 focus:text-amber-500"
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            {t.hide}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onPublish?.(review.id)}
                            className="cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t.publish}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(review.id)}
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