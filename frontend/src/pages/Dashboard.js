import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all saved trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await API.get('/trips');
      setTrips(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load itineraries. Please check your connection.');
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

  // Filter trips based on search term
  const filteredTrips = trips.filter((trip) =>
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalTrips = trips.length;
  const uniqueDestinations = new Set(trips.map((t) => t.destination.toLowerCase())).size;
  const totalBudgetSpent = trips.reduce((sum, t) => sum + (t.budget || 0), 0);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Welcome back, {user?.name}!</h2>
          <p>Explore your plans, design a new trip, or manage your upcoming events.</p>
        </div>
        <Link to="/generate" className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Plan New Trip
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Stats Summary Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✈️</div>
          <div className="stat-info">
            <div className="stat-value">{totalTrips}</div>
            <div className="stat-label">Trips Planned</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-info">
            <div className="stat-value">{uniqueDestinations}</div>
            <div className="stat-label">Destinations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <div className="stat-value">${totalBudgetSpent.toLocaleString()}</div>
            <div className="stat-label">Total Budget</div>
          </div>
        </div>
      </div>

      {/* Search & Header */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
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
            placeholder="Search saved trips by destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Itineraries List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}>
          <div className="spinner"></div>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="trips-grid">
          {filteredTrips.map((trip) => (
            <div key={trip._id} className="trip-card">
              <div className="trip-card-image-placeholder">
                🌴
                <span className={`trip-card-badge ${trip.budgetCateg.toLowerCase()}`}>
                  {trip.budgetCateg}
                </span>
              </div>
              <div className="trip-card-body">
                <h3 className="trip-card-dest">{trip.destination}</h3>
                <div className="trip-card-meta">
                  <span>
                    📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                  <span>⏱️ {trip.numberOfDays} Days • {trip.travelType}</span>
                </div>
                <div className="trip-card-interests">
                  {trip.interests.map((interest, idx) => (
                    <span key={idx} className="interest-tag">
                      {interest}
                    </span>
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
          <span className="empty-state-icon">🗺️</span>
          <h3>No travel itineraries found</h3>
          <p>
            {searchTerm
              ? 'No trips match your search term. Try checking your spelling or search another location.'
              : "You haven't generated any itineraries yet. Let's create your first adventure plan!"}
          </p>
          {!searchTerm && (
            <Link to="/generate" className="btn btn-primary">
              Generate My First Itinerary
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
