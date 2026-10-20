'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { EmployeeForm } from '@/components/forms/employee-form';
import { createEmployee } from '@/lib/api-employees';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';

export default function NewEmployeePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (data: any) => {
    try {
      const employee = await createEmployee(data);
      toast.success(t.employeeCreated);
      router.push('/employees');
    } catch (err: any) {
      console.error('Xato:', err?.response?.data);
      toast.error(err?.response?.data?.error || t.errorOccurred);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ============================================================
          SARLAVHA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/employees">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t.newEmployee}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.newEmployeeSubtitle}
          </p>
        </div>
      </motion.div>

      {/* ============================================================
          FORMA
          ============================================================ */}
      <EmployeeForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}