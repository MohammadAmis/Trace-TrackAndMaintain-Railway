const express = require('express');
const { getTrains, createTrain, getCoaches, getComponents } = require('../controllers/masters');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/trains', getTrains);
router.post('/trains', authorize('Super Admin'), createTrain);
router.get('/coaches', getCoaches);
router.get('/components', getComponents);

module.exports = router;
