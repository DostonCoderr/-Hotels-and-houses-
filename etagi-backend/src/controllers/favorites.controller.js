const favoritesService = require('../services/favorites.service');
const { z } = require('zod');

const addSchema = z.object({
  propertyId: z.number().int().positive(),
});

async function getAll(req, res, next) {
  try {
    const result = await favoritesService.getUserFavorites(req.userId, req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function getIds(req, res, next) {
  try {
    const ids = await favoritesService.getUserFavoriteIds(req.userId);
    res.json({ ids });
  } catch (err) { next(err); }
}

async function add(req, res, next) {
  try {
    const { propertyId } = addSchema.parse(req.body);
    const result = await favoritesService.addToFavorites(req.userId, propertyId);
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
    const result = await favoritesService.removeFromFavorites(
      req.userId,
      req.params.propertyId
    );
    res.json(result);
  } catch (err) { next(err); }
}

async function toggle(req, res, next) {
  try {
    const result = await favoritesService.toggleFavorite(
      req.userId,
      req.params.propertyId
    );
    res.json(result);
  } catch (err) { next(err); }
}

async function clear(req, res, next) {
  try {
    const result = await favoritesService.clearFavorites(req.userId);
    res.json(result);
  } catch (err) { next(err); }
}

async function getTop(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const top = await favoritesService.getTopFavorited(limit);
    res.json(top);
  } catch (err) { next(err); }
}

module.exports = { getAll, getIds, add, remove, toggle, clear, getTop };