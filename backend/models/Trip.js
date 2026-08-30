const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  numberOfDays: {
    type: Number,
    required: [true, 'Please add number of days']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget amount']
  },
  budgetCateg: {
    type: String,
    required: [true, 'Please select a budget category'],
    enum: ['Low', 'Medium', 'Luxury']
  },
  travelType: {
    type: String,
    required: [true, 'Please add travel type'],
    enum: ['Solo', 'Family', 'Friends', 'Couple']
  },
  interests: {
    type: [String],
    default: []
  },
  generatedItinerary: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', TripSchema);
