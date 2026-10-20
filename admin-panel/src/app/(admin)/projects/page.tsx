'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectTable } from '@/components/projects/project-table'; // ✅ Yangi komponent
import { fetchProjects, deleteProject } from '@/lib/api-projects';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // Pagination uchun
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;

  const categories = [
    { value: '', label: 'Все' },
    { value: 'project', label: 'Проекты' },
    { value: 'barn', label: 'Барнхаусы' },
    { value: 'module', label: 'Модульные' },
    { value: 'frame', label: 'Каркасные' },
    { value: 'brick', label: 'Кирпичные' },
  ];

  // ============================================================
  // YUKLASH
  // ============================================================
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects({
        page,
        limit,
        search: search || undefined,
        category: categoryFilter || undefined,
      });
      setProjects(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Xato:', err);
      toast.error('Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [page, categoryFilter]);

  // Qidiruv (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadProjects();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // O'chirish
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;
    try {
      await deleteProject(id);
      toast.success('Проект удален');
      loadProjects();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Ошибка удаления');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Hammer className="h-8 w-8 text-primary" /> 
            Проекты домов
          </h1>
          <p className="text-muted-foreground mt-1">
            Всего проектов: {total}
          </p>
        </div>

        <Link href="/projects/new">
          <Button className="rounded-full shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Новый проект
          </Button>
        </Link>
      </div>

      {/* FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-card"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="pl-9 h-10 rounded-full bg-muted/50 border-0"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategoryFilter(cat.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                categoryFilter === cat.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* TABLE */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={projects}
          onDelete={handleDelete}
        />
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Страница {page} из {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full"
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full"
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}