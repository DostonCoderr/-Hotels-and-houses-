const propertiesService = require('../services/properties.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS
// ============================================================
const createSchema = z.object({
  name: z.string().min(2),
  typeId: z.number().int().positive(),
  complexId: z.number().int().positive().nullable().optional(),
  apartmentNo: z.string().optional(),
  rooms: z.number().int().min(0),
  area: z.number().positive(),
  floor: z.number().int(),
  floorsTotal: z.number().int().positive(),
  price: z.number().positive(),
  priceM2: z.number().positive(),
  oldPrice: z.number().positive().nullable().optional(),
  discount: z.number().int().min(0).max(100).nullable().optional(),
  status: z.enum(['available', 'booked', 'sold', 'hidden']).optional(),
  description: z.string().min(10),
  address: z.string().min(3),
  lat: z.number(),
  lng: z.number(),
  features: z.array(z.string()).optional(),
  advantages: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  
  // YANGI MAYDONLAR
  imo: z.string().optional(),
  wall: z.string().optional(),
  cls: z.string().optional(),
  metro: z.string().optional(),
  metroTime: z.string().optional(),
  metroDist: z.string().optional(),
  videos: z.any().optional(),
  progressPhotos: z.any().optional(),
  genplan: z.any().optional(),
  completionDate: z.string().optional(),
  constructionStatus: z.string().optional(),
  reviewsCount: z.number().optional(),
  rating: z.number().optional(),
  declarations: z.any().optional(),
  videoUrl: z.string().optional(),
  paymentMethods: z.string().optional(),
  similarOffers: z.string().optional(),
});



// ============================================================
// UPDATE SCHEMA — BARCHA MAYDONLAR .nullable() BILAN
// ============================================================
const updateSchema = z.object({
  name: z.string().min(2).optional(),
  typeId: z.number().int().positive().optional(),
  complexId: z.number().int().positive().nullable().optional(),
  apartmentNo: z.string().nullable().optional(),
  rooms: z.number().int().min(0).optional(),
  area: z.number().positive().optional(),
  floor: z.number().int().optional(),
  floorsTotal: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  priceM2: z.number().positive().optional(),
  oldPrice: z.number().positive().nullable().optional(),
  discount: z.number().int().min(0).max(100).nullable().optional(),

  status: z.enum(['available', 'booked', 'sold', 'hidden']).optional(),
  description: z.string().min(10).optional(),
  address: z.string().min(3).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  features: z.array(z.string()).optional(),
  advantages: z.array(z.string()).optional(),
  published: z.boolean().optional(),
    imo: z.string().optional(),
  wall: z.string().optional(),
  cls: z.string().optional(),
  metro: z.string().optional(),
  metroTime: z.string().optional(),
  metroDist: z.string().optional(),
  genplan: z.any().optional(),

  completionDate: z.string().optional(),
  constructionStatus: z.string().optional(),
  reviewsCount: z.number().optional(),
  rating: z.number().optional(),
  declarations: z.any().optional(),
  progressPhotos: z.any().optional(),
  videos: z.any().optional(),
  videoUrl: z.string().optional(),
  paymentMethods: z.string().optional(),
  similarOffers: z.string().optional(),
});

// ============================================================
// GET ALL
// ============================================================
async function getAll(req, res, next) {
  try {
    const result = await propertiesService.getAllProperties(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// GET BY ID
// ============================================================
async function getById(req, res, next) {
  try {
    const property = await propertiesService.getPropertyById(req.params.id);
    res.json(property);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// CREATE
// ============================================================
async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const property = await propertiesService.createProperty(data);
    res.status(201).json(property);
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
    const property = await propertiesService.updateProperty(req.params.id, data);
    res.json(property);
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
    const result = await propertiesService.deleteProperty(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// DUPLICATE
// ============================================================
async function duplicate(req, res, next) {
  try {
    const copy = await propertiesService.duplicateProperty(req.params.id);
    res.status(201).json(copy);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// GET STATS
// ============================================================
async function getStats(req, res, next) {
  try {
    const stats = await propertiesService.getPropertyStats(req.params.id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  duplicate,
  getStats,
};