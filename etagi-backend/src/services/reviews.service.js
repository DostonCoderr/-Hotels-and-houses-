const prisma = require('../config/db');

// ============================================================
// GET PUBLISHED — ommaviy sharhlar
// ============================================================
async function getPublishedReviews(filters = {}) {
  const { limit = 20, page = 1 } = filters;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.review.count({ where: { published: true } }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// GET ALL — admin uchun (published + unpublished)
// ============================================================
async function getAllReviews(filters = {}) {
  const { published, search, rating, page = 1, limit = 20 } = filters;

  const where = {};
  if (published === 'true') where.published = true;
  if (published === 'false') where.published = false;
  if (rating) where.rating = parseInt(rating);

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { text: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip, take,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    items, total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
}

// ============================================================
// CREATE — public (foydalanuvchi yozadi)
// ============================================================
async function createReview(data) {
  return prisma.review.create({
    data: {
      name: data.name,
      photo: data.photo || null,
      text: data.text,
      rating: data.rating,
      published: false, // Moderatsiya kerak
    },
  });
}

// ============================================================
// PUBLISH / UNPUBLISH
// ============================================================
async function togglePublish(id) {
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
  });

  if (!review) {
    const err = new Error('Отзыв не найден');
    err.status = 404;
    throw err;
  }

  return prisma.review.update({
    where: { id: parseInt(id) },
    data: { published: !review.published },
  });
}

// ============================================================
// UPDATE
// ============================================================
async function updateReview(id, data) {
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
  });

  if (!review) {
    const err = new Error('Отзыв не найден');
    err.status = 404;
    throw err;
  }

  return prisma.review.update({
    where: { id: parseInt(id) },
    data,
  });
}

// ============================================================
// DELETE
// ============================================================
async function deleteReview(id) {
  await prisma.review.delete({ where: { id: parseInt(id) } });
  return { message: 'Отзыв удалён' };
}

// ============================================================
// STATS
// ============================================================
async function getReviewsStats() {
  const [total, published, pending, avg] = await Promise.all([
    prisma.review.count(),
    prisma.review.count({ where: { published: true } }),
    prisma.review.count({ where: { published: false } }),
    prisma.review.aggregate({
      where: { published: true },
      _avg: { rating: true },
    }),
  ]);

  return {
    total, published, pending,
    avgRating: avg._avg.rating ? Math.round(avg._avg.rating * 10) / 10 : 0,
  };
}

module.exports = {
  getPublishedReviews,
  getAllReviews,
  createReview,
  togglePublish,
  updateReview,
  deleteReview,
  getReviewsStats,
};