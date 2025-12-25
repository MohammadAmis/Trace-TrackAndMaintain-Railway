const express = require('express');
const { getStats, getZoneDistribution, getComponentFrequencies, getTrends } = require('../controllers/analytics');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/zones', authorize('Super Admin'), getZoneDistribution);
router.get('/components', authorize('Super Admin', 'Zonal Admin'), getComponentFrequencies);
router.get('/trends', authorize('Super Admin', 'Zonal Admin'), getTrends);

module.exports = router;
