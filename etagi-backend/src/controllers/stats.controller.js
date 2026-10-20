const statsService = require('../services/stats.service');

// ============================================================
// DASHBOARD
// ============================================================
async function dashboard(req, res, next) {
  try {
    const period = req.query.period || '7d';
    const stats = await statsService.getDashboard(period);
    res.json(stats);
  } catch (err) { next(err); }
}

// ============================================================
// CHART DATA
// ============================================================
async function chartData(req, res, next) {
  try {
    const period = req.query.period || '7d';
    const data = await statsService.getChartData(period);
    res.json(data);
  } catch (err) { next(err); }
}

// ============================================================
// TOP PROPERTIES
// ============================================================
async function topProperties(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const result = await statsService.getTopProperties(limit);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// TOP COMPLEXES
// ============================================================
async function topComplexes(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const result = await statsService.getTopComplexes(limit);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// APPLICATIONS BY TYPE
// ============================================================
async function applicationsByType(req, res, next) {
  try {
    const result = await statsService.getApplicationsByType();
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// APPLICATIONS BY STATUS
// ============================================================
async function applicationsByStatus(req, res, next) {
  try {
    const result = await statsService.getApplicationsByStatus();
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// PROPERTIES BY TYPE
// ============================================================
async function propertiesByType(req, res, next) {
  try {
    const result = await statsService.getPropertiesByType();
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// PRICE STATS
// ============================================================
async function priceStats(req, res, next) {
  try {
    const result = await statsService.getPriceStats();
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// RECENT ACTIVITY
// ============================================================
async function recentActivity(req, res, next) {
  try {
    const limit = req.query.limit || 20;
    const result = await statsService.getRecentActivity(limit);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// ACTIVITY LOGS
// ============================================================
async function activityLogs(req, res, next) {
  try {
    const result = await statsService.getActivityLogs(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = {
  dashboard,
  chartData,
  topProperties,
  topComplexes,
  applicationsByType,
  applicationsByStatus,
  propertiesByType,
  priceStats,
  recentActivity,
  activityLogs,
};