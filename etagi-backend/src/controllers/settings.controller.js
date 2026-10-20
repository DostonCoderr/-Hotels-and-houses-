const settingsService = require('../services/settings.service');
const { logActivity } = require('../utils/activityLog');
const { z } = require('zod');

const setSchema = z.object({
  key: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
  group: z.string().optional(),
});

const setManySchema = z.union([
  z.record(z.string(), z.any()),
  z.array(setSchema),
]);

async function getAll(req, res, next) {
  try {
    const settings = await settingsService.getAllSettings();
    res.json(settings);
  } catch (err) { next(err); }
}

async function getByGroup(req, res, next) {
  try {
    const settings = await settingsService.getSettingsByGroup(req.params.group);
    res.json(settings);
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const setting = await settingsService.getSetting(req.params.key);
    res.json(setting);
  } catch (err) { next(err); }
}

async function set(req, res, next) {
  try {
    const data = setSchema.parse(req.body);
    const setting = await settingsService.setSetting(
      data.key,
      data.value,
      data.group || 'general'
    );
    await logActivity(req.adminId, 'update', 'setting', null, `Настройка ${data.key}`, req);
    res.json(setting);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function setMany(req, res, next) {
  try {
    const settings = setManySchema.parse(req.body);
    const result = await settingsService.setManySettings(settings);
    await logActivity(req.adminId, 'update', 'settings', null, 'Массовое обновление настроек', req);
    res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await settingsService.deleteSetting(req.params.key);
    await logActivity(req.adminId, 'delete', 'setting', null, `Удалена настройка ${req.params.key}`, req);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { getAll, getByGroup, getOne, set, setMany, remove };