const express = require('express');
const { listTravels, getTravel, searchTravels } = require('../controllers/travelController');

const router = express.Router();

router.get('/search', searchTravels);
router.get('/', listTravels);
router.get('/:id', getTravel);

module.exports = router;
