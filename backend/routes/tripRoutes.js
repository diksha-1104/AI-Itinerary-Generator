const express = require('express');
const router = express.Router();
const {
  generateTrip,
  getTrips,
  getTripById,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// All trip routes are protected
router.use(protect);

router.post('/generate', generateTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);

module.exports = router;
