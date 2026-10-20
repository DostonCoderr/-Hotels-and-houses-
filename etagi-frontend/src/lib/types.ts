export interface NovostroykaDetail {
  id: number;
  name: string;
  sub: string;
  address: string;
  price: number;
  m2Price: number;
  area: number;
  rooms: string;
  info: string;
  
  // Majburiy maydonlar (sayt dizayni uchun kerak)
  roomsCount: number;
  isNew: boolean;
  date: number;

  slides: string[];
  img: string;
  descShort: string;
  descFull: string;
  
  // Backenddan keladigan meta
  builder: string;
  imo: string;
  wall: string;
  cls: string;
  metro: string;
  lat: number;
  lng: number;
  
  flats: any[];
  houseChips: string[];
  complexChips: string[];
  videos: { id: string; title: string; cover: string }[];
  progressPhotos: any[];
  genplan: any;

  // Yangi qo'shilgan maydonlar (Admin panelda bor)
  declarations?: { title: string; url: string }[];
  reviewsCount?: number;
  rating?: number;
  completionDate?: string;
  constructionStatus?: string;
}


export interface Property {
  id: number;
  name: string;
  address: string;
  metro?: string;
  price: number;          // ✅ majburiy
  rooms?: number;         // ixtiyoriy
  area: number;           // ✅ majburiy
  lat: number;            // ✅ majburiy
  lng: number;            // ✅ majburiy
  img?: string;
  images?: { url: string }[];
  type?: 'new' | 'house' | 'com' | string;
  completionDate?: string;
  imo?: string;
  complex?: { name: string };
  floor?: number;
}


export interface TeamMember {
  id: number;
  name: string;
  role: string;
  img: string;
  linkedin?: string;    // ✅ QO'SHILDI
  telegram?: string;    // ✅ QO'SHILDI
}