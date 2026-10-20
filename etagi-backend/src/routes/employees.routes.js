const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employees.controller');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// PUBLIC
// ============================================================
router.get('/', ctrl.getVisible);
router.get('/:id', ctrl.getById);

// ============================================================
// ADMIN
// ============================================================
router.get('/admin/all', requireAdmin, ctrl.getAll);
router.post('/admin', requireAdmin, ctrl.create);
router.put('/admin/:id', requireAdmin, ctrl.update);
router.delete('/admin/:id', requireAdmin, ctrl.remove);
router.post('/admin/:id/toggle', requireAdmin, ctrl.toggle);
router.post('/admin/reorder', requireAdmin, ctrl.reorder);

module.exports = router;