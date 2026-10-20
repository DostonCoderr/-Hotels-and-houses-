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
// GET ALL — filter, sort, pagination
// ============================================================
async function getAllComplexes(filters) {
  const {
    status, district, builder, minPrice, maxPrice,
    completionYear, search, sort = 'newest',
    page = 1, limit = 12,
  } = filters;

  const where = { published: true };

  if (status) where.status = status;
  if (district) where.district = { contains: district, mode: 'insensitive' };
  if (builder) where.builder = { contains: builder, mode: 'insensitive' };
  if (completionYear) where.completionYear = parseInt(completionYear);

  if (minPrice || maxPrice) {
    where.minPrice = {};
    if (minPrice) where.minPrice.gte = BigInt(minPrice);
    if (maxPrice) where.minPrice.lte = BigInt(maxPrice);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { builder: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  switch (sort) {
    case 'price_asc': orderBy = { minPrice: 'asc' }; break;
    case 'price_desc': orderBy = { minPrice: 'desc' }; break;
    case 'year_asc': orderBy = { completionYear: 'asc' }; break;
    case 'year_desc': orderBy = { completionYear: 'desc' }; break;
    case 'name': orderBy = { name: 'asc' }; break;
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
    case 'newest':
    default: orderBy = { createdAt: 'desc' }; break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.residentialComplex.findMany({
      where, orderBy, skip, take,
      include: {
        images: { orderBy: { order: 'asc' } },
        _count: { select: { properties: true } },
      },
    }),
    prisma.residentialComplex.count({ where }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// GET BY ID
// ============================================================
async function getComplexById(id) {
  const complex = await prisma.residentialComplex.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: { orderBy: { order: 'asc' } },
      properties: {
        where: { published: true },
        include: {
          type: true,
          images: { orderBy: { order: 'asc' } },
        },
        take: 20,
      },
      _count: { select: { properties: true } },
    },
  });

  if (!complex) {
    const err = new Error('ЖК не найден');
    err.status = 404;
    throw err;
  }

  return complex;
}

// ============================================================
// GET BY SLUG
// ============================================================
async function getComplexBySlug(slug) {
  const complex = await prisma.residentialComplex.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      properties: {
        where: { published: true },
        include: { type: true, images: true },
      },
      _count: { select: { properties: true } },
    },
  });

  if (!complex) {
    const err = new Error('ЖК не найден');
    err.status = 404;
    throw err;
  }

  return complex;
}

// ============================================================
// CREATE
// ============================================================
async function createComplex(data) {
  const slug = generateSlug(data.name);

  return prisma.residentialComplex.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      address: data.address,
      district: data.district,
      builder: data.builder,
      completionYear: data.completionYear,
      status: data.status || 'building',
      buildings: data.buildings || 1,
      floors: data.floors,
      infrastructure: data.infrastructure || [],
      advantages: data.advantages || [],
      minPrice: BigInt(data.minPrice),
      maxPrice: BigInt(data.maxPrice),
      lat: data.lat,
      lng: data.lng,
      published: data.published !== false,
    },
    include: { images: true, _count: { select: { properties: true } } },
  });
}

// ============================================================
// UPDATE
// ============================================================
async function updateComplex(id, data) {
  await getComplexById(id);

  const updateData = { ...data };
  if (data.minPrice) updateData.minPrice = BigInt(data.minPrice);
  if (data.maxPrice) updateData.maxPrice = BigInt(data.maxPrice);

  return prisma.residentialComplex.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: { images: true, _count: { select: { properties: true } } },
  });
}

// ============================================================
// DELETE
// ============================================================
async function deleteComplex(id) {
  await getComplexById(id);
  await prisma.residentialComplex.delete({ where: { id: parseInt(id) } });
  return { message: 'ЖК удалён' };
}

// ============================================================
// TOGGLE PUBLISHED
// ============================================================
async function togglePublished(id) {
  const complex = await getComplexById(id);
  return prisma.residentialComplex.update({
    where: { id: parseInt(id) },
    data: { published: !complex.published },
  });
}

// ============================================================
// STATS — ЖК statistikasi
// ============================================================
async function getComplexStats(id) {
  const complexId = parseInt(id);

  const [total, available, booked, sold, priceStats] = await Promise.all([
    prisma.property.count({ where: { complexId } }),
    prisma.property.count({ where: { complexId, status: 'available' } }),
    prisma.property.count({ where: { complexId, status: 'booked' } }),
    prisma.property.count({ where: { complexId, status: 'sold' } }),
    prisma.property.aggregate({
      where: { complexId },
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true, area: true },
    }),
  ]);

  return {
    total, available, booked, sold,
    minPrice: priceStats._min.price,
    maxPrice: priceStats._max.price,
    avgPrice: priceStats._avg.price,
    avgArea: priceStats._avg.area,
  };
}

module.exports = {
  getAllComplexes,
  getComplexById,
  getComplexBySlug,
  createComplex,
  updateComplex,
  deleteComplex,
  togglePublished,
  getComplexStats,
};