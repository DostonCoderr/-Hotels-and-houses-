const reviewsService = require('../services/reviews.service');
const { z } = require('zod');

const createSchema = z.object({
  name: z.string().min(2),
  photo: z.string().optional(),
  text: z.string().min(10),
  rating: z.number().int().min(1).max(5),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  photo: z.string().optional(),
  text: z.string().min(10).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

async function getPublished(req, res, next) {
  try {
    const result = await reviewsService.getPublishedReviews(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function getAll(req, res, next) {
  try {
    const result = await reviewsService.getAllReviews(req.query);
    res.json(result);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const review = await reviewsService.createReview(data);
    res.status(201).json({
      message: 'Отзыв отправлен на модерацию',
      review,
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const review = await reviewsService.updateReview(req.params.id, data);
    res.json(review);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function togglePublish(req, res, next) {
  try {
    const review = await reviewsService.togglePublish(req.params.id);
    res.json({
      message: review.published ? 'Отзыв опубликован' : 'Отзыв скрыт',
      review,
    });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const result = await reviewsService.deleteReview(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

async function getStats(req, res, next) {
  try {
    const stats = await reviewsService.getReviewsStats();
    res.json(stats);
  } catch (err) { next(err); }
}

module.exports = { getPublished, getAll, create, update, togglePublish, remove, getStats };