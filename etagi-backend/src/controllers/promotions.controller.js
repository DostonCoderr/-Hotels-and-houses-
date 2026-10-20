const promotionsService = require('../services/promotions.service');
const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  image: z.string().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['active', 'expired', 'hidden']).optional(),
  propertyIds: z.array(z.number().int().positive()).optional(),
});

const updateSchema = createSchema.partial();

async function getAll(req, res, next) {
  try {
    const result = await promotionsService.getAllPromotions(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function getActive(req, res, next) {
  try {
    const result = await promotionsService.getActivePromotions();
    res.json(result);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const promotion = await promotionsService.getPromotionById(req.params.id);
    res.json(promotion);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const promotion = await promotionsService.createPromotion(data);
    res.status(201).json(promotion);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const promotion = await promotionsService.updatePromotion(req.params.id, data);
    res.json(promotion);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await promotionsService.deletePromotion(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function toggle(req, res, next) {
  try {
    const promo = await promotionsService.toggleStatus(req.params.id);
    res.json({ message: 'Статус обновлён', promotion: promo });
  } catch (err) { next(err); }
}

module.exports = { getAll, getActive, getById, create, update, remove, toggle };