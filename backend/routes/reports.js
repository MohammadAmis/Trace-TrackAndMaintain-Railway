const express = require('express');
const { getReports, updateStatus, createReport } = require('../controllers/reports');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getReports);
router.post('/', createReport);
router.patch('/:id/status', updateStatus);

module.exports = router;
