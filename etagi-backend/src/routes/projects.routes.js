const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projects.controller');
const { requireAdmin } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

router.post('/admin', requireAdmin, ctrl.create);
router.put('/admin/:id', requireAdmin, ctrl.update);
router.delete('/admin/:id', requireAdmin, ctrl.remove);

module.exports = router;