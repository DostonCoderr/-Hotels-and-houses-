const historyService = require('../services/history.service');
const { z } = require('zod');

const addSchema = z.object({
  propertyId: z.number().int().positive(),
});

async function getAll(req, res, next) {
  try {
    const result = await historyService.getUserHistory(req.userId, req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function add(req, res, next) {
  try {
    const { propertyId } = addSchema.parse(req.body);
    const result = await historyService.addToHistory(req.userId, propertyId);
    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await historyService.removeFromHistory(req.userId, req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function clear(req, res, next) {
  try {
    const result = await historyService.clearHistory(req.userId);
    res.json(result);
  } catch (err) { next(err); }
}

async function getMostViewed(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const result = await historyService.getMostViewed(limit);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { getAll, add, remove, clear, getMostViewed };