const adminsService = require('../services/admins.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS
// ============================================================
const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.number().int().positive(),
  active: z.boolean().optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleId: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

// ⚠️ YANGI: My Profile Schema
const updateMyProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

// ⚠️ YANGI: Password Schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

// ============================================================
// GET ALL
// ============================================================
async function getAll(req, res, next) {
  try {
    const result = await adminsService.getAllAdmins(req.query);
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
    const admin = await adminsService.getAdminById(req.params.id);
    res.json(admin);
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
    const admin = await adminsService.createAdmin(data);
    res.status(201).json(admin);
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
    const admin = await adminsService.updateAdmin(req.params.id, data);
    res.json(admin);
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
    if (parseInt(req.params.id) === req.adminId) {
      return res.status(400).json({
        error: 'O\'zingizni o\'chira olmaysiz',
      });
    }

    const result = await adminsService.deleteAdmin(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// GET ROLES
// ============================================================
async function getRoles(req, res, next) {
  try {
    const roles = await adminsService.getAllRoles();
    res.json(roles);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// ⚠️ YANGI: GET MY PROFILE
// ============================================================
async function getMe(req, res, next) {
  try {
    const admin = await adminsService.getMyProfile(req.adminId);
    res.json(admin);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// ⚠️ YANGI: UPDATE MY PROFILE
// ============================================================
async function updateMe(req, res, next) {
  try {
    const data = updateMyProfileSchema.parse(req.body);
    const admin = await adminsService.updateMyProfile(req.adminId, data);
    res.json(admin);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// ⚠️ YANGI: UPLOAD MY AVATAR
// ============================================================
async function uploadMyAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Rasm yuklanmadi' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const admin = await adminsService.updateMyAvatar(req.adminId, avatarPath);

    res.json({ avatar: avatarPath, admin });
  } catch (err) {
    next(err);
  }
}

// ============================================================
// ⚠️ YANGI: DELETE MY AVATAR
// ============================================================
async function deleteMyAvatar(req, res, next) {
  try {
    const admin = await adminsService.deleteMyAvatar(req.adminId);
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
}

// ============================================================
// ⚠️ YANGI: CHANGE MY PASSWORD
// ============================================================
async function changeMyPassword(req, res, next) {
  try {
    const data = changePasswordSchema.parse(req.body);
    const result = await adminsService.changeMyPassword(
      req.adminId,
      data.currentPassword,
      data.newPassword
    );
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    if (err.message === 'INVALID_CURRENT_PASSWORD') {
      return res.status(400).json({ error: 'INVALID_CURRENT_PASSWORD' });
    }
    next(err);
  }
}

// ============================================================
// ⚠️ YANGI: GET MY ACTIVITY
// ============================================================
async function getMyActivity(req, res, next) {
  try {
    const result = await adminsService.getMyActivity(req.adminId, req.query);
    res.json(result);
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
  getRoles,
  // ⚠️ YANGI
  getMe,
  updateMe,
  uploadMyAvatar,
  deleteMyAvatar,
  changeMyPassword,
  getMyActivity,
};