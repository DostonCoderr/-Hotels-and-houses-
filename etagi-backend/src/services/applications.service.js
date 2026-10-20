const prisma = require('../config/db');

// ============================================================
// CREATE — zayavka yuborish (public)
// ============================================================
async function createApplication(data, userId = null) {
  const isProject = data.type === 'project';
  const application = await prisma.application.create({
    data: {
      type: data.type,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      // ✅ Agar loyiha bo'lsa projectId ga, aks holda propertyId ga yozamiz
      propertyId: !isProject ? (data.propertyId || null) : null,
      projectId: isProject ? (data.propertyId || null) : null,
      
      userId: userId || null,
      source: data.source || 'site',
      status: 'new',
    },
    include: {
      property: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });


   try {
    await prisma.notification.create({
      data: {
        title: 'Yangi zayavka',
        message: `${data.name} yangi zayavka yubordi`,
        type: 'application',
        link: '/applications', // Bosilganda shu yerga o'tadi
      },
    });
  } catch (err) {
    // Notification xatosi asosiy jarayonni to'xtatmasligi kerak
    console.error('❌ Notification create error:', err.message);
  }


  return application;
}

// ============================================================
// GET ALL — admin uchun ro'yxat
// ============================================================
async function getAllApplications(filters) {
  const {
    type, status, source, search, sort = 'newest',
    from, to, propertyId,
    page = 1, limit = 20,
  } = filters;

  const where = {};

  if (type) where.type = type;
  if (status) where.status = status;
  if (source) where.source = source;
  if (propertyId) where.propertyId = parseInt(propertyId);

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  switch (sort) {
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
    case 'name': orderBy = { name: 'asc' }; break;
    case 'newest':
    default: orderBy = { createdAt: 'desc' }; break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where, orderBy, skip, take,
      include: {
        property: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }, // ✅ Projectni qo'shdik
      },
    }),
    prisma.application.count({ where }),
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
async function getApplicationById(id) {
  const application = await prisma.application.findUnique({
    where: { id: parseInt(id) },
    include: {
      property: {
        include: {
          type: true,
          images: { orderBy: { order: 'asc' } },
        },
      },
      project: true,
    },
  });

  if (!application) {
    const err = new Error('Заявка не найдена');
    err.status = 404;
    throw err;
  }

  return application;
}

// ============================================================
// UPDATE STATUS
// ============================================================
async function updateStatus(id, status) {
  await getApplicationById(id);

  const allowed = ['new', 'in_work', 'done', 'closed'];
  if (!allowed.includes(status)) {
    const err = new Error('Неверный статус');
    err.status = 400;
    throw err;
  }

  return prisma.application.update({
    where: { id: parseInt(id) },
    data: { status },
  });
}

// ============================================================
// UPDATE — to'liq yangilash
// ============================================================
async function updateApplication(id, data) {
  await getApplicationById(id);

  return prisma.application.update({
    where: { id: parseInt(id) },
    data,
  });
}

// ============================================================
// DELETE
// ============================================================
async function deleteApplication(id) {
  await getApplicationById(id);
  await prisma.application.delete({ where: { id: parseInt(id) } });
  return { message: 'Заявка удалена' };
}

// ============================================================
// STATS — statistika
// ============================================================
async function getApplicationsStats() {
  const [
    total, newCount, inWork, done, closed,
    today, week, month,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: 'new' } }),
    prisma.application.count({ where: { status: 'in_work' } }),
    prisma.application.count({ where: { status: 'done' } }),
    prisma.application.count({ where: { status: 'closed' } }),
    prisma.application.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.application.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.application.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  // Type breakdown
  const byType = await prisma.application.groupBy({
    by: ['type'],
    _count: true,
  });

  return {
    total, new: newCount, in_work: inWork, done, closed,
    today, week, month,
    byType: byType.map(t => ({ type: t.type, count: t._count })),
  };
}

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateStatus,
  updateApplication,
  deleteApplication,
  getApplicationsStats,
};