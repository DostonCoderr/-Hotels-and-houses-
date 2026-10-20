const express = require('express');
const router = express.Router();
const controller = require('../controllers/admins.controller');
const { requireAdmin } = require('../middleware/auth');  // ⚠️ FAQAT requireAdmin
const { upload } = require('../middleware/upload');

// ============================================================
// ROLES (public)
// ============================================================
router.get('/roles', controller.getRoles);

// ============================================================
// ME (o'z profili) — FAQAT requireAdmin
// ============================================================
router.get('/me', requireAdmin, controller.getMe);
router.put('/me', requireAdmin, controller.updateMe);
router.post(
  '/me/avatar',
  requireAdmin,
  upload.single('avatar'),
  controller.uploadMyAvatar
);
router.delete('/me/avatar', requireAdmin, controller.deleteMyAvatar);
router.put('/me/password', requireAdmin, controller.changeMyPassword);
router.get('/me/activity', requireAdmin, controller.getMyActivity);

// ============================================================
// ADMIN ONLY
// ============================================================
router.get('/', requireAdmin, controller.getAll);
router.get('/:id', requireAdmin, controller.getById);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;