const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/properties.controller');
const { requireAdmin, requirePermission } = require('../middleware/auth');

// ============================================================
// PUBLIC ROUTES (hamma ko'ra oladi)
// ============================================================

// GET /api/properties — ro'yxat
router.get('/', propertiesController.getAll);

// ⚠️ YANGI: GET /api/properties/:id/stats — statistika (CHART UCHUN)
router.get('/:id/stats', propertiesController.getStats);

// GET /api/properties/:id — bitta
router.get('/:id', propertiesController.getById);

// ============================================================
// ADMIN ROUTES (faqat admin)
// ============================================================

// POST /api/properties/admin — yaratish
router.post(
  '/admin',
  requireAdmin,
  requirePermission('properties:create'),
  propertiesController.create
);

// PUT /api/properties/admin/:id — yangilash
router.put(
  '/admin/:id',
  requireAdmin,
  requirePermission('properties:update'),
  propertiesController.update
);

// DELETE /api/properties/admin/:id — o'chirish
router.delete(
  '/admin/:id',
  requireAdmin,
  requirePermission('properties:delete'),
  propertiesController.remove
);

// POST /api/properties/admin/:id/duplicate — nusxalash
router.post(
  '/admin/:id/duplicate',
  requireAdmin,
  requirePermission('properties:create'),
  propertiesController.duplicate
);

module.exports = router;