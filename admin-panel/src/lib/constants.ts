// ============================================================
// API
// ============================================================
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL =
  process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

// ============================================================
// PAGINATION
// ============================================================
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================================
// STATUS RANG'LARI
// ============================================================
export const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-500/10 text-emerald-500',
  booked: 'bg-amber-500/10 text-amber-500',
  sold: 'bg-rose-500/10 text-rose-500',
  new: 'bg-blue-500/10 text-blue-500',
  in_work: 'bg-amber-500/10 text-amber-500',
  done: 'bg-emerald-500/10 text-emerald-500',
  closed: 'bg-muted text-muted-foreground',
  active: 'bg-emerald-500/10 text-emerald-500',
  inactive: 'bg-muted text-muted-foreground',
  hidden: 'bg-rose-500/10 text-rose-500',
};



// ============================================================
// PROPERTY TYPES (Turlar)
// ============================================================
export const PROPERTY_TYPES = [
  { value: 1, label: 'typeApartment' }, // Kvartira
  { value: 2, label: 'typeStudio' },    // Studiya
  { value: 3, label: 'typeHouse' },     // Uy
  { value: 4, label: 'typeOffice' },    // Ofis
  { value: 5, label: 'typeShop' },      // Do'kon
  { value: 6, label: 'typeParking' },   // Parkovka
  { value: 7, label: 'typeGarage' },    // Garaj
  { value: 8, label: 'typeStorage' },   // Kladovka
];

// ============================================================
// PROPERTY STATUSES (Holatlar)
// ============================================================
export const PROPERTY_STATUSES: Array<{
  value: 'available' | 'booked' | 'sold';
  label: string;
  bg: string;
  color: string;
}> = [
  { value: 'available', label: 'available', bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
  { value: 'booked', label: 'booked', bg: 'bg-amber-500/10', color: 'text-amber-500' },
  { value: 'sold', label: 'sold', bg: 'bg-rose-500/10', color: 'text-rose-500' },
];