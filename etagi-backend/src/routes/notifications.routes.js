const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// GET ALL (admin uchun)
// ============================================================
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { adminId: req.adminId },
          { adminId: null } // hamma uchun
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });

    const unreadCount = await prisma.notification.count({
      where: {
        isRead: false,
        OR: [
          { adminId: req.adminId },
          { adminId: null }
        ]
      },
    });

    res.json({ items: notifications, unreadCount });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// MARK ALL AS READ
// ============================================================
router.put('/read-all', requireAdmin, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: {
        isRead: false,
        OR: [
          { adminId: req.adminId },
          { adminId: null }
        ]
      },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// MARK ONE AS READ
// ============================================================
router.put('/:id/read', requireAdmin, async (req, res, next) => {
  try {
    await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;