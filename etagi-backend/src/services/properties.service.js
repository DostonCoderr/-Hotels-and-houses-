const prisma = require('../config/db');

// ============================================================
// SLUG GENERATOR
// ============================================================
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36);
}

// ============================================================
// GET ALL (filter, sort, pagination)
// ============================================================
async function getAllProperties(filters) {
  const {
    type, rooms, minPrice, maxPrice, minArea, maxArea,
    complexId, status, search, sort = 'newest',
    page = 1, limit = 12,
  } = filters;

  const where = { published: true };

  // Type filter (slug or name)
  if (type) {
    where.type = { slug: type };
  }

  // Rooms
  if (rooms !== undefined && rooms !== '') {
    where.rooms = parseInt(rooms);
  }

  // Price range
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = BigInt(minPrice);
    if (maxPrice) where.price.lte = BigInt(maxPrice);
  }

  // Area range
  if (minArea || maxArea) {
    where.area = {};
    if (minArea) where.area.gte = parseFloat(minArea);
    if (maxArea) where.area.lte = parseFloat(maxArea);
  }

  // Complex
  if (complexId) {
    where.complexId = parseInt(complexId);
  }

  // Status
  if (status) {
    where.status = status;
  }

  // Search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Sort
  let orderBy = { createdAt: 'desc' };
  switch (sort) {
    case 'price_asc': orderBy = { price: 'asc' }; break;
    case 'price_desc': orderBy = { price: 'desc' }; break;
    case 'area_asc': orderBy = { area: 'asc' }; break;
    case 'area_desc': orderBy = { area: 'desc' }; break;
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
    case 'newest':
    default: orderBy = { createdAt: 'desc' }; break;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Query
  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        type: true,
        complex: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// GET BY ID
// ============================================================
async function getPropertyById(id) {
  const property = await prisma.property.findUnique({
    where: { id: parseInt(id) },
    include: {
      type: true,
      complex: {
        include: {
          images: { orderBy: { order: 'asc' } },
        },
      },
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!property) {
    const err = new Error('Объект не найден');
    err.status = 404;
    throw err;
  }

  return property;
}

// ============================================================
// CREATE
// ============================================================
async function createProperty(data) {
  const slug = generateSlug(data.name);

  const property = await prisma.property.create({
    data: {
      name: data.name,
      slug,
      typeId: data.typeId,
      complexId: data.complexId || null,
      apartmentNo: data.apartmentNo || null,
      rooms: data.rooms,
      area: data.area,
      floor: data.floor,
      floorsTotal: data.floorsTotal,
      price: BigInt(data.price),
      priceM2: BigInt(data.priceM2),
      oldPrice: data.oldPrice ? BigInt(data.oldPrice) : null,
      discount: data.discount || null,
      status: data.status || 'available',
      description: data.description,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      features: data.features || [],
      advantages: data.advantages || [],
      published: data.published !== false,


      // YANGI MAYDONLAR
      imo: data.imo,
      wall: data.wall,
      cls: data.cls,
      metro: data.metro,
      metroTime: data.metroTime,
      metroDist: data.metroDist,
      progressPhotos: data.progressPhotos || [],
      genplan: data.genplan || null,

       completionDate: data.completionDate,
      constructionStatus: data.constructionStatus,
      reviewsCount: data.reviewsCount || 0,
      rating: data.rating || 5.0,
      declarations: data.declarations || null,
      videoUrl: data.videoUrl || null,
      videos: data.videos || [],

      paymentMethods: data.paymentMethods || null,
      similarOffers: data.similarOffers || null,
    },
    include: {
      type: true,
      complex: true,
      images: true,
    },
  });

  return property;
}

// ============================================================
// UPDATE
// ============================================================
async function updateProperty(id, data) {
  // Check exists
  await getPropertyById(id);

  const updateData = { ...data };
  if (data.price) updateData.price = BigInt(data.price);
  if (data.priceM2) updateData.priceM2 = BigInt(data.priceM2);
  if (data.oldPrice) updateData.oldPrice = BigInt(data.oldPrice);

  const property = await prisma.property.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      type: true,
      complex: true,
      images: true,
    },
  });

  return property;
}

// ============================================================
// DELETE
// ============================================================
async function deleteProperty(id) {
  await getPropertyById(id);
  await prisma.property.delete({ where: { id: parseInt(id) } });
  return { message: 'Объект удалён' };
}

// ============================================================
// DUPLICATE
// ============================================================
// ============================================================
// DUPLICATE
// ============================================================
async function duplicateProperty(id) {
  const original = await getPropertyById(id);

  const newSlug = generateSlug(original.name + ' копия');

  const copy = await prisma.property.create({
    data: {
      // Asosiy maydonlar
      name: original.name + ' (копия)',
      slug: newSlug,
      typeId: original.typeId,
      complexId: original.complexId,
      apartmentNo: original.apartmentNo,
      rooms: original.rooms,
      area: original.area,
      floor: original.floor,
      floorsTotal: original.floorsTotal,
      price: original.price,
      priceM2: original.priceM2,
      oldPrice: original.oldPrice,
      discount: original.discount,
      status: original.status,
      description: original.description,
      address: original.address,
      lat: original.lat,
      lng: original.lng,
      features: original.features,
      advantages: original.advantages,
      published: false,
      // MUHIM: type, complex, images — OLIB TASHLANDI!
      // Faqat ID'lar qoldirildi (typeId, complexId)


      // Yangi maydonlarni ham nusxalash
      imo: original.imo,
      wall: original.wall,
      cls: original.cls,
      metro: original.metro,
      metroTime: original.metroTime,
      metroDist: original.metroDist,
      videos: data.videos || [],
      progressPhotos: original.progressPhotos,
      genplan: original.genplan,
      completionDate: original.completionDate,
      constructionStatus: original.constructionStatus,
      reviewsCount: original.reviewsCount,
      rating: original.rating,
      declarations: original.declarations,
      videoUrl: data.videoUrl || null,

      paymentMethods: original.paymentMethods,
      similarOffers: original.similarOffers,
    },
    include: {
      type: true,
      complex: true,
      images: true,
    },
  });

  return copy;
}



// ============================================================
// GET STATS — Haqiqiy statistika va 90 kunlik grafik
// ============================================================

async function getPropertyStats(id) {
  const propertyId = parseInt(id);

  // 1. Oxirgi 90 kunlik sanani aniqlash
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 89);
  startDate.setHours(0, 0, 0, 0);

  // 2. BAZADAN BARCHA MA'LUMOTLARNI 1 MARTA OLISH (PARALLEL)
  const [allViews, allFavorites, allApps, allScheduled, propertyStats] = await Promise.all([
    prisma.viewingHistory.findMany({
      where: { propertyId, viewedAt: { gte: startDate } },
      select: { viewedAt: true },
    }),
    prisma.favorite.findMany({
      where: { propertyId, createdAt: { gte: startDate } },
      select: { createdAt: true },
    }),
    // ✅ Oddiy zayavkalar (scheduled dan tashqari)
    prisma.application.findMany({
      where: { 
        propertyId, 
        createdAt: { gte: startDate },
        NOT: { type: 'scheduled' } 
      },
      select: { createdAt: true },
    }),
    // ✅ Rejalashtirilgan ko'rishlar (faqat scheduled)
    prisma.application.findMany({
      where: { 
        propertyId, 
        type: 'scheduled',
        createdAt: { gte: startDate } 
      },
      select: { createdAt: true },
    }),
    // Umumiy raqamlar
    prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        _count: {
          select: { views: true, favorites: true, applications: true }
        }
      }
    })
  ]);

  // 3. KUNLIK DINAMIKANI HISOBLASH
  const dailyStats = [];
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const label = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;

    const isSameDay = (d1, d2) => 
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const dayViews = allViews.filter(v => isSameDay(new Date(v.viewedAt), date)).length;
    const dayFavs = allFavorites.filter(f => isSameDay(new Date(f.createdAt), date)).length;
    const dayApps = allApps.filter(a => isSameDay(new Date(a.createdAt), date)).length;
    const dayScheduled = allScheduled.filter(s => isSameDay(new Date(s.createdAt), date)).length;

    dailyStats.push({
      label,
      views: dayViews,
      favorites: dayFavs,
      inquiries: dayApps,
      scheduled: dayScheduled,
    });
  }

  // ✅ Umumiy scheduled soni (barcha vaqt bo'yicha)
  const totalScheduled = await prisma.application.count({
    where: { propertyId, type: 'scheduled' }
  });

  // ✅ Oddiy zayavkalar soni (scheduled dan tashqari)
  const totalInquiries = await prisma.application.count({
    where: { propertyId, NOT: { type: 'scheduled' } }
  });

  // 4. Javob qaytarish
  return {
    views: propertyStats?._count?.views || 0,
    favorites: propertyStats?._count?.favorites || 0,
    inquiries: totalInquiries,
    scheduled: totalScheduled,
    daily: dailyStats,
  };
}

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
  getPropertyStats,
};