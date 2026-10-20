'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Building2,
  MapPin,
  Bed,
  Maximize,
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
import type { Property } from '@/types';
import { UPLOADS_URL, STATUS_COLORS } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { useTranslation } from '@/lib/translations';

interface PropertyTableProps {
  properties: Property[];
  onDelete?: (id: number) => void;
  onDuplicate?: (id: number) => void;
}

export function PropertyTable({
  properties,
  onDelete,
  onDuplicate,
}: PropertyTableProps) {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    available: t.statusAvailable,
    booked: t.statusBooked,
    sold: t.statusSold,
  };

  const typeLabels: Record<string, string> = {
    apartment: t.propertyTypeApartment,
    studio: t.propertyTypeStudio,
    house: t.propertyTypeHouse,
    office: t.propertyTypeOffice,
    shop: t.propertyTypeShop,
    parking: t.propertyTypeParking,
    garage: t.propertyTypeGarage,
    storage: t.propertyTypeStorage,
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
            <TableHead className="w-[80px]">{t.image}</TableHead>
            <TableHead>{t.propertyName}</TableHead>
            <TableHead>{t.type}</TableHead>
            <TableHead>{t.address}</TableHead>
            <TableHead>{t.price}</TableHead>
            <TableHead>{t.rooms}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead>{t.createdAt}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
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
            properties.map((property, index) => (
              <motion.tr
                key={property.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
              >
                {/* Rasm */}
                <TableCell>
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                    {property.images?.[0] ? (
                      <img
                        src={`${UPLOADS_URL}${property.images[0].url}`}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                {/* Nomi — BOSILGANDA VIEW GA O'TADI */}
                <TableCell>
                  <Link
                    href={`/properties/view/${property.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {property.name}
                  </Link>
                  {property.complex && (
                    <p className="text-xs text-muted-foreground truncate">
                      {property.complex.name}
                    </p>
                  )}
                </TableCell>

                {/* Tur */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary/10 text-primary border-0"
                  >
                    {typeLabels[property.type?.slug || ''] ||
                      property.type?.name ||
                      '—'}
                  </Badge>
                </TableCell>

                {/* Manzil */}
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[200px]">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </TableCell>

                {/* Narx */}
                <TableCell>
                  <p className="font-semibold text-foreground">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(property.priceM2)}/m²
                  </p>
                </TableCell>

                {/* Xona */}
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.rooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-3 w-3" />
                      {property.area}m²
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs border-0',
                      STATUS_COLORS[property.status] || 'bg-muted'
                    )}
                  >
                    {statusLabels[property.status] || property.status}
                  </Badge>
                </TableCell>

                {/* Sana */}
                <TableCell className="text-xs text-muted-foreground">
                  {formatRelativeTime(property.createdAt, timeLabels)}
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
                      
                      {/* EDIT */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/properties/${property.id}`}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t.edit}
                        </Link>
                      </DropdownMenuItem>

                      {/* DUPLICATE */}
                      <DropdownMenuItem
                        onClick={() => onDuplicate?.(property.id)}
                        className="cursor-pointer"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t.duplicate}
                      </DropdownMenuItem>

                      {/* VIEW — DASHBOARDGA O'TADI */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/properties/view/${property.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t.view}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      
                      {/* DELETE */}
                      <DropdownMenuItem
                        onClick={() => onDelete?.(property.id)}
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