const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  const num = Number(this);
  // Agar Number xavfsiz chegarada bo'lsa — raqam qaytaramiz
  if (Number.isSafeInteger(num)) {
    return num;
  }
  // Aks holda string (juda katta sonlar uchun)
  return this.toString();
};


const app = express();

// ============================================================
// SECURITY & CORS
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ✅ Ruxsat etilgan domenlar
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001',
  'https://doveriya-hotels-nu.vercel.app', // Frontend
  'https://hotels-and-houses-omega.vercel.app' // Admin
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman yoki mobil ilovalar uchun (origin yo'q bo'lsa ruxsat beramiz)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloklandi:', origin);
      callback(new Error('CORS ruxsat bermadi'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,  // ← dev'da 1000
  message: 'Слишком много запросов, попробуйте позже',
  skip: (req) => {
    // Auth uchun rate limit'ni yumshatish
    return req.path.includes('/auth/');
  },
});
app.use('/api', limiter);

// ============================================================
// BODY PARSER
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// STATIC FILES
// ============================================================
app.use('/uploads', express.static('uploads'));

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================
// ROUTES
// ============================================================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/properties', require('./routes/properties.routes'));
app.use('/api/complexes', require('./routes/complexes.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/applications', require('./routes/applications.routes'));
app.use('/api/favorites', require('./routes/favorites.routes'));
app.use('/api/history', require('./routes/history.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/promotions', require('./routes/promotions.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/employees', require('./routes/employees.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/seo', require('./routes/seo.routes'));
app.use('/api/logs', require('./routes/logs.routes'));
app.use('/api/admins', require('./routes/admins.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));
app.use('/api/projects', require('./routes/projects.routes'));



// ============================================================
// 404
// ============================================================
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// ============================================================
// ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера',
  });
});

module.exports = app;