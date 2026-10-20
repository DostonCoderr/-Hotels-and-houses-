const prisma = require('../config/db');

// ============================================================
// GET ALL — filter, sort, pagination
// ============================================================
async function getAllPromotions(filters = {}) {
  const {
    status, active, search, sort = 'newest',
    page = 1, limit = 20,
  } = filters;

  const where = {};

  if (status) where.status = status;
  if (active === 'true') {
    const now = new Date();
    where.status = 'active';
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  switch (sort) {
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
    case 'name': orderBy = { name: 'asc' }; break;
    case 'discount': orderBy = { discount: 'desc' }; break;
    case 'end_soon': orderBy = { endDate: 'asc' }; break;
    case 'newest':
    default: orderBy = { createdAt: 'desc' }; break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.promotion.findMany({
      where, orderBy, skip, take,
      include: {
        properties: {
          include: {
            type: true,
            images: { where: { isMain: true }, take: 1 },
          },
          take: 5,
        },
        _count: { select: { properties: true } },
      },
    }),
    prisma.promotion.count({ where }),
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
async function getPromotionById(id) {
  const promotion = await prisma.promotion.findUnique({
    where: { id: parseInt(id) },
    include: {
      properties: {
        include: {
          type: true,
          complex: { select: { id: true, name: true } },
          images: { orderBy: { order: 'asc' } },
        },
      },
      _count: { select: { properties: true } },
    },
  });

  if (!promotion) {
    const err = new Error('Акция не найдена');
    err.status = 404;
    throw err;
  }

  return promotion;
}

// ============================================================
// CREATE
// ============================================================
async function createPromotion(data) {
  const { propertyIds, ...promoData } = data;

  return prisma.promotion.create({
    data: {
      name: promoData.name,
      description: promoData.description,
      image: promoData.image || null,
      discount: promoData.discount || null,
      startDate: new Date(promoData.startDate),
      endDate: new Date(promoData.endDate),
      status: promoData.status || 'active',
      properties: propertyIds && propertyIds.length
        ? { connect: propertyIds.map(id => ({ id: parseInt(id) })) }
        : undefined,
    },
    include: {
      properties: { select: { id: true, name: true } },
      _count: { select: { properties: true } },
    },
  });
}

// ============================================================
// UPDATE
// ============================================================
async function updatePromotion(id, data) {
  await getPromotionById(id);

  const { propertyIds, ...promoData } = data;

  const updateData = { ...promoData };
  if (promoData.startDate) updateData.startDate = new Date(promoData.startDate);
  if (promoData.endDate) updateData.endDate = new Date(promoData.endDate);

  if (propertyIds !== undefined) {
    updateData.properties = {
      set: propertyIds.map(id => ({ id: parseInt(id) })),
    };
  }

  return prisma.promotion.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      properties: { select: { id: true, name: true } },
      _count: { select: { properties: true } },
    },
  });
}

// ============================================================
// DELETE
// ============================================================
async function deletePromotion(id) {
  await getPromotionById(id);
  await prisma.promotion.delete({ where: { id: parseInt(id) } });
  return { message: 'Акция удалена' };
}

// ============================================================
// TOGGLE STATUS (active / hidden)
// ============================================================
async function toggleStatus(id) {
  const promo = await getPromotionById(id);
  const newStatus = promo.status === 'active' ? 'hidden' : 'active';

  return prisma.promotion.update({
    where: { id: parseInt(id) },
    data: { status: newStatus },
    select: { id: true, name: true, status: true },
  });
}

// ============================================================
// GET ACTIVE — faol aksiyalar (public)
// ============================================================
async function getActivePromotions() {
  const now = new Date();

  return prisma.promotion.findMany({
    where: {
      status: 'active',
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      properties: {
        include: {
          type: true,
          images: { where: { isMain: true }, take: 1 },
        },
        take: 3,
      },
      _count: { select: { properties: true } },
    },
    orderBy: { endDate: 'asc' },
  });
}

module.exports = {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  toggleStatus,
  getActivePromotions,
};