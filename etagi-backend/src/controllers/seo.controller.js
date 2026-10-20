const seoService = require('../services/seo.service');
const { logActivity } = require('../utils/activityLog');
const { z } = require('zod');

// ============================================================
// SXEMA
// Bo'sh qator ('') kelsa — "berilmagan" deb hisoblanadi
// ============================================================
const blankToUndefined = (v) => (v === '' ? undefined : v);

const optionalText = (max) =>
  z.string().trim().max(max).optional().transform(blankToUndefined);

const ogImageField = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform(blankToUndefined)
  .refine((v) => v === undefined || /^https?:\/\/\S+$/i.test(v) || v.startsWith('/'), {
    message: 'invalid',
  });

// slug: to'liq URL yoki yo'l ("/novostroyki", "novostroyki/spb")
const slugField = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform(blankToUndefined)
  .refine((v) => v === undefined || /^(https?:\/\/\S+|\/?[a-z0-9\-_\/]+)$/i.test(v), {
    message: 'invalid',
  });

const seoSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(500),
  keywords: optionalText(500),
  ogTitle: optionalText(200),
  ogDescription: optionalText(500),
  ogImage: ogImageField,
  slug: slugField,
});

const PAGE_RE = /^[a-z0-9_-]{1,50}$/i;

const bulkSchema = z.object({
  items: z
    .array(seoSchema.extend({ page: z.string().regex(PAGE_RE) }))
    .min(1)
    .max(50),
});

// ============================================================
// Zod xatosini maydon kodlariga aylantiradi
//   { title: { code: 'too_short', min: 3 } }
// ============================================================
function issueToField(issue) {
  switch (issue.code) {
    case 'too_small':
      return { code: 'too_short', min: Number(issue.minimum) };
    case 'too_big':
      return { code: 'too_long', max: Number(issue.maximum) };
    case 'invalid_type':
      return { code: 'required' };
    case 'invalid_string':
    case 'invalid_enum_value':
    case 'custom':
      return { code: 'invalid' };
    default:
      return { code: 'invalid' };
  }
}

// ============================================================
// ✅ TUZATILGAN: validationError
//    - single: { <field>: <error> }
//    - bulk:   { <page>: { <field>: <error> } }
// ============================================================
function validationError(res, zodError, opts = {}) {
  const { bulk = false, items = [] } = opts;
  const issues = zodError.issues || zodError.errors || [];

  let fields;

  if (bulk) {
    // path: ['items', index, field]
    fields = {};
    for (const issue of issues) {
      const idx = issue.path[1];
      const key = issue.path[2];

      // ⚠️ Faqat maydon xatolarini olamiz (page nomini emas)
      if (typeof idx !== 'number' || typeof key !== 'string') continue;

      // ✅ page nomini items dan olamiz — `#0` emas!
      const pageName = items[idx]?.page;
      if (!pageName || !PAGE_RE.test(pageName)) continue;

      if (!fields[pageName]) fields[pageName] = {};
      if (!fields[pageName][key]) fields[pageName][key] = issueToField(issue);
    }
  } else {
    // path: ['title', 'too_small'...]
    fields = {};
    for (const issue of issues) {
      const key = issue.path[0];
      if (typeof key !== 'string') continue;
      if (!fields[key]) fields[key] = issueToField(issue);
    }
  }

  const fieldNames = Object.keys(fields);
  const errorMessage = fieldNames.length
    ? `Validation failed: ${fieldNames.join(', ')}`
    : 'Validation failed';

  return res.status(400).json({
    error: errorMessage,
    fields,
  });
}

// ============================================================
// Qaysi maydonlar o'zgargani (jurnal uchun)
// ============================================================
const TRACKED = ['title', 'description', 'keywords', 'ogTitle', 'ogDescription', 'ogImage', 'slug'];

function changedFields(before, data) {
  return TRACKED.filter((k) => (before?.[k] || '') !== (data[k] || ''));
}

function validPage(req, res) {
  if (!PAGE_RE.test(req.params.page || '')) {
    res.status(400).json({ error: 'Invalid page name' });
    return false;
  }
  return true;
}

// ============================================================
// HANDLERLAR
// ============================================================
async function getAll(req, res, next) {
  try {
    res.json(await seoService.getAllSeo());
  } catch (err) { next(err); }
}

async function getByPage(req, res, next) {
  try {
    if (!validPage(req, res)) return;
    res.json(await seoService.getSeoByPage(req.params.page));
  } catch (err) { next(err); }
}

async function getOg(req, res, next) {
  try {
    if (!validPage(req, res)) return;
    const og = await seoService.getOgData(req.params.page);
    if (!og) return res.status(404).json({ error: 'Не найдено' });

    // Ommaviy endpoint: 5 daqiqa keshlash
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json(og);
  } catch (err) { next(err); }
}

async function upsert(req, res, next) {
  try {
    if (!validPage(req, res)) return;
    const parsed = seoSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const { page } = req.params;
    const before = await seoService.findSeo(page);
    const seo = await seoService.upsertSeo(page, parsed.data);

    const changed = before ? changedFields(before, parsed.data) : [];
    const details = before
      ? `SEO для ${page}: ${changed.length ? changed.join(', ') : 'без изменений'}`
      : `SEO для ${page}: создано`;
    await logActivity(req.adminId, before ? 'update' : 'create', 'seo', null, details, req);

    res.json(seo);
  } catch (err) { next(err); }
}

// ============================================================
// ✅ TUZATILGAN: bulkUpsert
// ============================================================
async function bulkUpsert(req, res, next) {
  try {
    const parsed = bulkSchema.safeParse(req.body);

    if (!parsed.success) {
      // ✅ `req.body.items` ni `validationError` ga uzatamiz
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      return validationError(res, parsed.error, { bulk: true, items });
    }

    const items = parsed.data.items;
    const pages = items.map((i) => i.page);

    // ✅ Takroriy sahifa nomlari
    if (new Set(pages).size !== pages.length) {
      const dupes = pages.filter((p, i) => pages.indexOf(p) !== i);
      return res.status(400).json({
        error: `Duplicate pages: ${dupes.join(', ')}`,
        fields: Object.fromEntries(dupes.map((p) => [p, { page: { code: 'invalid' } }])),
      });
    }

    const saved = await seoService.bulkUpsertSeo(items);
    await logActivity(req.adminId, 'update', 'seo', null, `SEO (bulk): ${pages.join(', ')}`, req);

    res.json({ items: saved });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    if (!validPage(req, res)) return;
    const result = await seoService.deleteSeo(req.params.page);
    await logActivity(req.adminId, 'delete', 'seo', null, `Удалено SEO для ${req.params.page}`, req);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { getAll, getByPage, getOg, upsert, bulkUpsert, remove };