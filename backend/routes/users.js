const express = require('express');
const { getUsers, createUser } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('Super Admin', 'Zonal Admin'));

router.route('/')
    .get(getUsers)
    .post(createUser);

module.exports = router;
