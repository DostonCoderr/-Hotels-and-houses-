const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviews.controller');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// PUBLIC
// ============================================================
router.get('/', ctrl.getPublished);
router.post('/', ctrl.create);

// ============================================================
// ADMIN
// ============================================================
router.get('/admin', requireAdmin, ctrl.getAll);
router.get('/admin/stats', requireAdmin, ctrl.getStats);
router.put('/admin/:id', requireAdmin, ctrl.update);
router.put('/admin/:id/publish', requireAdmin, ctrl.togglePublish);
router.delete('/admin/:id', requireAdmin, ctrl.remove);

module.exports = router;