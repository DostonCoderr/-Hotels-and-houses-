'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
  Loader2,
  Edit,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth';
import { useTranslation } from '@/lib/translations';
import { updateProfile } from '@/lib/api-profile';
import { cn } from '@/lib/utils';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  address: string;
}

export function ProfileInfo() {
  const { t } = useTranslation();
  const admin = useAuthStore((s) => s.admin);
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: admin?.name || '',
      email: admin?.email || '',
      phone: (admin as any)?.phone || '',
      position: (admin as any)?.position || '',
      address: (admin as any)?.address || '',
    },
  });

  // ⚠️ Admin o'zgarganda formani yangilash
  useEffect(() => {
    reset({
      name: admin?.name || '',
      email: admin?.email || '',
      phone: (admin as any)?.phone || '',
      position: (admin as any)?.position || '',
      address: (admin as any)?.address || '',
    });
  }, [admin, reset]);

  // ============================================================
  // SAQLASH
  // ============================================================
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true);
      const updated = await updateProfile(data);

      if (setAdmin) setAdmin(updated as any);
      toast.success(t.profileUpdated);
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || t.errorOccurred);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t.personalInfo}
            </CardTitle>

            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="rounded-full"
              >
                <Edit className="mr-2 h-3.5 w-3.5" />
                {t.edit}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-full"
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  {t.cancel}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={saving}
                  className="rounded-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-3.5 w-3.5" />
                      {t.save}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ism */}
            <div className="space-y-2">
              <Label htmlFor="name">{t.fullName}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  {...register('name')}
                  disabled={!editing}
                  className="pl-10 h-11 bg-muted/30 border-0 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={!editing}
                  className="pl-10 h-11 bg-muted/30 border-0 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+998 90 123 45 67"
                  {...register('phone')}
                  disabled={!editing}
                  className="pl-10 h-11 bg-muted/30 border-0 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Lavozim */}
            <div className="space-y-2">
              <Label htmlFor="position">{t.position}</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="position"
                  {...register('position')}
                  disabled={!editing}
                  className="pl-10 h-11 bg-muted/30 border-0 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Manzil */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">{t.address}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  {...register('address')}
                  disabled={!editing}
                  className="pl-10 h-11 bg-muted/30 border-0 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}