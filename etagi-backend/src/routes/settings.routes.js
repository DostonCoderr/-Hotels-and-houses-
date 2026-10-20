const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settings.controller');
const { requireAdmin, optionalAuth } = require('../middleware/auth');

// ============================================================
// PUBLIC — asosiy sozlamalar (telefon, email, social)
// ============================================================
router.get('/public', async (req, res, next) => {
  try {
    const contacts = await require('../services/settings.service').getSettingsByGroup('contacts');
    const general = await require('../services/settings.service').getSettingsByGroup('general');
    const display = await require('../services/settings.service').getSettingsByGroup('display');
    res.json({ general, contacts, display });
  } catch (err) { next(err); }
});

// ============================================================
// ADMIN
// ============================================================
router.get('/', requireAdmin, ctrl.getAll);
router.get('/group/:group', requireAdmin, ctrl.getByGroup);
router.get('/:key', requireAdmin, ctrl.getOne);
router.post('/', requireAdmin, ctrl.set);
router.post('/bulk', requireAdmin, ctrl.setMany);
router.delete('/:key', requireAdmin, ctrl.remove);

module.exports = router;