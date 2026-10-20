'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  GripVertical,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';
import { UPLOADS_URL } from '@/lib/constants';
import { useTranslation } from '@/lib/translations';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
}

export function EmployeeTable({
  employees,
  onDelete,
  onToggle,
}: EmployeeTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-card border-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[80px]">{t.image}</TableHead>
            <TableHead>{t.name}</TableHead>
            <TableHead>{t.position}</TableHead>
            <TableHead>{t.contact}</TableHead>
            <TableHead>{t.order}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <User className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    {t.employeesNotFound}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp, index) => {
              const initials = emp.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                >
                  {/* Drag handle */}
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-grab" />
                  </TableCell>

                  {/* Avatar */}
                  <TableCell>
                    <Avatar className="h-12 w-12">
                      {emp.photo ? (
                        <AvatarImage
                          src={
                            emp.photo.startsWith('http')
                              ? emp.photo
                              : `${UPLOADS_URL}${emp.photo}`
                          }
                          alt={emp.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {initials || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  {/* Ism */}
                  <TableCell>
                    <Link
                      href={`/employees/${emp.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {emp.name}
                    </Link>
                    {emp.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                        {emp.description}
                      </p>
                    )}
                  </TableCell>

                  {/* Lavozim */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs border-0 bg-primary/10 text-primary"
                    >
                      {emp.position}
                    </Badge>
                  </TableCell>

                  {/* Aloqa */}
                  <TableCell>
                    <div className="space-y-0.5">
                      {emp.phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{emp.phone}</span>
                        </div>
                      )}
                      {emp.email && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">
                            {emp.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Tartib */}
                  <TableCell>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      #{emp.order}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {emp.hidden ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-rose-500/10 text-rose-500"
                      >
                        {t.hidden}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-0 bg-emerald-500/10 text-emerald-500"
                      >
                        {t.active}
                      </Badge>
                    )}
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
                            href={`/employees/${emp.id}`}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggle?.(emp.id)}
                          className="cursor-pointer"
                        >
                          {emp.hidden ? (
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
                          onClick={() => onDelete?.(emp.id)}
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