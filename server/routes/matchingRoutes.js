const express = require('express');
const { getMatches } = require('../controllers/matchingController');

const router = express.Router();

router.get('/', getMatches);

module.exports = router;
