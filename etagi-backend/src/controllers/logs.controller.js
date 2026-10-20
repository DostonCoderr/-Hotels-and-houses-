const logsService = require('../services/logs.service');

async function getAll(req, res, next) {
  try {
    const result = await logsService.getAllLogs(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function getByAdmin(req, res, next) {
  try {
    const result = await logsService.getLogsByAdmin(req.params.adminId, req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function getByEntity(req, res, next) {
  try {
    const result = await logsService.getLogsByEntity(
      req.params.entity,
      req.query.entityId,
      req.query
    );
    res.json(result);
  } catch (err) { next(err); }
}

async function getStats(req, res, next) {
  try {
    const stats = await logsService.getLogsStats();
    res.json(stats);
  } catch (err) { next(err); }
}

async function clearOld(req, res, next) {
  try {
    const days = parseInt(req.query.days) || 90;
    const result = await logsService.clearOldLogs(days);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { getAll, getByAdmin, getByEntity, getStats, clearOld };