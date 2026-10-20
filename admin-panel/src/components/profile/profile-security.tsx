'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Key,
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
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/translations';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileSecurity() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  // ============================================================
  // PAROL KUCHLILIGI
  // ============================================================
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 1, label: t.weak, color: 'text-rose-500' };
    if (score <= 3) return { level: 2, label: t.medium, color: 'text-amber-500' };
    if (score <= 4) return { level: 3, label: t.strong, color: 'text-emerald-500' };
    return { level: 4, label: t.veryStrong, color: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  // ============================================================
  // SAQLASH
  // ============================================================
  const onSubmit = async (data: PasswordFormData) => {
    setError('');

    if (data.newPassword !== data.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (data.newPassword.length < 6) {
      setError(t.passwordMin);
      return;
    }

    try {
      setSaving(true);
      await api.put('/admins/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(t.passwordChanged);
      reset();
    } catch (err: any) {
      const msg = err?.response?.data?.error;
      if (msg === 'INVALID_CURRENT_PASSWORD') {
        setError(t.currentPasswordWrong);
      } else {
        setError(msg || t.errorOccurred);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            {t.security}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Joriy parol */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t.currentPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('currentPassword', {
                    required: t.passwordRequired,
                  })}
                  className="pl-10 pr-10 h-11 bg-muted/30 border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Yangi parol */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t.newPassword}</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('newPassword', {
                      required: t.passwordRequired,
                      minLength: { value: 6, message: t.passwordMin },
                    })}
                    className="pl-10 pr-10 h-11 bg-muted/30 border-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}

                {/* Parol kuchliligi */}
                {newPassword && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'flex-1 rounded-full transition-colors',
                              i <= strength.level
                                ? strength.level <= 1
                                  ? 'bg-rose-500'
                                  : strength.level <= 2
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                                : 'bg-muted'
                            )}
                          />
                        ))}
                      </div>
                      <span className={cn('text-xs font-medium', strength.color)}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tasdiqlash */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t.confirmPassword}
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: t.passwordRequired,
                    })}
                    className="pl-10 pr-10 h-11 bg-muted/30 border-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Xato */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 text-rose-500">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs">{error}</p>
              </div>
            )}

            {/* Maslahatlar */}
            <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
              <p className="text-xs font-medium text-foreground">
                {t.passwordTips}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                <li>{t.passwordTip1}</li>
                <li>{t.passwordTip2}</li>
                <li>{t.passwordTip3}</li>
              </ul>
            </div>

            {/* Saqlash */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full min-w-[160px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t.changePassword}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}