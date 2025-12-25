const express = require('express');
const { getSLASummary, getEscalations } = require('../controllers/sla');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getSLASummary);
router.get('/escalations', getEscalations);

module.exports = router;
