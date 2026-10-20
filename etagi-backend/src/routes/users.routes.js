const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controller');
const { requireAdmin, requireAuth } = require('../middleware/auth');

// ============================================================
// PUBLIC (hamma uchun)
// ============================================================
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

// ============================================================
// USER (token bilan)
// ============================================================
router.get('/profile', requireAuth, ctrl.getProfile);
router.put('/profile', requireAuth, ctrl.updateProfile);

// ✅ FAVORITES (to'g'rilangan)
router.get('/favorites', requireAuth, ctrl.getMyFavorites);  // Ro'yxatni olish
router.post('/favorites', requireAuth, ctrl.addFavorite);    // Qo'shish
router.delete('/favorites/:propertyId', requireAuth, ctrl.removeFavorite); // O'chirish

// ✅ HISTORY
router.get('/history', requireAuth, ctrl.getMyHistory);

router.post('/views', requireAuth, ctrl.addView);
router.get('/scheduled', requireAuth, ctrl.getMyScheduled);
// ============================================================
// ADMIN (faqat admin)
// ============================================================
router.get('/', requireAdmin, ctrl.getAll);
router.get('/stats', requireAdmin, ctrl.getStats);
router.get('/:id', requireAdmin, ctrl.getById);
router.get('/:id/favorites', requireAdmin, ctrl.getFavorites);
router.get('/:id/views', requireAdmin, ctrl.getViews);
router.get('/:id/applications', requireAdmin, ctrl.getApplications);
router.post('/:id/block', requireAdmin, ctrl.block);
router.post('/:id/unblock', requireAdmin, ctrl.unblock);
router.delete('/:id', requireAdmin, ctrl.remove);

module.exports = router;