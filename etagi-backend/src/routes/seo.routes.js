const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/seo.controller');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// PUBLIC — OG data (frontend uchun)
// ============================================================
router.get('/og/:page', ctrl.getOg);

// ============================================================
// ADMIN
// ⚠️ Tartib muhim: '/' (bulk) '/:page' dan oldin turishi kerak
// ============================================================
router.get('/', requireAdmin, ctrl.getAll);
router.put('/', requireAdmin, ctrl.bulkUpsert);
router.get('/:page', requireAdmin, ctrl.getByPage);
router.put('/:page', requireAdmin, ctrl.upsert);
router.delete('/:page', requireAdmin, ctrl.remove);

module.exports = router;