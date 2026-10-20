'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  X,
  Plus,
  MapPin,
  Building2,
  Calendar,
  Layers,
  DollarSign,
  Briefcase,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { ImageUploader } from '@/components/forms/image-uploader';
import { cn } from '@/lib/utils';
import type { ResidentialComplex, Image } from '@/types';
import { COMPLEX_STATUSES } from '@/lib/api-complexes';
import { complexSchema, type ComplexFormData } from '@/lib/validations';
import { useTranslation } from '@/lib/translations';

interface ComplexFormProps {
  initialData?: ResidentialComplex | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function ComplexForm({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create',
}: ComplexFormProps) {
  const router = useRouter();
  const { t } = useTranslation(); // ✅ HOOK ICHIDA

  const [infrastructure, setInfrastructure] = useState<string[]>(
    initialData?.infrastructure || []
  );
  const [advantages, setAdvantages] = useState<string[]>(
    initialData?.advantages || []
  );
  const [images, setImages] = useState<Image[]>(initialData?.images || []);
  const [newInfra, setNewInfra] = useState('');
  const [newAdvantage, setNewAdvantage] = useState('');

  // ============================================================
  // STATUS LABELS — TARJIMA
  // ============================================================
  const statusLabels: Record<string, string> = {
    building: t.statusBuilding,
    completed: t.statusCompleted,
    planned: t.statusPlanned,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ComplexFormData>({
    resolver: zodResolver(complexSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      district: initialData?.district || '',
      builder: initialData?.builder || '',
      completionYear:
        initialData?.completionYear || new Date().getFullYear() + 1,
      status: (initialData?.status as any) || 'building',
      buildings: initialData?.buildings || 1,
      floors: initialData?.floors || 1,
      infrastructure: initialData?.infrastructure || [],
      advantages: initialData?.advantages || [],
      minPrice: initialData?.minPrice || 0,
      maxPrice: initialData?.maxPrice || 0,
      lat: initialData?.lat || 41.311081,
      lng: initialData?.lng || 69.240562,
      published: initialData?.published ?? true,
    },
  });

  // ============================================================
  // SUBMIT — RASM MAJBURIY
  // ============================================================
  const handleFormSubmit = async (data: any) => {
    if (images.length === 0) {
      toast.error(t.imageRequired);
      return;
    }

    const payload: any = {
      name: data.name,
      description: data.description,
      address: data.address,
      district: data.district,
      builder: data.builder,
      completionYear: Number(data.completionYear),
      status: data.status,
      buildings: Number(data.buildings),
      floors: Number(data.floors),
      infrastructure: Array.isArray(infrastructure) ? infrastructure : [],
      advantages: Array.isArray(advantages) ? advantages : [],
      minPrice: Number(data.minPrice),
      maxPrice: Number(data.maxPrice),
      lat: Number(data.lat),
      lng: Number(data.lng),
      published: Boolean(data.published),
    };
    await onSubmit(payload);
  };

  // ============================================================
  // INFRASTRUCTURE
  // ============================================================
  const addInfra = () => {
    if (newInfra.trim()) {
      setInfrastructure([...infrastructure, newInfra.trim()]);
      setNewInfra('');
    }
  };

  const removeInfra = (index: number) => {
    setInfrastructure(infrastructure.filter((_, i) => i !== index));
  };

  // ============================================================
  // ADVANTAGES
  // ============================================================
  const addAdvantage = () => {
    if (newAdvantage.trim()) {
      setAdvantages([...advantages, newAdvantage.trim()]);
      setNewAdvantage('');
    }
  };

  const removeAdvantage = (index: number) => {
    setAdvantages(advantages.filter((_, i) => i !== index));
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
              <Building2 className="h-4 w-4 text-primary" />
              {t.complexBasicInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nomi */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.complexName} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="ЖК Etagi Tower"
                {...register('name')}
                className="h-11 bg-muted/30 border-0"
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Tavsif */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {t.description} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t.description}
                rows={4}
                {...register('description')}
                className="bg-muted/30 border-0 resize-none"
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Builder */}
            <div className="space-y-2">
              <Label htmlFor="builder">
                {t.builder} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="builder"
                  placeholder="Etagi Development"
                  {...register('builder')}
                  className="pl-10 h-11 bg-muted/30 border-0"
                />
              </div>
              {errors.builder && (
                <p className="text-xs text-destructive">
                  {errors.builder.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          RASMLAR
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              {t.images} <span className="text-destructive">*</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {t.imageHint}
            </p>
          </CardHeader>
          <CardContent>
            <ImageUploader
              complexId={initialData?.id}
              images={images}
              onChange={setImages}
              maxFiles={10}
              entityType="complex"
            />

            {images.length === 0 && (
              <p className="text-xs text-destructive mt-2">
                ⚠ {t.imageRequired}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          MANZIL
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {t.address}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">
                  {t.district} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="district"
                  placeholder="Yunusobod"
                  {...register('district')}
                  className="h-11 bg-muted/30 border-0"
                />
                {errors.district && (
                  <p className="text-xs text-destructive">
                    {errors.district.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  {t.address} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Toshkent, Yunusobod tumani..."
                  {...register('address')}
                  className="h-11 bg-muted/30 border-0"
                />
                {errors.address && (
                  <p className="text-xs text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.000001"
                  {...register('lat', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.000001"
                  {...register('lng', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          QURILISH
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {t.complexConstruction}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="completionYear">
                  {t.completionYear}{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="completionYear"
                  type="number"
                  {...register('completionYear', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildings">
                  {t.buildings} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buildings"
                  type="number"
                  min="1"
                  {...register('buildings', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floors">
                  {t.floors} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="floors"
                  type="number"
                  min="1"
                  {...register('floors', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {t.status} <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-11 bg-muted/30 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPLEX_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {statusLabels[s.value] || s.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          NARX
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              {t.price}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">
                  {t.minPrice} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  {...register('minPrice', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">
                  {t.maxPrice} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  {...register('maxPrice', { valueAsNumber: true })}
                  className="h-11 bg-muted/30 border-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          INFRASTRUCTURE + ADVANTAGES
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Infrastructure */}
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              {t.infrastructure}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newInfra}
                onChange={(e) => setNewInfra(e.target.value)}
                placeholder={t.infrastructurePlaceholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInfra();
                  }
                }}
                className="h-10 bg-muted/30 border-0"
              />
              <Button
                type="button"
                size="icon"
                onClick={addInfra}
                className="h-10 w-10 rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {infrastructure.map((item, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-primary/10 text-primary border-0 gap-1 pr-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeInfra(i)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advantages */}
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {t.advantages}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newAdvantage}
                onChange={(e) => setNewAdvantage(e.target.value)}
                placeholder={t.advantagesPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAdvantage();
                  }
                }}
                className="h-10 bg-muted/30 border-0"
              />
              <Button
                type="button"
                size="icon"
                onClick={addAdvantage}
                className="h-10 w-10 rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {advantages.map((item, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-500 border-0 gap-1 pr-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeAdvantage(i)}
                    className="hover:bg-emerald-500/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          PUBLISHED
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 bg-card rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {t.publishedLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.publishedHint}
              </p>
            </div>
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          ACTIONS
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
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