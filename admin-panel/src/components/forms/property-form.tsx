'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  Save, 
  MapPin, 
  Home, 
  DollarSign, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Bed, 
  FileText,
  Building2,
  Star,
  CalendarDays,
  Video // ✅ Video ikonkasini qo'shdik
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Property, ComplexShort } from '@/types';
import { PROPERTY_TYPES, PROPERTY_STATUSES } from '@/lib/constants';
import { propertySchema, type PropertyFormData } from '@/lib/validations';
import { useTranslation } from '@/lib/translations';
import { ImageUploader } from './image-uploader';

interface PropertyFormProps {
  initialData?: Property | null;
  complexes?: ComplexShort[];
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function PropertyForm({
  initialData,
  complexes = [],
  onSubmit,
  onCancel,
  mode = 'create',
}: PropertyFormProps) {
  const { t } = useTranslation();
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [advantages, setAdvantages] = useState<string[]>(initialData?.advantages || []);
  const [featureInput, setFeatureInput] = useState('');
  const [advantageInput, setAdvantageInput] = useState('');

  const typeLabels: Record<string, string> = {
    typeApartment: t.typeApartment || 'Квартира',
    typeStudio: t.typeStudio || 'Студия',
    typeHouse: t.typeHouse || 'Дом',
    typeOffice: t.typeOffice || 'Офис',
    typeShop: t.typeShop || 'Магазин',
    typeParking: t.typeParking || 'Парковка',
    typeGarage: t.typeGarage || 'Гараж',
    typeStorage: t.typeStorage || 'Кладовая',
  };

  const statusLabels: Record<string, string> = {
    available: t.available || 'Доступно',
    booked: t.booked || 'Забронировано',
    sold: t.sold || 'Продано',
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      typeId: initialData?.typeId || 1,
      complexId: initialData?.complexId || null,
      apartmentNo: initialData?.apartmentNo || '',
      rooms: initialData?.rooms || 1,
      area: initialData?.area || 0,
      floor: initialData?.floor || 1,
      floorsTotal: initialData?.floorsTotal || 1,
      price: initialData?.price || 0,
      priceM2: initialData?.priceM2 || 0,
      oldPrice: initialData?.oldPrice || null,
      discount: initialData?.discount || null,
      status: (initialData?.status as any) || 'available',
      description: initialData?.description || '',
      address: initialData?.address || '',
      lat: initialData?.lat || 41.311081,
      lng: initialData?.lng || 69.240562,
      features: initialData?.features || [],
      advantages: initialData?.advantages || [],
      published: initialData?.published ?? true,
      
      // Novostroyka uchun yangi maydonlar
      imo: (initialData as any)?.imo || '',
      wall: (initialData as any)?.wall || '',
      cls: (initialData as any)?.cls || '',
      metro: (initialData as any)?.metro || '',
      metroTime: (initialData as any)?.metroTime || '',
      metroDist: (initialData as any)?.metroDist || '',

      // Qo'shimcha yangi maydonlar
      completionDate: (initialData as any)?.completionDate || '',
      constructionStatus: (initialData as any)?.constructionStatus || '',
      reviewsCount: (initialData as any)?.reviewsCount || 0,
      rating: (initialData as any)?.rating || 5.0,
      declarations: (initialData as any)?.declarations || '',
      videoUrl: (initialData as any)?.videoUrl || '', // ✅ Qo'shildi

      paymentMethods: (initialData as any)?.paymentMethods || '',
      similarOffers: (initialData as any)?.similarOffers || '',
    },
  });

  const handleFormSubmit = async (data: PropertyFormData) => {
    await onSubmit({
      ...data,
      features,
      advantages,
    });
  };

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const addAdvantage = () => {
    if (advantageInput.trim() && !advantages.includes(advantageInput.trim())) {
      setAdvantages([...advantages, advantageInput.trim()]);
      setAdvantageInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* ============================================================ 
          ASOSIY MA'LUMOT 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" /> {t.propertyBasicInfo || 'Основная информация'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.propertyName || 'Название'} <span className="text-destructive">*</span></Label>
                <Input id="name" placeholder="3 xonali kvartira — Etagi Tower" {...register('name')} className="h-11 bg-muted/30 border-0" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t.type || 'Тип'} <span className="text-destructive">*</span></Label>
                <Controller
                  name="typeId"
                  control={control}
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                      <SelectTrigger className="h-11 bg-muted/30 border-0"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={String(type.value)}>
                            {typeLabels[type.label] || type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.complexOptional || 'ЖК (необязательно)'}</Label>
                <Controller
                  name="complexId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ? String(field.value) : 'none'} onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}>
                      <SelectTrigger className="h-11 bg-muted/30 border-0"><SelectValue placeholder={t.selectComplex || 'Выберите ЖК'} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t.noneOption || '— Нет —'}</SelectItem>
                        {complexes.map((complex) => (
                          <SelectItem key={complex.id} value={String(complex.id)}>{complex.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartmentNo">{t.apartmentNumber || 'Номер квартиры'}</Label>
                <Input id="apartmentNo" placeholder="101" {...register('apartmentNo')} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          NOVOSTROYKA MA'LUMOTLARI 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Данные ЖК (для сайта)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Тип ЖК (ИМО)</Label>
                <Input placeholder="ЖК" {...register('imo')} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label>Материал стен</Label>
                <Input placeholder="Монолит" {...register('wall')} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label>Класс жилья</Label>
                <Input placeholder="Комфорт" {...register('cls')} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label>Метро</Label>
                <Input placeholder="Чилонзор" {...register('metro')} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Время до метро</Label>
                <Input placeholder="8 мин" {...register('metroTime')} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label>Расстояние до метро</Label>
                <Input placeholder="0.6 км" {...register('metroDist')} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          QO'SHIMCHA SAYT SOZLAMALARI (Video, Srok, Otzyvy)
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Дополнительно (Для сайта)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* VIDEO QISMI TO'G'RILANDI */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Video className="w-4 h-4" /> Ссылка на видео (YouTube)
              </Label>
              <Input 
                placeholder="https://youtube.com/watch?v=..." 
                {...register('videoUrl')} 
                className="h-11 bg-muted/30 border-0" 
              />
              <p className="text-[10px] text-muted-foreground">Вставьте ссылку на YouTube</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Срок сдачи</Label>
                <Input placeholder="1 кв. 2024" {...register('completionDate')} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Ход строительства (статус)</Label>
                <Input placeholder="1 квартал, Метроном" {...register('constructionStatus')} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Star className="w-4 h-4" /> Рейтинг (0-5)</Label>
                <Input type="number" step="0.1" min="0" max="5" placeholder="4.8" {...register('rating', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><FileText className="w-4 h-4" /> Кол-во отзывов</Label>
                <Input type="number" min="0" placeholder="1" {...register('reviewsCount', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><FileText className="w-4 h-4" /> Проектные декларации</Label>
              <Textarea placeholder="Ссылка на декларацию 1, Ссылка на декларацию 2" rows={2} {...register('declarations')} className="bg-muted/30 border-0 resize-none" />
              <p className="text-[10px] text-muted-foreground">Вводите названия через запятую</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          XONA VA QAVAT 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bed className="h-4 w-4 text-primary" /> {t.roomsAndFloor || 'Комнаты и этаж'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rooms">{t.rooms || 'Комнат'} *</Label>
                <Input id="rooms" type="number" min="0" {...register('rooms', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">{t.area || 'Площадь'} (m²) *</Label>
                <Input id="area" type="number" step="0.1" min="0" {...register('area', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">{t.floor || 'Этаж'} *</Label>
                <Input id="floor" type="number" min="0" {...register('floor', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorsTotal">{t.floorsTotal || 'Всего этажей'} *</Label>
                <Input id="floorsTotal" type="number" min="1" {...register('floorsTotal', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          NARX 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" /> {t.price || 'Цена'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t.priceAmount || 'Цена'} *</Label>
                <Input id="price" type="number" min="0" {...register('price', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceM2">{t.pricePerM2 || 'Цена за м²'} *</Label>
                <Input id="priceM2" type="number" step="0.01" min="0" {...register('priceM2', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPrice">{t.oldPrice || 'Старая цена'}</Label>
                <Input id="oldPrice" type="number" {...register('oldPrice', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">{t.discount || 'Скидка'} (%)</Label>
                <Input id="discount" type="number" min="0" max="100" {...register('discount', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          STATUS, MANZIL VA XARITA (LAT/LNG)
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {t.statusAndAddress || 'Статус и адрес'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t.status || 'Статус'} *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2 flex-wrap">
                    {PROPERTY_STATUSES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => field.onChange(s.value)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-all',
                          field.value === s.value
                            ? `${s.bg} ${s.color} ring-2 ring-inset ring-current`
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {statusLabels[s.value] || s.label}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t.address || 'Адрес'} <span className="text-destructive">*</span></Label>
              <Input id="address" placeholder="Toshkent, Yunusobod tumani, ..." {...register('address')} className="h-11 bg-muted/30 border-0" />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Широта (xarita uchun)</Label>
                <Input id="lat" type="number" step="any" placeholder="41.311081" {...register('lat', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
                <p className="text-xs text-muted-foreground">Misol: 41.311081 (Toshkent)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Долгота (xarita uchun)</Label>
                <Input id="lng" type="number" step="any" placeholder="69.240562" {...register('lng', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
                <p className="text-xs text-muted-foreground">Misol: 69.240562 (Toshkent)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          TAVSIF 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> {t.description || 'Описание'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder={t.description || 'Описание объекта...'} rows={5} {...register('description')} className="bg-muted/30 border-0 resize-none" />
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          RASMLAR 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" /> {t.images || 'Изображения'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader propertyId={initialData?.id} images={initialData?.images || []} maxFiles={10} />
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          FEATURES + ADVANTAGES 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader><CardTitle className="text-base">{t.features || 'Особенности'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder={t.featuresPlaceholder || 'Балкон, Лифт...'} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} className="h-10 bg-muted/30 border-0" />
              <Button type="button" size="icon" onClick={addFeature} className="h-10 w-10 rounded-xl"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, i) => (
                <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-0 gap-1 pr-1">
                  {feature}
                  <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="hover:bg-primary/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card rounded-2xl">
          <CardHeader><CardTitle className="text-base">{t.advantages || 'Преимущества'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={advantageInput} onChange={(e) => setAdvantageInput(e.target.value)} placeholder={t.advantagesPlaceholder || 'Рядом метро...'} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAdvantage(); } }} className="h-10 bg-muted/30 border-0" />
              <Button type="button" size="icon" onClick={addAdvantage} className="h-10 w-10 rounded-xl"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {advantages.map((adv, i) => (
                <Badge key={i} variant="outline" className="bg-emerald-500/10 text-emerald-500 border-0 gap-1 pr-1">
                  {adv}
                  <button type="button" onClick={() => setAdvantages(advantages.filter((_, idx) => idx !== i))} className="hover:bg-emerald-500/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ✅ COMMERCIAL UCHUN QO'SHIMCHA */}
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
  <Card className="border-0 bg-card rounded-2xl">
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" /> Дополнительно для коммерции
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Способы оплаты</Label>
        <Textarea placeholder="Покупайте или арендуйте жилье с комфортом..." rows={3} {...register('paymentMethods')} className="bg-muted/30 border-0 resize-none" />
      </div>
      <div className="space-y-2">
        <Label>Похожие предложения</Label>
        <Textarea placeholder="Посмотрите похожие предложения рядом..." rows={3} {...register('similarOffers')} className="bg-muted/30 border-0 resize-none" />
      </div>
    </CardContent>
  </Card>
</motion.div>

      {/* ============================================================ 
          PUBLISHED 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card className="border-0 bg-card rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{t.publishedLabel || 'Показать на сайте'}</p>
              <p className="text-sm text-muted-foreground">{t.publishedHint || 'Объект виден пользователям'}</p>
            </div>
            <Controller
              name="published"
              control={control}
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================ 
          ACTIONS 
          ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-2xl">
        <Button type="button" variant="outline" onClick={() => (onCancel ? onCancel() : window.history.back())} disabled={isSubmitting} className="rounded-full">
          {t.cancel || 'Отмена'}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="rounded-full min-w-[140px]">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.saving || 'Сохранение...'}</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />{mode === 'create' ? (t.create || 'Создать') : (t.save || 'Сохранить')}</>
          )}
        </Button>
      </motion.div>
    </form>
  );
}