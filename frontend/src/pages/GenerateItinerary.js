import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';

const INTERESTS_OPTIONS = [
  { id: 'Adventure', label: '🧗 Adventure' },
  { id: 'Nature', label: '🌲 Nature' },
  { id: 'Food', label: '🍕 Food & Dining' },
  { id: 'Shopping', label: '🛍️ Shopping' },
  { id: 'Historical Places', label: '🏛️ Historical Places' },
  { id: 'Nightlife', label: '🍹 Nightlife' },
  { id: 'Beaches', label: '🏖️ Beaches' },
];

const GenerateItinerary = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [budget, setBudget] = useState('');
  const [budgetCateg, setBudgetCateg] = useState('Medium');
  const [travelType, setTravelType] = useState('Solo');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Automatically calculate number of days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start/end days
      
      if (end >= start) {
        setNumberOfDays(diffDays);
        setError(null);
      } else {
        setNumberOfDays(0);
        setError('End date must be on or after start date.');
      }
    } else {
      setNumberOfDays(0);
    }
  }, [startDate, endDate]);

  const handleInterestChange = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!destination.trim()) {
      setError('Please enter a destination.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }
    if (numberOfDays > 45) {
      setError('AI itinerary generation is limited to a maximum of 45 days.');
      return;
    }
    if (!budget || Number(budget) <= 0) {
      setError('Please enter a valid positive budget amount.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/trips/generate', {
        destination,
        startDate,
        endDate,
        numberOfDays,
        budget: Number(budget),
        budgetCateg,
        travelType,
        interests: selectedInterests,
      });

      // Redirect to View Itinerary page
      navigate(`/view/${response.data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner destination={destination || 'your destination'} />;
  }

  return (
    <div className="generate-form-container">
      <div className="form-card">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2>Design Your Dream Getaway</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Fill in your trip details and let the AI generate a custom, budget-optimized plan.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Destination */}
          <div className="form-group">
            <label htmlFor="destination">Where are you going?</label>
            <input
              type="text"
              id="destination"
              className="form-input"
              placeholder="e.g. Paris, Tokyo, Bali"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Dates Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration Indicator */}
          {numberOfDays > 0 && (
            <div
              style={{
                backgroundColor: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#fff',
                display: 'inline-block'
              }}
            >
              ⏱️ Trip Duration: {numberOfDays} Days
            </div>
          )}

          {/* Budget Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="budget">Total Trip Budget ($)</label>
              <input
                type="number"
                id="budget"
                className="form-input"
                placeholder="e.g. 1500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="budgetCateg">Budget Category</label>
              <select
                id="budgetCateg"
                className="form-select"
                value={budgetCateg}
                onChange={(e) => setBudgetCateg(e.target.value)}
              >
                <option value="Low">Low (Backpacker / Hostel / Cheap Eats)</option>
                <option value="Medium">Medium (Balanced / 3★ Hotel / Casual Diners)</option>
                <option value="Luxury">Luxury (Premium / Resorts / Fine Dining)</option>
              </select>
            </div>
          </div>

          {/* Travel Type */}
          <div className="form-group">
            <label htmlFor="travelType">Who is traveling?</label>
            <select
              id="travelType"
              className="form-select"
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
            >
              <option value="Solo">Solo Traveler</option>
              <option value="Couple">Couple / Romantic</option>
              <option value="Family">Family (with kids/elders)</option>
              <option value="Friends">Group of Friends</option>
            </select>
          </div>

          {/* Interests Checklist */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Select Your Interests</label>
            <div className="interest-selector-grid">
              {INTERESTS_OPTIONS.map((option) => {
                const isChecked = selectedInterests.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`interest-checkbox-label ${isChecked ? 'checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleInterestChange(option.id)}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Create AI Itinerary
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateItinerary;
