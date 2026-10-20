const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/promotions.controller');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// PUBLIC
// ============================================================
router.get('/', ctrl.getAll);
router.get('/active', ctrl.getActive);
router.get('/:id', ctrl.getById);

// ============================================================
// ADMIN
// ============================================================
router.post('/admin', requireAdmin, ctrl.create);
router.put('/admin/:id', requireAdmin, ctrl.update);
router.delete('/admin/:id', requireAdmin, ctrl.remove);
router.post('/admin/:id/toggle', requireAdmin, ctrl.toggle);

module.exports = router;