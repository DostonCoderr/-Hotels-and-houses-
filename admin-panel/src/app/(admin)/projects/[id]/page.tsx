'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Hammer, Settings2 } from 'lucide-react';
import { ProjectForm } from '@/components/forms/project-form';
import { fetchProjectById, updateProject } from '@/lib/api-projects';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProjectById(Number(id));
        setProject(data);
      } catch {
        toast.error('Проект не найден');
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    try {
      await updateProject(Number(id), data);
      toast.success('Проект успешно обновлен!');
      router.push('/projects');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-card rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-primary" /> 
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ID проекта: #{project.id} · Категория: <span className="uppercase font-semibold text-primary/80">{project.category}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* FORM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <ProjectForm 
          initialData={project} 
          onSubmit={handleSubmit} 
          onCancel={() => router.push('/projects')} 
          mode="edit" 
        />
      </motion.div>
      
    </div>
  );
}