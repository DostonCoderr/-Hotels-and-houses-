'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/forms/project-form';
import { createProject } from '@/lib/api-projects';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createProject(data);
      toast.success('Проект создан!');
      router.push('/projects');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Ошибка');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Новый проект дома</h1>
      <ProjectForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}