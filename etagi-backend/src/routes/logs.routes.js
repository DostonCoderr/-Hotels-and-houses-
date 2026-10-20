const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/logs.controller');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// ADMIN ONLY
// ============================================================
router.get('/', requireAdmin, ctrl.getAll);
router.get('/stats', requireAdmin, ctrl.getStats);
router.get('/admin/:adminId', requireAdmin, ctrl.getByAdmin);
router.get('/entity/:entity', requireAdmin, ctrl.getByEntity);
router.delete('/clear', requireAdmin, ctrl.clearOld);

module.exports = router;