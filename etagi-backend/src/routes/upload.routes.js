const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/upload.controller');
const { upload } = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');
const uploadController = require('../controllers/upload.controller'); 

// ============================================================
// PROPERTY IMAGES
// ============================================================
router.post(
  '/properties/:propertyId/images',
  requireAdmin,
  upload.array('images', 20),
  ctrl.uploadPropertyImages
);

router.post(
  '/projects/:projectId/images',
  requireAdmin,
  upload.array('images', 10),
  ctrl.uploadProjectImages
);


// ============================================================
// EMPLOYEE PHOTO
// ============================================================
router.post(
  '/employees/:employeeId/photo',
  requireAdmin,
  upload.single('photo'),   // ← "photo" — bitta fayl
  uploadController.uploadEmployeePhoto
);

// ============================================================
// EMPLOYEE PHOTO
// ============================================================
router.post(
  '/employees/:employeeId/photo',
  requireAdmin,
  upload.single('photo'),   // ← "photo" — bitta fayl
  uploadController.uploadEmployeePhoto
);

// ============================================================
// IMAGE OPERATIONS
// ============================================================
router.delete('/images/:id', requireAdmin, ctrl.deleteImage);
router.post('/images/:id/main', requireAdmin, ctrl.setMainImage);
router.post('/images/reorder', requireAdmin, ctrl.reorderImages);


module.exports = router;