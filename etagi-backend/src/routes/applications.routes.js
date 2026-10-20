const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/applications.controller');
const { requireAdmin, optionalAuth } = require('../middleware/auth');

// ============================================================
// PUBLIC — foydalanuvchi zayavka yuboradi
// ============================================================
// optionalAuth — agar user login bo'lsa, userId qo'shiladi
router.post('/', optionalAuth, ctrl.create);

// ============================================================
// ADMIN ROUTES
// ============================================================
router.get('/',
  requireAdmin, ctrl.getAll);

router.get('/stats',
  requireAdmin, ctrl.getStats);

router.get('/:id',
  requireAdmin, ctrl.getById);

router.put('/:id/status',
  requireAdmin, ctrl.updateStatus);

router.put('/:id',
  requireAdmin, ctrl.update);

router.delete('/:id',
  requireAdmin, ctrl.remove);

module.exports = router;