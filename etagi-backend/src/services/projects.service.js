const prisma = require('../config/db');

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9а-яё\s-]/gi, '').replace(/\s+/g, '-').trim() + '-' + Date.now().toString(36);
}

// ============================================================
// GET ALL
// ============================================================
async function getAllProjects(filters) {
  const { category, search, page = 1, limit = 12 } = filters;
  const where = { published: true };
  
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where, skip, take: parseInt(limit),
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count({ where }),
  ]);

  return { items, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) };
}

// ============================================================
// GET BY ID
// ============================================================
async function getProjectById(id) {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { images: true },
  });
  if (!project) {
    const err = new Error('Проект не найден');
    err.status = 404;
    throw err;
  }
  return project;
}

// ============================================================
// CREATE (YANGILANGAN)
// ============================================================
async function createProject(data) {
  const slug = generateSlug(data.name);
  return prisma.project.create({
    data: { 
      ...data, 
      slug, 
      price: BigInt(data.price),
      // JSON massivni to'g'ri saqlash
      packages: data.packages ? data.packages : [],
    },
    include: { images: true },
  });
}

// ============================================================
// UPDATE (YANGILANGAN)
// ============================================================
async function updateProject(id, data) {
  const updateData = { ...data };
  if (data.price) updateData.price = BigInt(data.price);
  
  return prisma.project.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: { images: true },
  });
}

async function deleteProject(id) {
  await prisma.project.delete({ where: { id: parseInt(id) } });
  return { message: 'Проект удален' };
}

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };