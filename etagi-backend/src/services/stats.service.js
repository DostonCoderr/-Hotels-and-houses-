const prisma = require('../config/db');

// ============================================================
// HELPER — DATE RANGES
// ============================================================
function getDateRange(period) {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7d':
      start.setDate(now.getDate() - 7);
      break;
    case '30d':
      start.setDate(now.getDate() - 30);
      break;
    case '3m':
      start.setMonth(now.getMonth() - 3);
      break;
    case '1y':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setDate(now.getDate() - 7);
  }

  return { start, end: now };
}

// ============================================================
// DASHBOARD — asosiy statistika
// ============================================================
async function getDashboard(period = '7d') {
  const { start, end } = getDateRange(period);

  const [
    // Counts
    totalProperties,
    activeProperties,
    soldProperties,
    bookedProperties,
    totalComplexes,
    totalUsers,
    totalApplications,
    newApplications,
    totalFavorites,
    totalViews,

    // Period-specific
    periodApplications,
    periodUsers,
    periodViews,
    periodFavorites,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'available', published: true } }),
    prisma.property.count({ where: { status: 'sold' } }),
    prisma.property.count({ where: { status: 'booked' } }),
    prisma.residentialComplex.count(),
    prisma.user.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'new' } }),
    prisma.favorite.count(),
    prisma.viewingHistory.count(),

    prisma.application.count({
      where: { createdAt: { gte: start, lte: end } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: start, lte: end } },
    }),
    prisma.viewingHistory.count({
      where: { viewedAt: { gte: start, lte: end } },
    }),
    prisma.favorite.count({
      where: { createdAt: { gte: start, lte: end } },
    }),
  ]);

  return {
    period,
    counts: {
      properties: {
        total: totalProperties,
        active: activeProperties,
        sold: soldProperties,
        booked: bookedProperties,
      },
      complexes: totalComplexes,
      users: totalUsers,
      applications: {
        total: totalApplications,
        new: newApplications,
      },
      favorites: totalFavorites,
      views: totalViews,
    },
    period_stats: {
      applications: periodApplications,
      new_users: periodUsers,
      views: periodViews,
      favorites: periodFavorites,
    },
  };
}

// ============================================================
// CHART DATA — grafik uchun (kunlik)
// ============================================================
async function getChartData(period = '7d') {
  const { start, end } = getDateRange(period);

  // Kunlar sonini aniqlash
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const [applications, users, views, favorites] = await Promise.all([
    prisma.application.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true },
    }),
    prisma.viewingHistory.findMany({
      where: { viewedAt: { gte: start, lte: end } },
      select: { viewedAt: true },
    }),
    prisma.favorite.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true },
    }),
  ]);

  // Kunlik guruhlash
  const result = [];
  for (let i = 0; i < days; i++) {
    const dayStart = new Date(start);
    dayStart.setDate(start.getDate() + i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    result.push({
      date: dayStart.toISOString().split('T')[0],
      applications: applications.filter(a => a.createdAt >= dayStart && a.createdAt <= dayEnd).length,
      users: users.filter(u => u.createdAt >= dayStart && u.createdAt <= dayEnd).length,
      views: views.filter(v => v.viewedAt >= dayStart && v.viewedAt <= dayEnd).length,
      favorites: favorites.filter(f => f.createdAt >= dayStart && f.createdAt <= dayEnd).length,
    });
  }

  return result;
}

// ============================================================
// TOP PROPERTIES — eng mashhur obyektlar
// ============================================================
async function getTopProperties(limit = 10) {
  const [byViews, byFavorites] = await Promise.all([
    prisma.viewingHistory.groupBy({
      by: ['propertyId'],
      _count: { propertyId: true },
      orderBy: { _count: { propertyId: 'desc' } },
      take: parseInt(limit),
    }),
    prisma.favorite.groupBy({
      by: ['propertyId'],
      _count: { propertyId: true },
      orderBy: { _count: { propertyId: 'desc' } },
      take: parseInt(limit),
    }),
  ]);

  const allIds = [...new Set([
    ...byViews.map(v => v.propertyId),
    ...byFavorites.map(f => f.propertyId),
  ])];

  const properties = await prisma.property.findMany({
    where: { id: { in: allIds } },
    include: {
      type: true,
      images: { orderBy: { order: 'asc' } },
      complex: { select: { id: true, name: true } },
      _count: {
        select: { views: true, favorites: true, applications: true },
      },
    },
  });

  return properties.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    address: p.address,
    type: p.type.name,
    image: p.images[0]?.url || null,
    views: p._count.views,
    favorites: p._count.favorites,
    applications: p._count.applications,
  })).sort((a, b) => (b.views + b.favorites) - (a.views + a.favorites));
}

// ============================================================
// TOP COMPLEXES
// ============================================================
async function getTopComplexes(limit = 10) {
  const complexes = await prisma.residentialComplex.findMany({
    take: parseInt(limit),
    include: {
      images: { where: { isMain: true }, take: 1 },
      _count: { select: { properties: true } },
    },
  });

  return complexes.map(c => ({
    id: c.id,
    name: c.name,
    builder: c.builder,
    image: c.images[0]?.url || null,
    properties: c._count.properties,
    minPrice: c.minPrice,
    maxPrice: c.maxPrice,
  }));
}

// ============================================================
// APPLICATIONS BY TYPE
// ============================================================
async function getApplicationsByType() {
  const result = await prisma.application.groupBy({
    by: ['type'],
    _count: { type: true },
  });

  return result.map(r => ({
    type: r.type,
    count: r._count.type,
  }));
}

// ============================================================
// APPLICATIONS BY STATUS
// ============================================================
async function getApplicationsByStatus() {
  const result = await prisma.application.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return result.map(r => ({
    status: r.status,
    count: r._count.status,
  }));
}

// ============================================================
// PROPERTIES BY TYPE
// ============================================================
async function getPropertiesByType() {
  const types = await prisma.propertyType.findMany({
    include: {
      _count: { select: { properties: true } },
    },
  });

  return types.map(t => ({
    type: t.name,
    slug: t.slug,
    count: t._count.properties,
  }));
}

// ============================================================
// PRICE STATISTICS
// ============================================================
async function getPriceStats() {
  const [properties, complexes] = await Promise.all([
    prisma.property.aggregate({
      _min: { price: true, priceM2: true, area: true },
      _max: { price: true, priceM2: true, area: true },
      _avg: { price: true, priceM2: true, area: true },
      _count: true,
    }),
    prisma.residentialComplex.aggregate({
      _min: { minPrice: true },
      _max: { maxPrice: true },
      _avg: { minPrice: true, maxPrice: true },
      _count: true,
    }),
  ]);

  return {
    properties: {
      count: properties._count,
      minPrice: properties._min.price,
      maxPrice: properties._max.price,
      avgPrice: properties._avg.price,
      minPriceM2: properties._min.priceM2,
      maxPriceM2: properties._max.priceM2,
      avgPriceM2: properties._avg.priceM2,
      minArea: properties._min.area,
      maxArea: properties._max.area,
      avgArea: properties._avg.area,
    },
    complexes: {
      count: complexes._count,
      minPrice: complexes._min.minPrice,
      maxPrice: complexes._max.maxPrice,
      avgMinPrice: complexes._avg.minPrice,
      avgMaxPrice: complexes._avg.maxPrice,
    },
  };
}

// ============================================================
// RECENT ACTIVITY — oxirgi harakatlar
// ============================================================
async function getRecentActivity(limit = 20) {
  const [applications, users, favorites] = await Promise.all([
    prisma.application.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, name: true } },
      },
    }),
    prisma.user.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.favorite.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        property: { select: { id: true, name: true } },
      },
    }),
  ]);

  const activity = [
    ...applications.map(a => ({
      type: 'application',
      title: `Заявка от ${a.name}`,
      subtitle: a.property?.name || a.type,
      at: a.createdAt,
      icon: '📩',
    })),
    ...users.map(u => ({
      type: 'user',
      title: `Новый пользователь: ${u.name}`,
      subtitle: u.email,
      at: u.createdAt,
      icon: '👤',
    })),
    ...favorites.map(f => ({
      type: 'favorite',
      title: `${f.user.name} добавил в избранное`,
      subtitle: f.property.name,
      at: f.createdAt,
      icon: '❤️',
    })),
  ];

  return activity
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, parseInt(limit));
}

// ============================================================
// ACTIVITY LOGS (admin actions)
// ============================================================
async function getActivityLogs(filters = {}) {
  const { adminId, action, entity, page = 1, limit = 50 } = filters;

  const where = {};
  if (adminId) where.adminId = parseInt(adminId);
  if (action) where.action = action;
  if (entity) where.entity = entity;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

module.exports = {
  getDashboard,
  getChartData,
  getTopProperties,
  getTopComplexes,
  getApplicationsByType,
  getApplicationsByStatus,
  getPropertiesByType,
  getPriceStats,
  getRecentActivity,
  getActivityLogs,
};