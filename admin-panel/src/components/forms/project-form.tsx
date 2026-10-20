'use client';

import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Loader2, Save, X, Plus, Hammer, Ruler, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from './image-uploader';

interface ProjectFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export function ProjectForm({ initialData, onSubmit, onCancel, mode = 'create' }: ProjectFormProps) {
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [featureInput, setFeatureInput] = useState('');

  // react-hook-form
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      area: initialData?.area || 0,
      floors: initialData?.floors || 1,
      bedrooms: initialData?.bedrooms || 1,
      bathrooms: initialData?.bathrooms || 1,
      material: initialData?.material || '',
      category: initialData?.category || 'project',
      
      // Yangi maydonlar
      terassa: initialData?.terassa || false,
      wallHeight: initialData?.wallHeight || 0,
      foundation: initialData?.foundation || '',
      roof: initialData?.roof || '',
      kitchenArea: initialData?.kitchenArea || 0,
      companyName: initialData?.companyName || '',
      companyExp: initialData?.companyExp || 0,
      companyDesc: initialData?.companyDesc || '',
      
      // Komplektatsiyalar (Default bo'sh massiv)
      packages: initialData?.packages || [
        { name: 'Холодный контур', price: 0, desc: 'от базовой цены' },
        { name: 'Черновая', price: 350000, desc: '+ 350 000 ₽' },
        { name: 'Предчистовая', price: 800000, desc: '+ 800 000 ₽' }
      ],
      
      published: initialData?.published ?? true,
    },
  });

  // Komplektatsiyalarni boshqarish uchun
  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit({ ...data, features });
  };

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* 1. Основная информация */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Hammer className="h-4 w-4 text-primary" /> Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название проекта *</Label>
              <Input placeholder="Барнхаус 6,8 х 7,2" {...register('name')} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Категория</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full h-11 px-3 rounded-md bg-muted/30 border-0 text-sm">
                    <option value="project">Проект</option>
                    <option value="barn">Барнхаус</option>
                    <option value="module">Модульный</option>
                    <option value="frame">Каркасный</option>
                    <option value="brick">Кирпичный</option>
                  </select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea placeholder="Заказать в России строительство дома под ключ..." rows={4} {...register('description')} className="bg-muted/30 border-0 resize-none" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Характеристики (Как на скриншоте) */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" /> Характеристики дома
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Цена (₽) *</Label>
              <Input type="number" {...register('price', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Площадь дома (м²) *</Label>
              <Input type="number" step="0.1" {...register('area', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Этажей</Label>
              <Input type="number" {...register('floors', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Материал стен</Label>
              <Input placeholder="Каркасные" {...register('material')} className="h-11 bg-muted/30 border-0" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Кол-во комнат</Label>
              <Input type="number" {...register('bedrooms', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Кол-во санузлов</Label>
              <Input type="number" {...register('bathrooms', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Площадь кухни (м²)</Label>
              <Input type="number" step="0.1" {...register('kitchenArea', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Высота стен (м)</Label>
              <Input type="number" step="0.1" {...register('wallHeight', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Фундамент</Label>
              <Input placeholder="Винтовые сваи" {...register('foundation')} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Кровля</Label>
              <Input placeholder="Металлочерепица" {...register('roof')} className="h-11 bg-muted/30 border-0" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <Controller 
              name="terassa" 
              control={control} 
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} 
            />
            <Label>Есть терраса</Label>
          </div>
        </CardContent>
      </Card>

      {/* 3. Комплектации (Как на 4-м скриншоте) */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Комплектации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-muted/20 rounded-xl relative">
              <div className="space-y-1 md:col-span-1">
                <Label className="text-xs">Название</Label>
                <Input {...register(`packages.${index}.name`)} placeholder="Холодный контур" className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Цена (₽)</Label>
                <Input type="number" {...register(`packages.${index}.price`)} placeholder="0" className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Текст (подпись)</Label>
                <Input {...register(`packages.${index}.desc`)} placeholder="от базовой цены" className="h-9" />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="h-9 w-full">
                  Удалить
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => append({ name: '', price: 0, desc: '' })} className="w-full rounded-xl border-dashed">
            <Plus className="h-4 w-4 mr-2" /> Добавить комплектацию
          </Button>
        </CardContent>
      </Card>

      {/* 4. О компании (Как на 5-м скриншоте) */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> О строительной компании
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Название компании</Label>
              <Input placeholder="Barn House Co" {...register('companyName')} className="h-11 bg-muted/30 border-0" />
            </div>
            <div className="space-y-2">
              <Label>Год основания</Label>
              <Input type="number" placeholder="2015" {...register('companyExp', { valueAsNumber: true })} className="h-11 bg-muted/30 border-0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Описание компании</Label>
            <Textarea placeholder="Компания строит загородные дома под ключ..." rows={3} {...register('companyDesc')} className="bg-muted/30 border-0 resize-none" />
          </div>
        </CardContent>
      </Card>

      {/* 5. Особенности */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Особенности / Преимущества</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input 
              value={featureInput} 
              onChange={(e) => setFeatureInput(e.target.value)} 
              placeholder="Гарантия 10 лет, Фиксированная цена..." 
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} 
              className="h-10 bg-muted/30 border-0" 
            />
            <Button type="button" size="icon" onClick={addFeature} className="h-10 w-10 rounded-xl">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((f, i) => (
              <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-0 gap-1 pr-1">
                {f}
                <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="hover:bg-primary/20 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Изображения */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Изображения</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader 
            projectId={initialData?.id} 
            entityType="project" 
            images={initialData?.images || []} 
            maxFiles={10} 
          />
        </CardContent>
      </Card>

      {/* 7. Published */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Показать на сайте</p>
            <p className="text-sm text-muted-foreground">Проект будет виден пользователям</p>
          </div>
          <Controller 
            name="published" 
            control={control} 
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} 
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-2xl">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="rounded-full">
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting} className="rounded-full min-w-[140px]">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> {mode === 'create' ? 'Создать' : 'Сохранить'}</>
          )}
        </Button>
      </div>
    </form>
  );
}