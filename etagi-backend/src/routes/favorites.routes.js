const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favorites.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// ============================================================
// USER ROUTES (requireAuth)
// ============================================================
router.get('/', requireAuth, ctrl.getAll);
router.get('/ids', requireAuth, ctrl.getIds);
router.post('/', requireAuth, ctrl.add);
router.delete('/:propertyId', requireAuth, ctrl.remove);
router.post('/:propertyId/toggle', requireAuth, ctrl.toggle);
router.delete('/', requireAuth, ctrl.clear);

// ============================================================
// ADMIN ROUTES
// ============================================================
router.get('/top', requireAdmin, ctrl.getTop);

module.exports = router;