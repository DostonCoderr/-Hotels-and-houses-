const prisma = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

// ============================================================
// USER REGISTER
// ============================================================
async function registerUser({ name, email, password, phone }) {
  // Email tekshirish
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email уже зарегистрирован');
    err.status = 400;
    throw err;
  }

  // Parolni hash qilish
  const hashedPassword = await hashPassword(password);

  // User yaratish
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  // JWT token
  const token = signToken({ userId: user.id, email: user.email });

  return { user, token };
}

// ============================================================
// USER LOGIN
// ============================================================
async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    throw err;
  }

  if (user.blocked) {
    const err = new Error('Аккаунт заблокирован');
    err.status = 403;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    throw err;
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token,
  };
}

// ============================================================
// ADMIN LOGIN
// ============================================================
async function loginAdmin({ email, password }) {
  const admin = await prisma.admin.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!admin) {
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    throw err;
  }

  if (!admin.active) {
    const err = new Error('Доступ запрещён');
    err.status = 403;
    throw err;
  }

  const valid = await comparePassword(password, admin.password);
  if (!valid) {
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    throw err;
  }

  const token = signToken({
    adminId: admin.id,
    email: admin.email,
    role: admin.role.name,
    type: 'admin',
  });

  // Activity log
  await prisma.activityLog.create({
    data: {
      adminId: admin.id,
      action: 'login',
      entity: 'admin',
      entityId: admin.id,
      details: 'Вход в админ-панель',
    },
  });

  return {
    admin: {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role.name,
    roleId: admin.roleId,
    permissions: admin.role.permissions,
    active: admin.active,
    avatar: admin.avatar || null,      // ⚠️ YANGI
    phone: admin.phone || null,        // ⚠️ YANGI
    position: admin.position || null,  // ⚠️ YANGI
    address: admin.address || null,    // ⚠️ YANGI
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  },
    token,
  };
}

// ============================================================
// GET CURRENT USER
// ============================================================
async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      blocked: true,
      createdAt: true,
    },
  });

  if (!user) {
    const err = new Error('Пользователь не найден');
    err.status = 404;
    throw err;
  }

  return user;
}

// ============================================================
// GET CURRENT ADMIN
// ============================================================
async function getCurrentAdmin(adminId) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    include: { role: true },
  });

  if (!admin) {
    const err = new Error('Администратор не найден');
    err.status = 404;
    throw err;
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role.name,
    roleId: admin.roleId,
    permissions: admin.role.permissions,
    active: admin.active,
    avatar: admin.avatar || null,      // ⚠️ YANGI
    phone: admin.phone || null,        // ⚠️ YANGI
    position: admin.position || null,  // ⚠️ YANGI
    address: admin.address || null,    // ⚠️ YANGI
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  getCurrentAdmin,
};