const prisma = require('../config/db');

// ============================================================
// GET ALL — public
// ============================================================
async function getVisibleEmployees() {
  return prisma.employee.findMany({
    where: { hidden: false },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
}

// ============================================================
// GET ALL — admin (hidden + visible)
// ============================================================
async function getAllEmployees(filters = {}) {
  const { hidden, search, sort = 'order' } = filters;

  const where = {};
  if (hidden === 'true') where.hidden = true;
  if (hidden === 'false') where.hidden = false;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { position: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy = [{ order: 'asc' }, { createdAt: 'asc' }];
  if (sort === 'name') orderBy = { name: 'asc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  return prisma.employee.findMany({ where, orderBy });
}

// ============================================================
// GET BY ID
// ============================================================
async function getEmployeeById(id) {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
  });

  if (!employee) {
    const err = new Error('Сотрудник не найден');
    err.status = 404;
    throw err;
  }

  return employee;
}

// ============================================================
// CREATE
// ============================================================
async function createEmployee(data) {
  // Default order
  const maxOrder = await prisma.employee.aggregate({
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order || 0) + 1;

  return prisma.employee.create({
    data: {
      name: data.name,
      position: data.position,
      photo: data.photo || null,
      phone: data.phone || null,
      email: data.email || null,
      description: data.description || null,
      hidden: data.hidden || false,
      order: data.order !== undefined ? data.order : nextOrder,
    },
  });
}

// ============================================================
// UPDATE
// ============================================================
async function updateEmployee(id, data) {
  await getEmployeeById(id);
  return prisma.employee.update({
    where: { id: parseInt(id) },
    data,
  });
}

// ============================================================
// DELETE
// ============================================================
async function deleteEmployee(id) {
  await getEmployeeById(id);
  await prisma.employee.delete({ where: { id: parseInt(id) } });
  return { message: 'Сотрудник удалён' };
}

// ============================================================
// TOGGLE HIDDEN
// ============================================================
async function toggleHidden(id) {
  const emp = await getEmployeeById(id);
  return prisma.employee.update({
    where: { id: parseInt(id) },
    data: { hidden: !emp.hidden },
  });
}

// ============================================================
// REORDER
// ============================================================
async function reorderEmployees(orderList) {
  // orderList: [{ id: 1, order: 0 }, ...]
  await Promise.all(
    orderList.map(item =>
      prisma.employee.update({
        where: { id: parseInt(item.id) },
        data: { order: parseInt(item.order) },
      })
    )
  );
  return { message: 'Порядок обновлён' };
}

module.exports = {
  getVisibleEmployees,
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleHidden,
  reorderEmployees,
};