import { z } from 'zod';

// ============================================================
// LOGIN
// ============================================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email kiritilishi shart')
    .email("Email formati noto'g'ri"),
  password: z
    .string()
    .min(1, 'Parol kiritilishi shart')
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

// ============================================================
// PROPERTY
// ============================================================
export const propertySchema = z.object({
  name: z.string().min(3, 'Nomi kamida 3 ta belgi'),
  typeId: z.number().int().positive('Tur tanlanishi shart'),
  complexId: z.number().int().nullable().optional(),
  apartmentNo: z.string().optional().nullable(),
  rooms: z.number().int().min(0, 'Kamida 0 xona'),
  area: z.number().positive('Maydon 0 dan katta'),
  floor: z.number().int().min(0, 'Qavat 0 dan boshlanadi'),
  floorsTotal: z.number().int().min(1, 'Umumiy qavat kamida 1'),
  price: z.number().positive('Narx 0 dan katta'),
  priceM2: z.number().positive('M² narxi 0 dan katta'),
  oldPrice: z.number().nullable().optional(),
  discount: z.number().int().min(0).max(100).nullable().optional(),
  status: z.enum(['available', 'booked', 'sold']),
  description: z.string().optional(),
  address: z.string().min(1, 'Адрес обязателен'),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  features: z.array(z.string()).optional(),
  advantages: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  imo: z.string().optional(),
wall: z.string().optional(),
cls: z.string().optional(),
metro: z.string().optional(),
metroTime: z.string().optional(),
metroDist: z.string().optional(),
completionDate: z.string().optional(),
  constructionStatus: z.string().optional(),
  reviewsCount: z.number().optional(),
  rating: z.number().optional(),
  declarations: z.string().optional(), 
  videoUrl: z.string().optional(),

  paymentMethods: z.string().optional().or(z.literal('')),
  similarOffers: z.string().optional().or(z.literal('')),
});

// ============================================================
// COMPLEX (ЖК)
// ============================================================
export const complexSchema = z.object({
  name: z.string().min(3, 'Nomi kamida 3 ta belgi'),
  description: z.string().min(10, 'Tavsif kamida 10 ta belgi'),
  address: z.string().min(5, 'Manzil kamida 5 ta belgi'),
  district: z.string().min(2, 'Tuman kamida 2 ta belgi'),
  builder: z.string().min(2, 'Quruvchi kamida 2 ta belgi'),
  completionYear: z
    .number()
    .int()
    .min(2020, 'Yil 2020 dan katta')
    .max(2050, 'Yil 2050 dan kichik'),
  status: z.enum(['building', 'completed', 'planned']),
  buildings: z.number().int().min(1, 'Kamida 1 ta bino'),
  floors: z.number().int().min(1, 'Kamida 1 ta qavat'),
  infrastructure: z.array(z.string()).default([]),
  advantages: z.array(z.string()).default([]),
  minPrice: z.number().positive('Min narx 0 dan katta'),
  maxPrice: z.number().positive('Max narx 0 dan katta'),
  lat: z.number(),
  lng: z.number(),
  published: z.boolean().default(true),
});

// ============================================================
// PROMOTION
// ============================================================
export const promotionSchema = z.object({
  name: z.string().min(3, 'Nomi kamida 3 ta belgi'),
  description: z.string().min(10, 'Tavsif kamida 10 ta belgi'),
  discount: z
    .number()
    .int()
    .min(0, 'Chegirma 0 dan katta')
    .max(100, 'Chegirma 100 dan kichik')
    .nullable()
    .optional(),
  startDate: z.string().min(1, 'Boshlanish sanasi shart'),
  endDate: z.string().min(1, 'Tugash sanasi shart'),
  status: z.enum(['active', 'inactive', 'hidden']),
  image: z.string().nullable().optional(),
});

// ============================================================
// EMPLOYEE
// ============================================================
export const employeeSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgi'),
  position: z.string().min(2, 'Lavozim kamida 2 ta belgi'),
  photo: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z
    .string()
    .email("Email formati noto'g'ri")
    .nullable()
    .optional()
    .or(z.literal('')),
  description: z.string().nullable().optional(),
  hidden: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type PromotionFormData = z.infer<typeof promotionSchema>;
export type ComplexFormData = z.infer<typeof complexSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;