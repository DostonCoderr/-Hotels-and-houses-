const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// ============================================================
// GET ALL ADMINS
// ============================================================
async function getAllAdmins(filters = {}) {
  const { search, roleId, active, page = 1, limit = 20 } = filters;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (roleId) where.roleId = parseInt(roleId);
  if (active !== undefined) where.active = active === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.admin.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        role: {
          select: { id: true, name: true, permissions: true },
        },
      },
    }),
    prisma.admin.count({ where }),
  ]);

  const formatted = items.map(formatAdmin);

  return {
    items: formatted,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// FORMAT ADMIN (yordamchi)
// ============================================================
function formatAdmin(admin) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role?.name || null,
    roleId: admin.roleId,
    permissions: admin.role?.permissions || [],
    active: admin.active,
    // ⚠️ YANGI MAYDONLAR
    avatar: admin.avatar || null,
    phone: admin.phone || null,
    position: admin.position || null,
    address: admin.address || null,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

// ============================================================
// GET BY ID
// ============================================================
async function getAdminById(id) {
  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(id) },
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  if (!admin) {
    const err = new Error('Администратор не найден');
    err.status = 404;
    throw err;
  }

  return formatAdmin(admin);
}

// ============================================================
// CREATE
// ============================================================
async function createAdmin(data) {
  const existing = await prisma.admin.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    const err = new Error('Email allaqachon mavjud');
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const admin = await prisma.admin.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: parseInt(data.roleId),
      active: data.active !== false,
    },
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  return formatAdmin(admin);
}

// ============================================================
// UPDATE
// ============================================================
async function updateAdmin(id, data) {
  await getAdminById(id);

  const updateData = {
    name: data.name,
    email: data.email,
    roleId: data.roleId ? parseInt(data.roleId) : undefined,
    active: data.active,
  };

  if (data.password && data.password.length >= 6) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const admin = await prisma.admin.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  return formatAdmin(admin);
}

// ============================================================
// DELETE
// ============================================================
async function deleteAdmin(id) {
  await getAdminById(id);

  await prisma.admin.delete({
    where: { id: parseInt(id) },
  });

  return { message: 'Администратор удалён' };
}

// ============================================================
// GET ROLES
// ============================================================
async function getAllRoles() {
  return prisma.role.findMany({
    orderBy: { id: 'asc' },
  });
}

// ============================================================
// ⚠️ YANGI: GET MY PROFILE
// ============================================================
async function getMyProfile(adminId) {
  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(adminId) },
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  if (!admin) {
    const err = new Error('Администратор не найден');
    err.status = 404;
    throw err;
  }

  return formatAdmin(admin);
}

// ============================================================
// ⚠️ YANGI: UPDATE MY PROFILE
// ============================================================
async function updateMyProfile(adminId, data) {
  const allowed = ['name', 'email', 'phone', 'position', 'address'];
  const updateData = {};

  allowed.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  // Email bandligini tekshirish
  if (data.email) {
    const existing = await prisma.admin.findUnique({
      where: { email: data.email },
    });
    if (existing && existing.id !== parseInt(adminId)) {
      const err = new Error('Этот email уже занят');
      err.status = 400;
      throw err;
    }
  }

  const admin = await prisma.admin.update({
    where: { id: parseInt(adminId) },
    data: updateData,
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  return formatAdmin(admin);
}

// ============================================================
// ⚠️ YANGI: UPDATE MY AVATAR
// ============================================================
async function updateMyAvatar(adminId, avatarPath) {
  const admin = await prisma.admin.update({
    where: { id: parseInt(adminId) },
    data: { avatar: avatarPath },
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  return formatAdmin(admin);
}

// ============================================================
// ⚠️ YANGI: DELETE MY AVATAR
// ============================================================
async function deleteMyAvatar(adminId) {
  const admin = await prisma.admin.update({
    where: { id: parseInt(adminId) },
    data: { avatar: null },
    include: {
      role: {
        select: { id: true, name: true, permissions: true },
      },
    },
  });

  return formatAdmin(admin);
}

// ============================================================
// ⚠️ YANGI: CHANGE MY PASSWORD
// ============================================================
async function changeMyPassword(adminId, currentPassword, newPassword) {
  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(adminId) },
  });

  if (!admin) {
    const err = new Error('Администратор не найден');
    err.status = 404;
    throw err;
  }

  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) {
    const err = new Error('INVALID_CURRENT_PASSWORD');
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: { id: parseInt(adminId) },
    data: { password: hashedPassword },
  });

  return { message: 'Пароль изменён' };
}

// ============================================================
// ⚠️ YANGI: GET MY ACTIVITY
// ============================================================
async function getMyActivity(adminId, filters = {}) {
  const { page = 1, limit = 20 } = filters;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { adminId: parseInt(adminId) },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.activityLog.count({
      where: { adminId: parseInt(adminId) },
    }),
  ]);

  return {
    items,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllRoles,
  // ⚠️ YANGI
  getMyProfile,
  updateMyProfile,
  updateMyAvatar,
  deleteMyAvatar,
  changeMyPassword,
  getMyActivity,
};