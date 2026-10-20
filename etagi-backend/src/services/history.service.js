const prisma = require('../config/db');

// ============================================================
// GET USER HISTORY
// ============================================================
async function getUserHistory(userId, filters = {}) {
  const { page = 1, limit = 30 } = filters;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.viewingHistory.findMany({
      where: { userId: parseInt(userId) },
      include: {
        property: {
          include: {
            type: true,
            images: { orderBy: { order: 'asc' } },
            complex: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
      skip,
      take,
    }),
    prisma.viewingHistory.count({ where: { userId: parseInt(userId) } }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// ADD TO HISTORY (view)
// ============================================================
async function addToHistory(userId, propertyId) {
  // Property mavjudligini tekshirish
  const property = await prisma.property.findUnique({
    where: { id: parseInt(propertyId) },
  });

  if (!property) {
    const err = new Error('Объект не найден');
    err.status = 404;
    throw err;
  }

  // Bir xil property oxirgi 1 soat ichida ko'rilganmi?
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await prisma.viewingHistory.findFirst({
    where: {
      userId: parseInt(userId),
      propertyId: parseInt(propertyId),
      viewedAt: { gte: oneHourAgo },
    },
  });

  if (recent) {
    // Vaqtni yangilash
    return prisma.viewingHistory.update({
      where: { id: recent.id },
      data: { viewedAt: new Date() },
    });
  }

  // Yangi yozuv
  const history = await prisma.viewingHistory.create({
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

  // Eski yozuvlarni tozalash (100 tadan ko'p bo'lsa)
  const count = await prisma.viewingHistory.count({
    where: { userId: parseInt(userId) },
  });

  if (count > 100) {
    const oldest = await prisma.viewingHistory.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { viewedAt: 'asc' },
      take: count - 100,
    });

    await prisma.viewingHistory.deleteMany({
      where: { id: { in: oldest.map(o => o.id) } },
    });
  }

  return history;
}

// ============================================================
// REMOVE ONE
// ============================================================
async function removeFromHistory(userId, historyId) {
  const item = await prisma.viewingHistory.findFirst({
    where: {
      id: parseInt(historyId),
      userId: parseInt(userId),
    },
  });

  if (!item) {
    const err = new Error('Запись не найдена');
    err.status = 404;
    throw err;
  }

  await prisma.viewingHistory.delete({ where: { id: item.id } });
  return { message: 'Запись удалена' };
}

// ============================================================
// CLEAR HISTORY
// ============================================================
async function clearHistory(userId) {
  await prisma.viewingHistory.deleteMany({
    where: { userId: parseInt(userId) },
  });
  return { message: 'История очищена' };
}

// ============================================================
// STATS — eng ko'p ko'rilgan obyektlar
// ============================================================
async function getMostViewed(limit = 10) {
  const top = await prisma.viewingHistory.groupBy({
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
      views: t._count.propertyId,
      property,
    };
  }).filter(t => t.property);
}

module.exports = {
  getUserHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getMostViewed,
};