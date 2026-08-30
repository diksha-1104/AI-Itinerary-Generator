import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const SavedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all saved trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await API.get('/trips');
      setTrips(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load saved itineraries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Delete trip
  const handleDeleteTrip = async (id, destination) => {
    if (window.confirm(`Are you sure you want to delete your itinerary for ${destination}?`)) {
      try {
        await API.delete(`/trips/${id}`);
        setTrips(trips.filter((trip) => trip._id !== id));
        setSuccessMsg(`Itinerary for ${destination} deleted successfully.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        console.error(err);
        setError('Failed to delete itinerary.');
        setTimeout(() => setError(''), 4000);
      }
    }
  };

  // Filter trips based on search term AND budget category filter
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBudget = budgetFilter === 'All' || trip.budgetCateg === budgetFilter;
    return matchesSearch && matchesBudget;
  });

  return (
    <div className="saved-trips-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>My Saved Adventures</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Browse and manage your compiled AI travel itineraries.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Search */}
        <div className="search-input-wrapper" style={{ flex: '1 1 300px' }}>
          <svg
            className="search-icon-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Filter by destination name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Budget category tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Low', 'Medium', 'Luxury'].map((categ) => (
            <button
              key={categ}
              onClick={() => setBudgetFilter(categ)}
              className={`btn ${budgetFilter === categ ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              {categ} {categ !== 'All' ? 'Budget' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Trips list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div className="spinner"></div>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="trips-grid">
          {filteredTrips.map((trip) => (
            <div key={trip._id} className="trip-card">
              <div className="trip-card-image-placeholder">
                🛫
                <span className={`trip-card-badge ${trip.budgetCateg.toLowerCase()}`}>
                  {trip.budgetCateg}
                </span>
              </div>
              <div className="trip-card-body">
                <h3 className="trip-card-dest">{trip.destination}</h3>
                <div className="trip-card-meta">
                  <span>📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  <span>⏱️ {trip.numberOfDays} Days • {trip.travelType}</span>
                </div>
                <div className="trip-card-interests">
                  {trip.interests.map((interest, idx) => (
                    <span key={idx} className="interest-tag">{interest}</span>
                  ))}
                </div>
                <div className="trip-card-footer">
                  <div className="trip-card-price">
                    ${trip.budget.toLocaleString()}
                    <span>Planned Budget</span>
                  </div>
                  <div className="trip-card-actions">
                    <Link to={`/view/${trip._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      View Plan
                    </Link>
                    <button
                      onClick={() => handleDeleteTrip(trip._id, trip.destination)}
                      className="trip-card-action-btn delete"
                      title="Delete Itinerary"
                      aria-label={`Delete itinerary for ${trip.destination}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon">🧳</span>
          <h3>No matching itineraries</h3>
          <p>
            {searchTerm || budgetFilter !== 'All'
              ? 'Try modifying your search query or changing the budget filter selection.'
              : 'You have not saved any trip plans yet.'}
          </p>
          {!searchTerm && budgetFilter === 'All' && (
            <Link to="/generate" className="btn btn-primary">Plan a Trip Now</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedTrips;
