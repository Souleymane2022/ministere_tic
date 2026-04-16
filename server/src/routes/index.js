const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/users', require('../modules/users/users.routes'));
router.use('/directions', require('../modules/directions/directions.routes'));
router.use('/documents', require('../modules/documents/documents.routes'));
router.use('/rh', require('../modules/rh/rh.routes'));
router.use('/dashboard', require('../modules/dashboard/dashboard.routes'));
router.use('/finance', require('../modules/finance/finance.routes'));
router.use('/communication', require('../modules/communication/communication.routes'));
router.use('/projets', require('../modules/projets/projets.routes'));
router.use('/admin', require('../modules/admin/admin.routes'));

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API SHT opérationnelle', timestamp: new Date().toISOString() });
});

module.exports = router;
