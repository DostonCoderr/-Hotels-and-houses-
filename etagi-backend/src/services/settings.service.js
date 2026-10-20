const prisma = require('../config/db');

// ============================================================
// GET ALL — barcha sozlamalar (grouped)
// ============================================================
async function getAllSettings() {
  const settings = await prisma.setting.findMany({
    orderBy: [{ group: 'asc' }, { key: 'asc' }],
  });

  // Group by
  const grouped = {};
  settings.forEach(s => {
    if (!grouped[s.group]) grouped[s.group] = {};
    grouped[s.group][s.key] = s.value;
  });

  return grouped;
}

// ============================================================
// GET BY GROUP
// ============================================================
async function getSettingsByGroup(group) {
  const settings = await prisma.setting.findMany({
    where: { group },
    orderBy: { key: 'asc' },
  });

  const result = {};
  settings.forEach(s => {
    result[s.key] = s.value;
  });

  return result;
}

// ============================================================
// GET BY KEY
// ============================================================
async function getSetting(key) {
  const setting = await prisma.setting.findUnique({
    where: { key },
  });

  if (!setting) {
    const err = new Error('Настройка не найдена');
    err.status = 404;
    throw err;
  }

  return setting;
}

// ============================================================
// SET (upsert — bor bo'lsa yangilaydi, yo'q bo'lsa yaratadi)
// ============================================================
async function setSetting(key, value, group = 'general') {
  return prisma.setting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value), group },
  });
}

// ============================================================
// SET MANY (bulk update)
// ============================================================
async function setManySettings(settings) {
  // settings: { key1: 'value1', key2: 'value2', ... }
  // yoki: [{ key, value, group }, ...]

  const operations = [];

  if (Array.isArray(settings)) {
    for (const s of settings) {
      operations.push(
        prisma.setting.upsert({
          where: { key: s.key },
          update: { value: String(s.value) },
          create: {
            key: s.key,
            value: String(s.value),
            group: s.group || 'general',
          },
        })
      );
    }
  } else {
    for (const [key, value] of Object.entries(settings)) {
      operations.push(
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value), group: 'general' },
        })
      );
    }
  }

  await Promise.all(operations);

  return getAllSettings();
}

// ============================================================
// DELETE
// ============================================================
async function deleteSetting(key) {
  await getSetting(key);
  await prisma.setting.delete({ where: { key } });
  return { message: 'Настройка удалена' };
}

module.exports = {
  getAllSettings,
  getSettingsByGroup,
  getSetting,
  setSetting,
  setManySettings,
  deleteSetting,
};