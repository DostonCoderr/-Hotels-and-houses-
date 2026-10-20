const prisma = require('../config/db');

// ============================================================
// LOG ACTIVITY — admin harakatini jurnalga yozish
// ============================================================
async function logActivity(adminId, action, entity, entityId = null, details = null, req = null) {
  try {
    await prisma.activityLog.create({
      data: {
        adminId: parseInt(adminId),
        action, // create, update, delete, login, logout, upload
        entity, // property, complex, user, ...
        entityId: entityId ? parseInt(entityId) : null,
        details: details ? String(details).substring(0, 1000) : null,
        ip: req ? (req.ip || req.connection?.remoteAddress || null) : null,
      },
    });
  } catch (err) {
    console.error('❌ Activity log xatosi:', err.message);
  }
}

// ============================================================
// LOG HELPER — o'zgarishlarni taqqoslash
// ============================================================
async function logUpdate(adminId, entity, entityId, oldData, newData, req = null) {
  const changes = [];

  for (const key in newData) {
    if (oldData[key] !== newData[key] && typeof newData[key] !== 'object') {
      changes.push(`${key}: ${oldData[key]} → ${newData[key]}`);
    }
  }

  if (changes.length > 0) {
    await logActivity(
      adminId,
      'update',
      entity,
      entityId,
      changes.join(', '),
      req
    );
  }
}

// ============================================================
// GET ACTIVITY LOGS — TO'LIQ FILTRLASH
// ============================================================
async function getActivityLogs(filters = {}) {
  const {
    adminId,
    action,
    entity,
    entityId,
    search,
    from,
    to,
    sort,
    page = 1,
    limit = 50,
  } = filters;

  // -------- WHERE shartlari --------
  const where = {};

  if (adminId) {
    const parsed = parseInt(adminId);
    if (!Number.isNaN(parsed)) where.adminId = parsed;
  }
  if (action) where.action = String(action);
  if (entity) where.entity = String(entity);
  if (entityId) {
    const parsed = parseInt(entityId);
    if (!Number.isNaN(parsed)) where.entityId = parsed;
  }

  // -------- Sana oralig'i --------
  if (from || to) {
    where.createdAt = {};
    if (from) {
      const d = new Date(from);
      if (!Number.isNaN(d.getTime())) where.createdAt.gte = d;
    }
    if (to) {
      const d = new Date(to);
      if (!Number.isNaN(d.getTime())) where.createdAt.lte = d;
    }
    // Agar ikkalasi ham noto'g'ri bo'lsa — where.createdAt ni o'chirish
    if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
  }

  // -------- Qidiruv (search) --------
  // details, ip, admin.name, admin.email bo'yicha case-insensitive
  if (search && String(search).trim().length > 0) {
    const q = String(search).trim();
    where.OR = [
      { details: { contains: q, mode: 'insensitive' } },
      { ip: { contains: q, mode: 'insensitive' } },
      { admin: { name: { contains: q, mode: 'insensitive' } } },
      { admin: { email: { contains: q, mode: 'insensitive' } } },
    ];
  }

  // -------- Saralash --------
  // newest (default) | oldest
  const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  // -------- Pagination --------
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

module.exports = { logActivity, logUpdate, getActivityLogs };