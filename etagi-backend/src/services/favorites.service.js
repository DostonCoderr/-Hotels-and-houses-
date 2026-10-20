const prisma = require('../config/db');

// ============================================================
// GET USER FAVORITES
// ============================================================
async function getUserFavorites(userId, filters = {}) {
  const { page = 1, limit = 20 } = filters;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: parseInt(userId) },
      include: {
        property: {
          include: {
            type: true,
            images: { orderBy: { order: 'asc' } },
            complex: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.favorite.count({ where: { userId: parseInt(userId) } }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// GET FAVORITE IDS (faqat ID lar — tezkor tekshirish uchun)
// ============================================================
async function getUserFavoriteIds(userId) {
  const favorites = await prisma.favorite.findMany({
    where: { userId: parseInt(userId) },
    select: { propertyId: true },
  });
  return favorites.map(f => f.propertyId);
}

// ============================================================
// ADD TO FAVORITES
// ============================================================
async function addToFavorites(userId, propertyId) {
  // Property mavjudligini tekshirish
  const property = await prisma.property.findUnique({
    where: { id: parseInt(propertyId) },
  });

  if (!property) {
    const err = new Error('Объект не найден');
    err.status = 404;
    throw err;
  }

  // Allaqachon qo'shilganmi?
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: parseInt(userId),
        propertyId: parseInt(propertyId),
      },
    },
  });

  if (existing) {
    return { message: 'Уже в избранном', favorite: existing };
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: parseInt(userId),
      propertyId: parseInt(propertyId),
    },
    include: {
      property: {
        include: {
          type: true,
          images: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  return { message: 'Добавлено в избранное', favorite };
}

// ============================================================
// REMOVE FROM FAVORITES
// ============================================================
async function removeFromFavorites(userId, propertyId) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: parseInt(userId),
        propertyId: parseInt(propertyId),
      },
    },
  });

  if (!favorite) {
    const err = new Error('Не найдено в избранном');
    err.status = 404;
    throw err;
  }

  await prisma.favorite.delete({
    where: { id: favorite.id },
  });

  return { message: 'Удалено из избранного' };
}

// ============================================================
// TOGGLE FAVORITE
// ============================================================
async function toggleFavorite(userId, propertyId) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: parseInt(userId),
        propertyId: parseInt(propertyId),
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { action: 'removed', inFavorites: false };
  } else {
    // Property mavjudligini tekshirish
    const property = await prisma.property.findUnique({
      where: { id: parseInt(propertyId) },
    });

    if (!property) {
      const err = new Error('Объект не найден');
      err.status = 404;
      throw err;
    }

    await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        propertyId: parseInt(propertyId),
      },
    });

    return { action: 'added', inFavorites: true };
  }
}

// ============================================================
// CLEAR ALL FAVORITES
// ============================================================
async function clearFavorites(userId) {
  await prisma.favorite.deleteMany({
    where: { userId: parseInt(userId) },
  });
  return { message: 'Избранное очищено' };
}

// ============================================================
// STATS — eng ko'p qo'shilgan obyektlar
// ============================================================
async function getTopFavorited(limit = 10) {
  const top = await prisma.favorite.groupBy({
    by: ['propertyId'],
    _count: { propertyId: true },
    orderBy: { _count: { propertyId: 'desc' } },
    take: parseInt(limit),
  });

  const propertyIds = top.map(t => t.propertyId);

  const properties = await prisma.property.findMany({
    where: { id: { in: propertyIds } },
    include: {
      type: true,
      images: { orderBy: { order: 'asc' } },
    },
  });

  return top.map(t => {
    const property = properties.find(p => p.id === t.propertyId);
    return {
      propertyId: t.propertyId,
      count: t._count.propertyId,
      property,
    };
  }).filter(t => t.property);
}

module.exports = {
  getUserFavorites,
  getUserFavoriteIds,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  getTopFavorited,
};