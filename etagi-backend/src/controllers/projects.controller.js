const projectsService = require('../services/projects.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS (YANGILANGAN)
// ============================================================
const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  area: z.number().positive(),
  floors: z.number().int(),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  material: z.string(),
  style: z.string().optional(),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  
  // 🔥 YANGI MAYDONLAR
  terassa: z.boolean().optional(),
  wallHeight: z.number().optional(),
  foundation: z.string().optional(),
  roof: z.string().optional(),
  kitchenArea: z.number().optional(),
  
  companyName: z.string().optional(),
  companyExp: z.number().optional(),
  companyDesc: z.string().optional(),
  
  // packages bu JSON massiv bo'ladi
  packages: z.any().optional(),
});

async function getAll(req, res, next) {
  try { res.json(await projectsService.getAllProjects(req.query)); } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try { res.json(await projectsService.getProjectById(req.params.id)); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    res.status(201).json(await projectsService.createProject(data));
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    // Barcha maydonlarni optional qilib validatsiya qilamiz
    const data = createSchema.partial().parse(req.body);
    res.json(await projectsService.updateProject(req.params.id, data));
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

async function remove(req, res, next) {
  try { res.json(await projectsService.deleteProject(req.params.id)); } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };