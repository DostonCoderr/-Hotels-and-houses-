const { getActivityLogs } = require('../utils/activityLog');
const prisma = require('../config/db');

// ============================================================
// GET ALL LOGS
// ============================================================
async function getAllLogs(filters = {}) {
  return getActivityLogs(filters);
}

// ============================================================
// GET LOGS BY ADMIN
// ============================================================
async function getLogsByAdmin(adminId, filters = {}) {
  return getActivityLogs({ ...filters, adminId });
}

// ============================================================
// GET LOGS BY ENTITY
// ============================================================
// Endi getActivityLogs orqali — filtrlar (search, from, to, sort) saqlanadi
async function getLogsByEntity(entity, entityId, filters = {}) {
  return getActivityLogs({ ...filters, entity, entityId });
}

// ============================================================
// STATS
// ============================================================
async function getLogsStats() {
  const [
    total,
    today,
    week,
    month,
    byAction,
    byEntity,
    topAdmins,
  ] = await Promise.all([
    prisma.activityLog.count(),
    prisma.activityLog.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.activityLog.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.activityLog.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    // ✅ Prisma 5.22 uchun explicit _count
    prisma.activityLog.groupBy({
      by: ['action'],
      _count: { action: true },
    }),
    prisma.activityLog.groupBy({
      by: ['entity'],
      _count: { entity: true },
    }),
    prisma.activityLog.groupBy({
      by: ['adminId'],
      _count: { adminId: true },
      orderBy: { _count: { adminId: 'desc' } },
      take: 5,
    }),
  ]);

  // Top adminlar ma'lumotlarini olish
  const adminIds = topAdmins.map((a) => a.adminId).filter((id) => id != null);
  const admins = adminIds.length
    ? await prisma.admin.findMany({
        where: { id: { in: adminIds } },
        select: { id: true, name: true, email: true },
      })
    : [];

  return {
    total,
    today,
    week,
    month,
    byAction: byAction.map((a) => ({
      action: a.action,
      count: a._count.action,
    })),
    byEntity: byEntity.map((e) => ({
      entity: e.entity,
      count: e._count.entity,
    })),
    topAdmins: topAdmins
      .map((t) => {
        const admin = admins.find((a) => a.id === t.adminId);
        // O'chirilgan admin bo'lsa — filtrlash (frontend crash bo'lmasin)
        if (!admin) return null;
        return { admin, count: t._count.adminId };
      })
      .filter(Boolean),
  };
}

// ============================================================
// CLEAR OLD LOGS
// ============================================================
async function clearOldLogs(days = 90) {
  const daysNum = Math.max(1, parseInt(days) || 90);
  const cutoff = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);

  const result = await prisma.activityLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return {
    message: `Удалено ${result.count} старых записей`,
    deleted: result.count,
  };
}

module.exports = {
  getAllLogs,
  getLogsByAdmin,
  getLogsByEntity,
  getLogsStats,
  clearOldLogs,
};