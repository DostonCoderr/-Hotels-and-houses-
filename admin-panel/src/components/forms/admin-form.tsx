'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  User,
  Mail,
  Lock,
  Shield,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { Admin, Role } from '@/types';
import { useTranslation } from '@/lib/translations';

interface AdminFormProps {
  initialData?: Admin | null;
  roles?: Role[];
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function AdminForm({
  initialData,
  roles = [],
  onSubmit,
  onCancel,
  mode = 'create',
}: AdminFormProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const adminSchema = z.object({
    name: z.string().min(2, t.nameMin),
    email: z.string().email(t.emailInvalid),
    password: z
      .string()
      .min(6, t.passwordMin)
      .optional()
      .or(z.literal('')),
    roleId: z.number().int().positive(t.roleRequired),
    active: z.boolean().default(true),
  });

  type AdminFormData = z.infer<typeof adminSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      roleId: initialData?.roleId || roles[0]?.id || 1,
      active: initialData?.active ?? true,
    },
  });

  const roleLabels: Record<string, string> = {
    super_admin: t.superAdmin,
    content_manager: t.contentManager,
    manager: t.manager,
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleFormSubmit = async (data: any) => {
    const payload: any = {
      name: data.name,
      email: data.email,
      roleId: Number(data.roleId),
      active: Boolean(data.active),
    };

    if (data.password && data.password.length >= 6) {
      payload.password = data.password;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ============================================================
          ASOSIY MA'LUMOT
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t.adminInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.adminInfo} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Sardor Rahimov"
                  {...register('name')}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {t.email} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@etagi.ru"
                  {...register('email')}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                {t.password}{' '}
                {mode === 'edit' && (
                  <span className="text-muted-foreground text-xs">
                    ({t.edit})
                  </span>
                )}
                {mode === 'create' && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          ROL VA STATUS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t.roleAndStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role */}
            <div className="space-y-2">
              <Label>
                {t.role} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="h-11 bg-muted/30 border-0">
                      <SelectValue placeholder={t.selectRole} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5" />
                            {roleLabels[role.name] || role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roleId && (
                <p className="text-xs text-destructive">
                  {errors.roleId.message}
                </p>
              )}
            </div>

            {/* Active */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium text-foreground">
                  {t.activeStatus}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.activeStatusDesc}
                </p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          ACTIONS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-2xl border-0"
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => (onCancel ? onCancel() : router.back())}
          disabled={isSubmitting}
          className="rounded-full"
        >
          {t.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.saving}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === 'create' ? t.create : t.save}
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}