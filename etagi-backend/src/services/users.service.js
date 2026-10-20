const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// ============================================================
// REGISTER — Ro'yxatdan o'tish
// ============================================================
async function registerUser(data) {
  const { name, email, password, phone } = data;

  // Email bandligini tekshirish
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Пользователь с таким email уже существует');
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone: phone || null },
  });

  const token = jwt.sign({ userId: user.id, email: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  };
}

// ============================================================
// LOGIN — Tizimga kirish
// ============================================================
async function loginUser(data) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Неверный email или пароль');
    err.status = 400;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Неверный email или пароль');
    err.status = 400;
    throw err;
  }

  if (user.blocked) {
    const err = new Error('Аккаунт заблокирован');
    err.status = 403;
    throw err;
  }

  const token = jwt.sign({ userId: user.id, email: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  };
}


async function addFavorite(userId, propertyId) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_propertyId: { userId, propertyId: parseInt(propertyId) } }
  });
  if (existing) return existing;
  return prisma.favorite.create({
    data: { userId, propertyId: parseInt(propertyId) }
  });
}

async function removeFavorite(userId, propertyId) {
  return prisma.favorite.delete({
    where: { userId_propertyId: { userId, propertyId: parseInt(propertyId) } }
  }).catch(() => ({ message: 'Already removed' }));
}

async function addView(userId, propertyId) {
  return prisma.viewingHistory.create({
    data: { userId, propertyId: parseInt(propertyId) }
  });
}


// ============================================================
// GET PROFILE — Profil ma'lumotlari (token orqali)
// ============================================================
async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });
  if (!user) {
    const err = new Error('Пользователь не найден');
    err.status = 404;
    throw err;
  }
  return user;
}

// ============================================================
// UPDATE PROFILE — Profilni yangilash
// ============================================================
async function updateProfile(userId, data) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: data.name, phone: data.phone },
    select: { id: true, name: true, email: true, phone: true },
  });
  return user;
}

// ============================================================
// GET ALL — Admin uchun ro'yxat
// ============================================================
async function getAllUsers(filters) {
  const {
    search, blocked, sort = 'newest',
    page = 1, limit = 20,
  } = filters;

  const where = {};

  if (blocked === 'true') where.blocked = true;
  if (blocked === 'false') where.blocked = false;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  switch (sort) {
    case 'oldest': orderBy = { createdAt: 'asc' }; break;
    case 'name': orderBy = { name: 'asc' }; break;
    case 'email': orderBy = { email: 'asc' }; break;
    case 'newest':
    default: orderBy = { createdAt: 'desc' }; break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where, orderBy, skip, take,
      select: {
        id: true, name: true, email: true, phone: true, blocked: true, createdAt: true,
        _count: { select: { favorites: true, views: true, applications: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// GET BY ID — Admin uchun bitta
// ============================================================
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true, name: true, email: true, phone: true, blocked: true, createdAt: true, updatedAt: true,
      _count: { select: { favorites: true, views: true, applications: true } },
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
// GET USER FAVORITES — (Admin yoki User o'zi uchun)
// ============================================================
async function getUserFavorites(id) {
  return prisma.favorite.findMany({
    where: { userId: parseInt(id) },
    include: {
      property: {
        include: {
          type: true,
          images: { orderBy: { order: 'asc' } },
          complex: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ============================================================
// GET USER VIEWS — (Admin yoki User o'zi uchun)
// ============================================================
async function getUserViews(id) {
  return prisma.viewingHistory.findMany({
    where: { userId: parseInt(id) },
    include: {
      property: {
        include: {
          type: true,
          images: { orderBy: { order: 'asc' } },
        },
      },
    },
    orderBy: { viewedAt: 'desc' },
    take: 50,
  });
}

// ============================================================
// GET USER APPLICATIONS — (Admin yoki User o'zi uchun)
// ============================================================
async function getUserApplications(id) {
  return prisma.application.findMany({
    where: { userId: parseInt(id) },
    include: { property: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// ============================================================
// BLOCK USER
// ============================================================
async function blockUser(id) {
  await getUserById(id);
  return prisma.user.update({
    where: { id: parseInt(id) },
    data: { blocked: true },
    select: { id: true, name: true, email: true, blocked: true },
  });
}

// ============================================================
// UNBLOCK USER
// ============================================================
async function unblockUser(id) {
  await getUserById(id);
  return prisma.user.update({
    where: { id: parseInt(id) },
    data: { blocked: false },
    select: { id: true, name: true, email: true, blocked: true },
  });
}

// ============================================================
// DELETE USER
// ============================================================
async function deleteUser(id) {
  await getUserById(id);
  await prisma.user.delete({ where: { id: parseInt(id) } });
  return { message: 'Пользователь удалён' };
}

// ============================================================
// STATS
// ============================================================
async function getUsersStats() {
  const [total, blocked, active, today, views, favorites, applications, scheduled] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { blocked: true } }),
    prisma.user.count({ where: { blocked: false } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    
    // ✅ Yangi statistika
    prisma.viewingHistory.count(),
    prisma.favorite.count(),
    prisma.application.count(),
    prisma.application.count({ where: { type: 'scheduled' } }), // ✅ Rejalashtirilganlar
  ]);

  return { 
    total, 
    blocked, 
    active, 
    today,
    views,
    favorites,
    applications,
    scheduled
  };
}

async function getUserScheduled(userId) {
  return prisma.application.findMany({
    where: { userId, type: 'scheduled' },
    include: { property: { include: { images: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  getUserFavorites,
  getUserViews,
  getUserApplications,
  blockUser,
  unblockUser,
  deleteUser,
  getUsersStats,
  addFavorite,
  removeFavorite,
  addView,
  getUserScheduled
};