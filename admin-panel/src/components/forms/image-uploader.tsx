'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Star,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UPLOADS_URL } from '@/lib/constants';
import type { Image } from '@/types';
import {
  uploadPropertyImages,
  uploadComplexImages,
  uploadProjectImages,
  deleteImage,
  setMainImage,
} from '@/lib/api-upload';
import { toast } from 'sonner';

interface ImageUploaderProps {
  propertyId?: number;
  complexId?: number;
  projectId?: number; // ✅ Qo'shildi
  images?: Image[];
  onChange?: (images: Image[]) => void;
  maxFiles?: number;
  entityType?: 'property' | 'complex' | 'project'; // ✅ 'project' qo'shildi
}

export function ImageUploader({
  propertyId,
  complexId,
  projectId,
  images: initialImages = [],
  onChange,
  maxFiles = 10,
  entityType = 'property',
}: ImageUploaderProps) {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ ProjectId ni ham hisobga olamiz
  const entityId = 
    entityType === 'property' ? propertyId : 
    entityType === 'complex' ? complexId : 
    projectId;

  const updateImages = (newImages: Image[]) => {
    setImages(newImages);
    onChange?.(newImages);
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!entityId) {
      toast.error('Avval saqlang, keyin rasm yuklang');
      return;
    }

    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (fileArray.length === 0) {
      toast.error('Faqat rasm fayllar');
      return;
    }

    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} ta rasm`);
      return;
    }

    try {
      setUploading(true);
      
      let newImages: Image[] = [];
      
      // ✅ Project uchun yuklash
      if (entityType === 'property') {
        newImages = await uploadPropertyImages(entityId, fileArray);
      } else if (entityType === 'complex') {
        newImages = await uploadComplexImages(entityId, fileArray);
      } else if (entityType === 'project') {
        newImages = await uploadProjectImages(entityId, fileArray);
      }

      updateImages([...images, ...newImages]);
      toast.success(`${newImages.length} ta rasm yuklandi`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm('Rasmni o\'chirishni tasdiqlaysizmi?')) return;

    try {
      await deleteImage(imageId);
      updateImages(images.filter((img) => img.id !== imageId));
      toast.success('Rasm o\'chirildi');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  const handleSetMain = async (imageId: number) => {
    try {
      await setMainImage(imageId);
      updateImages(
        images.map((img) => ({
          ...img,
          isMain: img.id === imageId,
        }))
      );
      toast.success('Asosiy rasm o\'zgartirildi');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Xatolik');
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => entityId && inputRef.current?.click()}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-8 transition-all',
          entityId ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border/50 hover:border-primary/50 hover:bg-muted/30',
          uploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-all',
              dragOver ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div>
            <p className="font-medium text-foreground">
              {uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Rasmni sudrab tashlang yoki bosing
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG · Maksimal {maxFiles} ta
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-muted"
              >
                <img
                  src={`${UPLOADS_URL}${image.url}`}
                  alt={image.alt || `Rasm ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {image.isMain && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Asosiy
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isMain && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetMain(image.id);
                      }}
                      className="h-8 w-8 rounded-full"
                      title="Asosiy qilish"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                    className="h-8 w-8 rounded-full"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {images.length} / {maxFiles} ta rasm
        </p>
      )}

      {!entityId && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-xs text-amber-600 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Rasm yuklash uchun avval {entityType === 'property' ? 'obyektni' : entityType === 'complex' ? 'ЖК ni' : 'loyihani'} saqlang
          </p>
        </div>
      )}
    </div>
  );
}