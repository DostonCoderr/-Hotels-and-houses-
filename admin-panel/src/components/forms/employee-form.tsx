'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  User,
  Briefcase,
  Phone,
  Mail,
  Image as ImageIcon,
  X,
  Hash,
  Upload,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';
import { employeeSchema, type EmployeeFormData } from '@/lib/validations';
import { uploadEmployeePhoto } from '@/lib/api-upload';
import { UPLOADS_URL } from '@/lib/constants';
import { useTranslation } from '@/lib/translations';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create',
}: EmployeeFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(
    initialData?.photo || null
  );
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      position: initialData?.position || '',
      photo: initialData?.photo || null,
      phone: initialData?.phone || null,
      email: initialData?.email || null,
      description: initialData?.description || null,
      hidden: initialData?.hidden ?? false,
      order: initialData?.order ?? 0,
    },
  });

  // ============================================================
  // RASM YUKLASH
  // ============================================================
  const handleUploadPhoto = async (file: File) => {
    if (!initialData?.id) {
      toast.error(t.saveEmployeeFirst);
      return;
    }

    try {
      setUploading(true);
      const result = await uploadEmployeePhoto(initialData.id, file);
      setPhoto(result.photo);
      toast.success(t.photoUploaded);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.photoUploadFailed);
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // YUBORISH
  // ============================================================
  const handleFormSubmit = async (data: any) => {
    const payload: any = {
      name: data.name,
      position: data.position,
      hidden: Boolean(data.hidden),
      order: Number(data.order) || 0,
    };

    if (photo) payload.photo = photo;
    if (data.phone) payload.phone = data.phone;
    if (data.email) payload.email = data.email;
    if (data.description) payload.description = data.description;

    await onSubmit(payload);
  };

  const initials = (initialData?.name || 'X')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ============================================================
          RASM
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              {t.photo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Avatar ko'rinishi */}
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                  {photo ? (
                    <AvatarImage
                      src={
                        photo.startsWith('http')
                          ? photo
                          : `${UPLOADS_URL}${photo}`
                      }
                      alt="Employee"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials || '?'}
                  </AvatarFallback>
                </Avatar>

                {/* Kamera belgisi */}
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              {/* Amallar */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadPhoto(file);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || !initialData?.id}
                  className="rounded-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.uploading}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {t.uploadPhoto}
                    </>
                  )}
                </Button>

                {photo && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPhoto(null)}
                    className="rounded-full text-destructive hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t.delete}
                  </Button>
                )}

                <p className="text-xs text-muted-foreground">
                  {initialData?.id
                    ? t.photoHint
                    : t.saveEmployeeFirst}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          ASOSIY MA'LUMOT
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t.basicInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.fullName} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder={t.namePlaceholder}
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

            <div className="space-y-2">
              <Label htmlFor="position">
                {t.position} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="position"
                  placeholder={t.positionPlaceholder}
                  {...register('position')}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
              {errors.position && (
                <p className="text-xs text-destructive">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                placeholder={t.descriptionPlaceholder}
                rows={3}
                {...register('description')}
                className="bg-muted/30 border-0 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          ALOQA
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.contact}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+998 90 123 45 67"
                  {...register('phone')}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sardor@etagi.ru"
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
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          TARTIB VA STATUS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              {t.orderAndStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order">{t.orderNumber}</Label>
              <Input
                id="order"
                type="number"
                min="0"
                {...register('order', { valueAsNumber: true })}
                className="h-11 bg-muted/30 border-0"
              />
              <p className="text-xs text-muted-foreground">
                {t.orderHint}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium text-foreground">
                  {t.showOnSite}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.showOnSiteDesc}
                </p>
              </div>
              <Controller
                name="hidden"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={!field.value}
                    onCheckedChange={(checked) => field.onChange(!checked)}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          AMALLAR
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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