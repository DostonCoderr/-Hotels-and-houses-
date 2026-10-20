const prisma = require('../config/db');

// ============================================================
// YORDAMCHI — bo'sh qatorlarni null ga aylantiradi
// ============================================================
function toRow(data) {
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords || null,
    ogTitle: data.ogTitle || null,
    ogDescription: data.ogDescription || null,
    ogImage: data.ogImage || null,
    slug: data.slug || null,
  };
}

// ============================================================
// GET ALL
// ============================================================
async function getAllSeo() {
  return prisma.seo.findMany({ orderBy: { page: 'asc' } });
}

// ============================================================
// FIND (topilmasa null — 404 tashlamaydi)
// ============================================================
async function findSeo(page) {
  return prisma.seo.findUnique({ where: { page } });
}

// ============================================================
// GET BY PAGE (topilmasa 404)
// ============================================================
async function getSeoByPage(page) {
  const seo = await findSeo(page);
  if (!seo) {
    const err = new Error('SEO не найдено');
    err.status = 404;
    throw err;
  }
  return seo;
}

// ============================================================
// UPSERT
// ============================================================
async function upsertSeo(page, data) {
  const row = toRow(data);
  return prisma.seo.upsert({
    where: { page },
    update: row,
    create: { page, ...row },
  });
}

// ============================================================
// BULK UPSERT — bitta tranzaksiya (yoki hammasi, yoki hech narsa)
// ============================================================
async function bulkUpsertSeo(items) {
  return prisma.$transaction(
    items.map(({ page, ...data }) => {
      const row = toRow(data);
      return prisma.seo.upsert({
        where: { page },
        update: row,
        create: { page, ...row },
      });
    })
  );
}

// ============================================================
// DELETE
// ============================================================
async function deleteSeo(page) {
  await getSeoByPage(page);
  await prisma.seo.delete({ where: { page } });
  return { message: 'SEO удалено' };
}

// ============================================================
// OG DATA (frontend uchun, ommaviy)
// ============================================================
async function getOgData(page) {
  const seo = await findSeo(page);
  if (!seo) return null;

  return {
    title: seo.ogTitle || seo.title,
    description: seo.ogDescription || seo.description,
    image: seo.ogImage,
    url: seo.slug,
  };
}

module.exports = {
  getAllSeo,
  findSeo,
  getSeoByPage,
  upsertSeo,
  bulkUpsertSeo,
  deleteSeo,
  getOgData,
};