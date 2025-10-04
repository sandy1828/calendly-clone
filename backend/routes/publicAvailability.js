const express = require('express');
const router = express.Router();
const { getByUsername } = require('../controllers/publicAvailabilityController');

router.get('/:username', getByUsername);

module.exports = router;
