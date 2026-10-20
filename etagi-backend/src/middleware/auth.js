const { verifyToken } = require('../utils/jwt');

// ============================================================
// REQUIRE AUTH (User)
// ============================================================
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Неверный или истёкший токен' });
  }

  // Admin tokeni bo'lsa — user endpointga ruxsat yo'q
  if (payload.type === 'admin') {
    return res.status(403).json({ error: 'Используйте админ-токен' });
  }

  req.userId = payload.userId;
  req.userEmail = payload.email;
  next();
}

// ============================================================
// REQUIRE ADMIN
// ============================================================
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log('🔍 [requireAdmin] Path:', req.path);
  console.log('🔍 [requireAdmin] Auth header:', authHeader ? 'mavjud' : 'yo\'q');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ [requireAdmin] Bearer token yo\'q');
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  const token = authHeader.slice(7);
  console.log('🔍 [requireAdmin] Token (birinchi 30):', token.slice(0, 30) + '...');

  const payload = verifyToken(token);
  console.log('🔍 [requireAdmin] Payload:', payload);

  if (!payload) {
    console.log('❌ [requireAdmin] Token yaroqsiz');
    return res.status(401).json({ error: 'Неверный или истёкший токен' });
  }

  if (payload.type !== 'admin') {
    console.log('❌ [requireAdmin] type !== admin, type =', payload.type);
    return res.status(403).json({ error: 'Требуется админ-доступ' });
  }

  req.adminId = payload.adminId;
  req.adminEmail = payload.email;
  req.adminRole = payload.role;
  console.log('✅ [requireAdmin] OK, adminId =', req.adminId);
  next();
}

// ============================================================
// REQUIRE PERMISSION (Role)
// ============================================================
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const prisma = require('../config/db');
      const admin = await prisma.admin.findUnique({
        where: { id: req.adminId },
        include: { role: true },
      });

      if (!admin) {
        return res.status(401).json({ error: 'Администратор не найден' });
      }

      const permissions = admin.role.permissions || [];
      const hasWildcard = permissions.includes('*');
      const hasPermission = permissions.includes(permission);

      if (!hasWildcard && !hasPermission) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

// ============================================================
// OPTIONAL AUTH (token bo'lsa ham, bo'lmasa ham)
// ============================================================
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload && payload.type !== 'admin') {
      req.userId = payload.userId;
      req.userEmail = payload.email;
    }
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requirePermission,
  optionalAuth,
};