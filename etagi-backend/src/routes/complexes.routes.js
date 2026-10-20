const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/complexes.controller');
const { requireAdmin, requirePermission } = require('../middleware/auth');

// ============================================================
// PUBLIC
// ============================================================
router.get('/', ctrl.getAll);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/:id', ctrl.getById);
router.get('/:id/stats', ctrl.getStats);

// ============================================================
// ADMIN
// ============================================================
router.post('/admin',
  requireAdmin, requirePermission('complexes:create'), ctrl.create);

router.put('/admin/:id',
  requireAdmin, requirePermission('complexes:update'), ctrl.update);

router.delete('/admin/:id',
  requireAdmin, requirePermission('complexes:delete'), ctrl.remove);

router.post('/admin/:id/toggle',
  requireAdmin, requirePermission('complexes:update'), ctrl.toggle);

module.exports = router;