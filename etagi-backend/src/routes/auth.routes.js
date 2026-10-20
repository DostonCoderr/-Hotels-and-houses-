const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// ============================================================
// USER ROUTES
// ============================================================

// POST /api/auth/register — ro'yxatdan o'tish
router.post('/register', authController.register);

// POST /api/auth/login — kirish
router.post('/login', authController.login);

// GET /api/auth/me — joriy user
router.get('/me', requireAuth, authController.me);

// POST /api/auth/logout — chiqish
router.post('/logout', requireAuth, authController.logout);

// ============================================================
// ADMIN ROUTES
// ============================================================

// POST /api/auth/admin/login — admin kirish
router.post('/admin/login', authController.adminLogin);

// GET /api/auth/admin/me — joriy admin
router.get('/admin/me', requireAdmin, authController.adminMe);

module.exports = router;