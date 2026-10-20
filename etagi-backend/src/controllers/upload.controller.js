const uploadService = require('../services/upload.service');
const prisma = require('../config/db');

// ============================================================
// UPLOAD PROPERTY IMAGES
// ============================================================
async function uploadPropertyImages(req, res, next) {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'Файлы не загружены' });
    }

    const images = await uploadService.uploadPropertyImages(
      req.params.propertyId,
      req.files
    );

    res.status(201).json({
      message: 'Изображения загружены',
      count: images.length,
      images,
    });
  } catch (err) { next(err); }
}

async function uploadProjectImages(req, res, next) {
  try {
    const projectId = parseInt(req.params.projectId);
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Файлы не загружены' });
    }

    // Proyekt mavjudligini tekshirish
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    // Mavjud rasmlar sonini aniqlash
    const existing = await prisma.image.count({
      where: { projectId: projectId },
    });

    const images = [];

    // Har bir faylni optimallashtirib, bazaga yozish
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Rasmni siqish (WebP formatga o'tkazish)
      const optimizedPath = await uploadService.optimizeImage(file.path);
      await uploadService.createThumbnail(optimizedPath);

      // URL ni to'g'rilash
      const relativeUrl = optimizedPath.replace(process.cwd(), '').replace(/\\/g, '/').replace(/^\/?uploads/, '/uploads');

      const image = await prisma.image.create({
        data: {
          url: relativeUrl,
          alt: file.originalname,
          order: existing + i,
          isMain: existing === 0 && i === 0, // Birinchi rasm asosiy bo'ladi
          projectId: projectId, 
        },
      });

      images.push(image);
    }

    res.status(201).json({ images });
  } catch (err) {
    console.error("❌ Project Image Upload Error:", err);
    next(err);
  }
}

// ============================================================
// UPLOAD EMPLOYEE PHOTO
// ============================================================
async function uploadEmployeePhoto(req, res, next) {
  try {
    const { employeeId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const result = await uploadService.uploadEmployeePhoto(
      employeeId,
      req.file
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// ============================================================
// UPLOAD COMPLEX IMAGES
// ============================================================
async function uploadComplexImages(req, res, next) {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'Файлы не загружены' });
    }

    const images = await uploadService.uploadComplexImages(
      req.params.complexId,
      req.files
    );

    res.status(201).json({
      message: 'Изображения загружены',
      count: images.length,
      images,
    });
  } catch (err) { next(err); }
}

// ============================================================
// DELETE IMAGE
// ============================================================
async function deleteImage(req, res, next) {
  try {
    const result = await uploadService.deleteImage(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
}

// ============================================================
// SET MAIN IMAGE
// ============================================================
async function setMainImage(req, res, next) {
  try {
    const image = await uploadService.setMainImage(req.params.id);
    res.json({ message: 'Главное изображение обновлено', image });
  } catch (err) { next(err); }
}

// ============================================================
// REORDER IMAGES
// ============================================================
async function reorderImages(req, res, next) {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'Неверный формат данных' });
    }
    const result = await uploadService.reorderImages(order);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = {
  uploadPropertyImages,
  uploadComplexImages,
  deleteImage,
  setMainImage,
  reorderImages,
  uploadEmployeePhoto,
  uploadProjectImages
};