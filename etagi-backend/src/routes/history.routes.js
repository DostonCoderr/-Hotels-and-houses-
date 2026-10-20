const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/history.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// ============================================================
// USER ROUTES
// ============================================================
router.get('/', requireAuth, ctrl.getAll);
router.post('/', requireAuth, ctrl.add);
router.delete('/:id', requireAuth, ctrl.remove);
router.delete('/', requireAuth, ctrl.clear);

// ============================================================
// ADMIN
// ============================================================
router.get('/most-viewed', requireAdmin, ctrl.getMostViewed);

module.exports = router;