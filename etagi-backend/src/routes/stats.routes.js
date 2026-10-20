const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stats.controller');
const { requireAdmin } = require('../middleware/auth');

// ============================================================
// DASHBOARD
// ============================================================
router.get('/dashboard', requireAdmin, ctrl.dashboard);
router.get('/chart', requireAdmin, ctrl.chartData);

// ============================================================
// TOP
// ============================================================
router.get('/top/properties', requireAdmin, ctrl.topProperties);
router.get('/top/complexes', requireAdmin, ctrl.topComplexes);

// ============================================================
// BREAKDOWNS
// ============================================================
router.get('/applications/by-type', requireAdmin, ctrl.applicationsByType);
router.get('/applications/by-status', requireAdmin, ctrl.applicationsByStatus);
router.get('/properties/by-type', requireAdmin, ctrl.propertiesByType);

// ============================================================
// PRICE
// ============================================================
router.get('/price', requireAdmin, ctrl.priceStats);

// ============================================================
// ACTIVITY
// ============================================================
router.get('/recent', requireAdmin, ctrl.recentActivity);
router.get('/logs', requireAdmin, ctrl.activityLogs);

module.exports = router;