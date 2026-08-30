const Trip = require('../models/Trip');
const { generateItinerary } = require('../utils/aiService');

// @desc    Generate a new travel itinerary and save it to DB
// @route   POST /api/trips/generate
// @access  Private
const generateTrip = async (req, res) => {
  const {
    destination,
    startDate,
    endDate,
    numberOfDays,
    budget,
    budgetCateg,
    travelType,
    interests
  } = req.body;

  try {
    // Validations
    if (!destination || !startDate || !endDate || !numberOfDays || !budget || !budgetCateg || !travelType) {
      return res.status(400).json({ message: 'Please provide all required parameters.' });
    }

    if (numberOfDays <= 0 || numberOfDays > 45) {
      return res.status(400).json({ message: 'Number of days must be between 1 and 45.' });
    }

    if (budget <= 0) {
      return res.status(400).json({ message: 'Budget must be a positive number.' });
    }

    // Call AI Service (which returns parsed JSON)
    const generatedItinerary = await generateItinerary({
      destination,
      numberOfDays,
      budget,
      budgetCateg,
      travelType,
      interests: interests || [],
      startDate,
      endDate
    });

    // Create & Save Trip in DB
    const trip = await Trip.create({
      userId: req.user._id,
      destination,
      startDate,
      endDate,
      numberOfDays,
      budget,
      budgetCateg,
      travelType,
      interests: interests || [],
      generatedItinerary
    });

    res.status(201).json(trip);

  } catch (error) {
    console.error('Error in generateTrip controller:', error.message);
    res.status(500).json({ message: 'Failed to generate itinerary. Please try again.' });
  }
};

// @desc    Get all saved itineraries for the logged-in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch itineraries.' });
  }
};

// @desc    Get a single itinerary by ID
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Security check: Ensure trip belongs to the authenticated user
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this itinerary' });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an itinerary
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Security check: Ensure trip belongs to the authenticated user
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this itinerary' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateTrip,
  getTrips,
  getTripById,
  deleteTrip
};
