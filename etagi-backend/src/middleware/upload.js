const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

// ============================================================
// UPLOAD DIRECTORIES
// ============================================================
const UPLOAD_DIR = env.uploadDir || './uploads';
const PROPERTIES_DIR = path.join(UPLOAD_DIR, 'properties');
const COMPLEXES_DIR = path.join(UPLOAD_DIR, 'complexes');
const EMPLOYEES_DIR = path.join(UPLOAD_DIR, 'employees');
const AVATARS_DIR = path.join(UPLOAD_DIR, 'avatars');
const REVIEWS_DIR = path.join(UPLOAD_DIR, 'reviews');
const PROMOTIONS_DIR = path.join(UPLOAD_DIR, 'promotions');

// Papkalarni yaratish
[PROPERTIES_DIR, COMPLEXES_DIR, EMPLOYEES_DIR, AVATARS_DIR, REVIEWS_DIR, PROMOTIONS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============================================================
// STORAGE
// ============================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = UPLOAD_DIR;

    // ⚠️ TUZATILDI: req.originalUrl va req.path ni ham tekshirish
    const url = (req.originalUrl || req.url || '').toLowerCase();
    const path = (req.path || '').toLowerCase();

    // 1. Avatar (admins/me/avatar, /avatar)
    if (url.includes('avatar') || path.includes('avatar')) {
      dir = AVATARS_DIR;
    }
    // 2. Employees
    else if (url.includes('employee') || path.includes('employee')) {
      dir = EMPLOYEES_DIR;
    }
    // 3. Properties
    else if (url.includes('propert') || path.includes('propert')) {
      dir = PROPERTIES_DIR;
    }
    // 4. Complexes
    else if (url.includes('complex') || path.includes('complex')) {
      dir = COMPLEXES_DIR;
    }
    // 5. Reviews
    else if (url.includes('review') || path.includes('review')) {
      dir = REVIEWS_DIR;
    }
    // 6. Promotions
    else if (url.includes('promotion') || path.includes('promotion')) {
      dir = PROMOTIONS_DIR;
    }

    console.log('🔍 [upload] URL:', req.originalUrl);
    console.log('🔍 [upload] Tanlangan papka:', dir);

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

// ============================================================
// FILE FILTER
// ============================================================
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения: jpg, png, webp, gif, svg'));
  }
};

// ============================================================
// EXPORT
// ============================================================
const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSize || 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = {
  upload,
  UPLOAD_DIR,
  PROPERTIES_DIR,
  COMPLEXES_DIR,
  EMPLOYEES_DIR,
  AVATARS_DIR,
  REVIEWS_DIR,
  PROMOTIONS_DIR,
};