import { Property } from '@/lib/api-properties';
import { NovostroykaDetail } from '@/lib/types';

function getYoutubeId(url: string | undefined) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function propertyToNovostroykaDetail(p: Property): NovostroykaDetail {
  const mainImg = p.images?.find((i) => i.isMain)?.url || p.images?.[0]?.url || '';
  
  const ytId = getYoutubeId(p.videoUrl);
  const videoList = ytId ? [{ id: ytId, title: p.name, cover: mainImg }] : [];

  const declarationsList = p.declarations 
    ? String(p.declarations).split(',').map((d: string) => ({ title: d.trim(), url: '#' })) 
    : [];

  return {
    id: p.id,
    name: p.name,
    sub: p.description?.slice(0, 120) || '',
    address: p.address,
    price: p.price,
    m2Price: p.priceM2 || 0,
    area: p.area,
    rooms: p.rooms?.toString() || 'Студия',
    
    // ✅ XATO SHU YERDA EDI: p.status emas, p.completionDate bo'lishi kerak!
    info: p.completionDate || 'Сдача 2026', 
    
    roomsCount: p.rooms || 1,
    isNew: true,
    date: Date.now(),

    slides: p.images?.map((i) => i.url) || [mainImg],
    img: mainImg,
    
    descShort: p.description?.slice(0, 300) || '',
    descFull: p.description || '',
    
    builder: p.complex?.name || 'Застройщик',
    imo: p.imo || 'ЖК', 
    wall: p.wall || '-', 
    cls: p.cls || '-', 
    metro: p.metro || '-', 
    lat: p.lat || 41.311081,
    lng: p.lng || 69.240562,
    
    flats: [], 
    houseChips: p.features || [], 
    complexChips: p.advantages || [], 
    
    videos: videoList, 
    
    progressPhotos: p.progressPhotos || [],
    genplan: p.genplan || { img: mainImg, title: p.name, status: p.status, keys: '', items: [] },
    
    declarations: declarationsList,

    reviewsCount: p.reviewsCount || 0,
    rating: p.rating || 5.0,
    
    // ✅ Bularni ham qo'shdik
    completionDate: p.completionDate || 'Сдача 2026',
    constructionStatus: p.constructionStatus || 'Идет строительство',
  };
}