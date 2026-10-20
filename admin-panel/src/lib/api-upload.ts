import { api, getToken } from '@/lib/api';
import type { Image } from '@/types';

// ============================================================
// UPLOAD PROPERTY IMAGES
// ============================================================
export async function uploadPropertyImages(
  propertyId: number,
  files: File[]
): Promise<Image[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const { data } = await api.post(
    `/upload/properties/${propertyId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data.images || [];
}

// ============================================================
// UPLOAD COMPLEX IMAGES
// ============================================================
export async function uploadComplexImages(
  complexId: number,
  files: File[]
): Promise<Image[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const { data } = await api.post(
    `/upload/complexes/${complexId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data.images || [];
}

// ============================================================
// ✅ UPLOAD PROJECT IMAGES (YANGI QO'SHILDI)
// ============================================================
export async function uploadProjectImages(
  projectId: number,
  files: File[]
): Promise<Image[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const { data } = await api.post(
    `/upload/projects/${projectId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data.images || [];
}

// ============================================================
// DELETE IMAGE
// ============================================================
export async function deleteImage(imageId: number): Promise<void> {
  await api.delete(`/upload/images/${imageId}`);
}

// ============================================================
// SET MAIN IMAGE
// ============================================================
export async function setMainImage(imageId: number): Promise<void> {
  await api.post(`/upload/images/${imageId}/main`);
}

// ============================================================
// REORDER IMAGES
// ============================================================
export async function reorderImages(
  orders: { id: number; order: number }[]
): Promise<void> {
  await api.post('/upload/images/reorder', { orders });
}

// ============================================================
// UPLOAD EMPLOYEE PHOTO
// ============================================================
export async function uploadEmployeePhoto(
  employeeId: number,
  file: File
): Promise<{ employee: any; photo: string }> {
  const formData = new FormData();
  formData.append('photo', file);

  const { data } = await api.post(
    `/upload/employees/${employeeId}/photo`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}