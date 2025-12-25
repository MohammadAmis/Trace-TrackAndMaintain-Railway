const express = require('express');
const { getInspections, createInspection } = require('../controllers/inspections');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getInspections)
    .post(createInspection);

module.exports = router;
