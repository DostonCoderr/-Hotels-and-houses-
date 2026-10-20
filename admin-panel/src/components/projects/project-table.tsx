'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Hammer,
  MapPin,
  Ruler,
  Calendar,
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
import { UPLOADS_URL } from '@/lib/constants';
import { formatPrice } from '@/lib/format';


interface ProjectTableProps {
  projects: any[];
  onDelete?: (id: number) => void;
}

export function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  return (
    <div className="rounded-2xl bg-card border-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/40 hover:bg-transparent">
            <TableHead className="w-[80px]">Фото</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Площадь</TableHead>
            <TableHead>Этажей</TableHead>
            <TableHead>Комнат</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Hammer className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Проекты не найдены</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project, index) => {
              const imgUrl = project.images?.[0]?.url
                ? (project.images[0].url.startsWith('http') ? project.images[0].url : `${UPLOADS_URL}${project.images[0].url}`)
                : null;

              return (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                >
                  {/* Rasm */}
                  <TableCell>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      {imgUrl ? (
                        <img src={imgUrl} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <Hammer className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>

                  {/* Nomi */}
                  <TableCell>
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {project.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {project.description || 'Нет описания'}
                    </p>
                  </TableCell>

                  {/* Kategoriya */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-0 uppercase">
                      {project.category || 'Проект'}
                    </Badge>
                  </TableCell>

                  {/* Maydon */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Ruler className="h-3 w-3" />
                      {project.area} м²
                    </div>
                  </TableCell>

                  {/* Qavat */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {project.floors} этаж
                    </div>
                  </TableCell>

                  {/* Xonalar */}
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {project.bedrooms} комн.
                    </div>
                  </TableCell>

                  {/* Narxi */}
                  <TableCell>
                    <p className="font-semibold text-foreground">
                      {formatPrice(project.price)}
                    </p>
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
                          <Link href={`/projects/${project.id}`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Изменить
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/stroitelstvo/${project.id}`} target="_blank" className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Посмотреть на сайте
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(project.id)}
                          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
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