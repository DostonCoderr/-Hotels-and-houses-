const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const prisma = require('../config/db');

// ============================================================
// OPTIMIZE IMAGE — WebP formatga o'tkazish + o'lchamni kichraytirish
// ============================================================
async function optimizeImage(filePath, options = {}) {
  const {
    width = 1600,
    quality = 85,
    format = 'webp',
  } = options;

  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);
  const newPath = path.join(dir, basename + '.' + format);

  await sharp(filePath)
    .resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .toFormat(format, { quality })
    .toFile(newPath);

  // Original faylni o'chirish (agar boshqa format bo'lsa)
  if (filePath !== newPath) {
    try {
      await fs.unlink(filePath);
    } catch (e) {}
  }

  return newPath;
}

// ============================================================
// CREATE THUMBNAIL
// ============================================================
async function createThumbnail(filePath, options = {}) {
  const { width = 400, quality = 80 } = options;

  const dir = path.dirname(filePath);
  const basename = path.basename(filePath, path.extname(filePath));
  const thumbPath = path.join(dir, basename + '-thumb.webp');

  await sharp(filePath)
    .resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .toFormat('webp', { quality })
    .toFile(thumbPath);

  return thumbPath;
}

// ============================================================
// UPLOAD PROPERTY IMAGES (bir nechta)
// ============================================================
async function uploadPropertyImages(propertyId, files, options = {}) {
  const results = [];

  // Property mavjudligini tekshirish
  const property = await prisma.property.findUnique({
    where: { id: parseInt(propertyId) },
  });

  if (!property) {
    const err = new Error('Объект не найден');
    err.status = 404;
    throw err;
  }

  // Hozirgi rasmlar soni
  const existing = await prisma.image.count({
    where: { propertyId: parseInt(propertyId) },
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Optimize
    const optimized = await optimizeImage(file.path, options);
    const thumb = await createThumbnail(optimized, options);

    // Relative URL
    const relativeUrl = optimized.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\/?uploads/, '/uploads');
    const thumbUrl = thumb.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\/?uploads/, '/uploads');

    // Bazaga saqlash
    const image = await prisma.image.create({
      data: {
        url: relativeUrl,
        alt: file.originalname,
        order: existing + i,
        isMain: existing === 0 && i === 0,
        propertyId: parseInt(propertyId),
      },
    });

    results.push(image);
  }

  return results;
}

// ============================================================
// UPLOAD EMPLOYEE PHOTO
// ============================================================
async function uploadEmployeePhoto(employeeId, file) {
  // Employee mavjudligini tekshirish
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(employeeId) },
    select: { id: true, name: true, photo: true },
  });

  if (!employee) {
    const err = new Error('Сотрудник не найден');
    err.status = 404;
    throw err;
  }

  // Eski rasmni o'chirish
  if (employee.photo) {
    const oldPath = path.join(__dirname, '../../uploads', path.basename(employee.photo));
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Yangi rasm URL
  const photoUrl = `/uploads/${file.filename}`;

  // Employee'ni yangilash
  const updated = await prisma.employee.update({
    where: { id: parseInt(employeeId) },
    data: { photo: photoUrl },
  });

  return {
    message: 'Фото загружено',
    employee: updated,
    photo: photoUrl,
  };
}

// ============================================================
// UPLOAD COMPLEX IMAGES
// ============================================================
async function uploadComplexImages(complexId, files, options = {}) {
  const results = [];

  const complex = await prisma.residentialComplex.findUnique({
    where: { id: parseInt(complexId) },
  });

  if (!complex) {
    const err = new Error('ЖК не найден');
    err.status = 404;
    throw err;
  }

  const existing = await prisma.image.count({
    where: { complexId: parseInt(complexId) },
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const optimized = await optimizeImage(file.path, options);
    await createThumbnail(optimized, options);

    const relativeUrl = optimized.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\/?uploads/, '/uploads');

    const image = await prisma.image.create({
      data: {
        url: relativeUrl,
        alt: file.originalname,
        order: existing + i,
        isMain: existing === 0 && i === 0,
        complexId: parseInt(complexId),
      },
    });

    results.push(image);
  }

  return results;
}

// ============================================================
// DELETE IMAGE
// ============================================================
async function deleteImage(imageId) {
  const image = await prisma.image.findUnique({
    where: { id: parseInt(imageId) },
  });

  if (!image) {
    const err = new Error('Изображение не найдено');
    err.status = 404;
    throw err;
  }

  // Faylni diskdan o'chirish
  const filePath = path.join(process.cwd(), image.url.replace(/^\/uploads/, 'uploads'));
  try {
    await fs.unlink(filePath);
    // Thumbnail ham
    const thumbPath = filePath.replace('.webp', '-thumb.webp');
    await fs.unlink(thumbPath).catch(() => {});
  } catch (e) {}

  // Bazadan o'chirish
  await prisma.image.delete({ where: { id: parseInt(imageId) } });

  return { message: 'Изображение удалено' };
}

// ============================================================
// SET MAIN IMAGE
// ============================================================
async function setMainImage(imageId) {
  const image = await prisma.image.findUnique({
    where: { id: parseInt(imageId) },
  });

  if (!image) {
    const err = new Error('Изображение не найдено');
    err.status = 404;
    throw err;
  }

  // Oldingi main image'ni olib tashlash
  if (image.propertyId) {
    await prisma.image.updateMany({
      where: { propertyId: image.propertyId, isMain: true },
      data: { isMain: false },
    });
  }
  if (image.complexId) {
    await prisma.image.updateMany({
      where: { complexId: image.complexId, isMain: true },
      data: { isMain: false },
    });
  }

  // Yangi main
  return prisma.image.update({
    where: { id: parseInt(imageId) },
    data: { isMain: true },
  });
}

// ============================================================
// REORDER IMAGES
// ============================================================
async function reorderImages(orderList) {
  // orderList: [{ id: 1, order: 0 }, { id: 2, order: 1 }, ...]
  const updates = orderList.map(item =>
    prisma.image.update({
      where: { id: parseInt(item.id) },
      data: { order: parseInt(item.order) },
    })
  );

  await Promise.all(updates);

  return { message: 'Порядок обновлён' };
}

module.exports = {
  optimizeImage,
  createThumbnail,
  uploadPropertyImages,
  uploadComplexImages,
  deleteImage,
  setMainImage,
  reorderImages,
  uploadEmployeePhoto,
};