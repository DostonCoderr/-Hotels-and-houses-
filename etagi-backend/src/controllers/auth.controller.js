const authService = require('../services/auth.service');
const { z } = require('zod');

// ============================================================
// SCHEMAS
// ============================================================
const registerSchema = z.object({
  name: z.string().min(2, 'Имя слишком короткое'),
  email: z.string().email('Неверный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(1, 'Введите пароль'),
});

// ============================================================
// REGISTER
// ============================================================
async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.registerUser(data);
    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// LOGIN
// ============================================================
async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.loginUser(data);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// ADMIN LOGIN
// ============================================================
async function adminLogin(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.loginAdmin(data);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

// ============================================================
// ME (User)
// ============================================================
async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// ME (Admin)
// ============================================================
async function adminMe(req, res, next) {
  try {
    const admin = await authService.getCurrentAdmin(req.adminId);
    res.json(admin);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// LOGOUT (faqat frontend tokenni o'chiradi)
// ============================================================
async function logout(req, res) {
  res.json({ message: 'Вы вышли из аккаунта' });
}

module.exports = {
  register,
  login,
  adminLogin,
  me,
  adminMe,
  logout,
};