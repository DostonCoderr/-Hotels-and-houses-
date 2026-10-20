const applicationsService = require('../services/applications.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS
// ============================================================
const createSchema = z.object({
  // ✅ 'project' ni ham qabul qiladigan qildik
  type: z.enum(['consultation', 'property', 'complex', 'sell', 'rent', 'mortgage', 'project', 'scheduled']),
  name: z.string().min(2, 'Имя слишком короткое'),
  phone: z.string().min(10, 'Введите номер телефона'),
  email: z.string().email('Неверный email').optional().or(z.literal('')),
  message: z.string().optional(),
  
  // ✅ propertyId va projectId ikkalasi ham kelishi mumkin
  propertyId: z.number().int().positive().optional(),
  projectId: z.number().int().positive().optional(),
  
  source: z.enum(['site', 'telegram', 'whatsapp', 'phone']).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['new', 'in_work', 'done', 'closed']),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  message: z.string().optional(),
  status: z.enum(['new', 'in_work', 'done', 'closed']).optional(),
});

// ============================================================
// CREATE (public)
// ============================================================
async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const application = await applicationsService.createApplication(data, req.userId || null);
    res.status(201).json(application);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// GET ALL (admin)
// ============================================================
async function getAll(req, res, next) {
  try {
    const result = await applicationsService.getAllApplications(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// GET BY ID (admin)
// ============================================================
async function getById(req, res, next) {
  try {
    const application = await applicationsService.getApplicationById(req.params.id);
    res.json(application);
  } catch (err) { next(err); }
}

// ============================================================
// UPDATE STATUS (admin)
// ============================================================
async function updateStatus(req, res, next) {
  try {
    const { status } = updateStatusSchema.parse(req.body);
    const application = await applicationsService.updateStatus(req.params.id, status);
    res.json(application);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// UPDATE (admin)
// ============================================================
async function update(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const application = await applicationsService.updateApplication(req.params.id, data);
    res.json(application);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// DELETE (admin)
// ============================================================
async function remove(req, res, next) {
  try {
    const result = await applicationsService.deleteApplication(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// STATS (admin)
// ============================================================
async function getStats(req, res, next) {
  try {
    const stats = await applicationsService.getApplicationsStats();
    res.json(stats);
  } catch (err) { next(err); }
}

module.exports = { create, getAll, getById, updateStatus, update, remove, getStats };