// ============================================================
// AUTH
// ============================================================
export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId?: number;           // ← QO'SHING
  permissions: string[];
  active?: boolean;          // ← QO'SHING
  createdAt?: string;        // ← QO'SHING
  updatedAt?: string;        // ← QO'SHING
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

// ============================================================
// PROPERTY
// ============================================================
export interface PropertyType {
  id: number;
  name: string;
  slug: string;
}

export interface Image {
  id: number;
  url: string;
  alt: string | null;
  order: number;
  isMain: boolean;
  propertyId: number | null;
  complexId: number | null;
  createdAt: string;
}

export interface Property {
  id: number;
  name: string;
  slug: string;
  typeId: number;
  complexId: number | null;
  apartmentNo?: string | null;
  rooms: number;
  area: number;
  floor: number;
  floorsTotal: number;
  price: number;
  priceM2: number;
  oldPrice: number | null;
  discount: number | null;
  status: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  features: string[];
  advantages: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  type?: PropertyType;
  complex?: ComplexShort;
  images?: Image[];
  videoUrl?: string;

  paymentMethods?: string;
  similarOffers?: string;
}

export interface ComplexShort {
  id: number;
  name: string;
  slug: string;
}

// ============================================================
// COMPLEX
// ============================================================
export interface Complex {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  district: string;
  builder: string;
  completionYear: number;
  status: string;
  buildings: number;
  floors: number;
  infrastructure: string[];
  advantages: string[];
  minPrice: number;
  maxPrice: number;
  lat: number;
  lng: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
  _count?: { properties: number };
}

// ============================================================
// USER
// ============================================================
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    favorites: number;
    views: number;
    applications: number;
  };
}

// ============================================================
// APPLICATION
// ============================================================
export type ApplicationStatus = 'new' | 'in_work' | 'done' | 'closed';

export interface Application {
  id: number;
  type: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  propertyId: number | null;
  userId: number | null;
  source: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  property?: { id: number; name: string } | null;
  projectId?: number;
  project?: { id: number; name: string };
}

// ============================================================
// PROMOTION
// ============================================================
export type PromotionStatus = 'active' | 'inactive' | 'hidden';

export interface Promotion {
  id: number;
  name: string;
  description: string;
  image: string | null;
  discount: number | null;
  startDate: string;
  endDate: string;
  status: PromotionStatus;
  createdAt: string;
  _count?: { properties: number };
}

// ============================================================
// REVIEW
// ============================================================
export interface Review {
  id: number;
  name: string;
  photo: string | null;
  text: string;
  rating: number;
  published: boolean;
  createdAt: string;
}

// ============================================================
// EMPLOYEE
// ============================================================
export interface Employee {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  hidden: boolean;
  order: number;
  createdAt: string;
}

// ============================================================
// SETTING
// ============================================================
export interface Setting {
  id: number;
  key: string;
  value: string;
  group: string;
  updatedAt: string;
}

export interface SettingsGrouped {
  [group: string]: {
    [key: string]: string;
  };
}

// ============================================================
// SEO
// ============================================================
export interface Seo {
  id: number;
  page: string;
  title: string;
  description: string;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  slug: string | null;
  updatedAt: string;
}

// ============================================================
// LOG
// ============================================================
export interface ActivityLog {
  id: number;
  adminId: number;
  action: string;
  entity: string;
  entityId: number | null;
  details: string | null;
  ip: string | null;
  createdAt: string;
  admin?: {
    id: number;
    name: string;
    email: string;
  };
}

// ============================================================
// STATS
// ============================================================
export interface DashboardStats {
  period: string;
  counts: {
    properties: {
      total: number;
      active: number;
      sold: number;
      booked: number;
    };
    complexes: number;
    users: number;
    applications: {
      total: number;
      new: number;
    };
    favorites: number;
    views: number;
  };
  period_stats: {
    applications: number;
    new_users: number;
    views: number;
    favorites: number;
  };
}

export interface ChartDataPoint {
  date: string;
  applications: number;
  users: number;
  views: number;
  favorites: number;
}

// ============================================================
// PAGINATION
// ============================================================
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


// ============================================================
// COMPLEX
// ============================================================
export interface ResidentialComplex {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  district: string;
  builder: string;
  completionYear: number;
  status: string;
  buildings: number;
  floors: number;
  infrastructure: string[];
  advantages: string[];
  minPrice: number;
  maxPrice: number;
  lat: number;
  lng: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
  _count?: { properties: number };
}


export interface ComplexShort {
  id: number;
  name: string;
}


// ============================================================
// ROLE
// ============================================================
export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
  createdAt: string;
}