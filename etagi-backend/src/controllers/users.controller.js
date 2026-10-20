const usersService = require('../services/users.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS
// ============================================================
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

// ============================================================
// REGISTER
// ============================================================
async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await usersService.registerUser(data);
    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

// ============================================================
// LOGIN
// ============================================================
async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await usersService.loginUser(data);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

// ============================================================
// GET PROFILE (User)
// ============================================================
async function getProfile(req, res, next) {
  try {
    const profile = await usersService.getProfile(req.userId);
    res.json(profile);
  } catch (err) { next(err); }
}

// ============================================================
// UPDATE PROFILE (User)
// ============================================================
async function updateProfile(req, res, next) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const profile = await usersService.updateProfile(req.userId, data);
    res.json(profile);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

// ============================================================
// GET MY FAVORITES (User)
// ============================================================
async function getMyFavorites(req, res, next) {
  try {
    const favs = await usersService.getUserFavorites(req.userId);
    res.json(favs.map(f => f.property));
  } catch (err) { next(err); }
}

// ============================================================
// GET MY HISTORY (User)
// ============================================================
async function getMyHistory(req, res, next) {
  try {
    const views = await usersService.getUserViews(req.userId);
    res.json(views.map(v => v.property));
  } catch (err) { next(err); }
}


async function addFavorite(req, res, next) {
  try {
    const { propertyId } = req.body;
    const fav = await usersService.addFavorite(req.userId, propertyId);
    res.status(201).json(fav);
  } catch (err) { next(err); }
}

async function removeFavorite(req, res, next) {
  try {
    await usersService.removeFavorite(req.userId, req.params.propertyId);
    res.json({ message: 'Удалено из избранного' });
  } catch (err) { next(err); }
}

async function addView(req, res, next) {
  try {
    const { propertyId } = req.body;
    const view = await usersService.addView(req.userId, propertyId);
    res.status(201).json(view);
  } catch (err) { next(err); }
}

async function getMyScheduled(req, res, next) {
  try {
    const scheduled = await usersService.getUserScheduled(req.userId);
    res.json(scheduled.map(s => s.property));
  } catch (err) { next(err); }
}


// ============================================================
// ADMIN FUNKSIYALARI (o'zgarmagan)
// ============================================================
async function getAll(req, res, next) {
  try { res.json(await usersService.getAllUsers(req.query)); } catch (err) { next(err); }
}
async function getById(req, res, next) {
  try { res.json(await usersService.getUserById(req.params.id)); } catch (err) { next(err); }
}
async function getFavorites(req, res, next) {
  try { res.json(await usersService.getUserFavorites(req.params.id)); } catch (err) { next(err); }
}
async function getViews(req, res, next) {
  try { res.json(await usersService.getUserViews(req.params.id)); } catch (err) { next(err); }
}
async function getApplications(req, res, next) {
  try { res.json(await usersService.getUserApplications(req.params.id)); } catch (err) { next(err); }
}
async function block(req, res, next) {
  try { res.json(await usersService.blockUser(req.params.id)); } catch (err) { next(err); }
}
async function unblock(req, res, next) {
  try { res.json(await usersService.unblockUser(req.params.id)); } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { res.json(await usersService.deleteUser(req.params.id)); } catch (err) { next(err); }
}
async function getStats(req, res, next) {
  try { res.json(await usersService.getUsersStats()); } catch (err) { next(err); }
}

module.exports = {
  register, login, getProfile, updateProfile, getMyFavorites, getMyHistory,
  getAll, getById, getFavorites, getViews, getApplications,
  block, unblock, remove, getStats, addFavorite, removeFavorite, addView, getMyScheduled
};