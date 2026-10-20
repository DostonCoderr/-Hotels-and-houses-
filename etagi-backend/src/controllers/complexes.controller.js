const complexesService = require('../services/complexes.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS
// ============================================================
const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(3),
  district: z.string().min(2),
  builder: z.string().min(2),
  completionYear: z.number().int().min(2000).max(2100),
  status: z.enum(['building', 'soon', 'done', 'sales_open', 'sales_closed']).optional(),
  buildings: z.number().int().positive().optional(),
  floors: z.number().int().positive(),
  infrastructure: z.array(z.string()).optional(),
  advantages: z.array(z.string()).optional(),
  minPrice: z.number().positive(),
  maxPrice: z.number().positive(),
  lat: z.number(),
  lng: z.number(),
  published: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

// ============================================================
// GET ALL
// ============================================================
async function getAll(req, res, next) {
  try {
    const result = await complexesService.getAllComplexes(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// GET BY ID
// ============================================================
async function getById(req, res, next) {
  try {
    const complex = await complexesService.getComplexById(req.params.id);
    res.json(complex);
  } catch (err) { next(err); }
}

// ============================================================
// GET BY SLUG
// ============================================================
async function getBySlug(req, res, next) {
  try {
    const complex = await complexesService.getComplexBySlug(req.params.slug);
    res.json(complex);
  } catch (err) { next(err); }
}

// ============================================================
// GET STATS
// ============================================================
async function getStats(req, res, next) {
  try {
    const stats = await complexesService.getComplexStats(req.params.id);
    res.json(stats);
  } catch (err) { next(err); }
}

// ============================================================
// CREATE
// ============================================================
async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const complex = await complexesService.createComplex(data);
    res.status(201).json(complex);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// UPDATE
// ============================================================
async function update(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const complex = await complexesService.updateComplex(req.params.id, data);
    res.json(complex);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// DELETE
// ============================================================
async function remove(req, res, next) {
  try {
    const result = await complexesService.deleteComplex(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// TOGGLE PUBLISHED
// ============================================================
async function toggle(req, res, next) {
  try {
    const complex = await complexesService.togglePublished(req.params.id);
    res.json(complex);
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, getBySlug, getStats, create, update, remove, toggle };