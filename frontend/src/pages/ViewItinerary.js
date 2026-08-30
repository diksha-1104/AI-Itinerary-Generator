import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const ViewItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/trips/${id}`);
        setTrip(response.data);
        
        // Default first day expanded
        setExpandedDays({ 1: true });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch itinerary details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const toggleDay = (dayNum) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!trip) return;
    const itineraryText = formatItineraryForCopy(trip);
    navigator.clipboard.writeText(itineraryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Do you want to regenerate this itinerary? This will create a new updated version with fresh recommendations.')) {
      return;
    }

    setRegenerating(true);
    setError(null);
    try {
      const response = await API.post('/trips/generate', {
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        numberOfDays: trip.numberOfDays,
        budget: trip.budget,
        budgetCateg: trip.budgetCateg,
        travelType: trip.travelType,
        interests: trip.interests,
      });

      // Redirect to the newly generated trip id
      navigate(`/view/${response.data._id}`);
      window.location.reload(); // Force refresh to fetch the new trip
    } catch (err) {
      console.error(err);
      setError('Failed to regenerate itinerary. Please try again.');
      setRegenerating(false);
    }
  };

  // Helper to format the itinerary in text for copying to clipboard
  const formatItineraryForCopy = (t) => {
    const data = t.generatedItinerary;
    let text = `✈️ AI TRAVEL ITINERARY FOR ${t.destination.toUpperCase()}\n`;
    text += `📅 Dates: ${new Date(t.startDate).toLocaleDateString()} to ${new Date(t.endDate).toLocaleDateString()} (${t.numberOfDays} Days)\n`;
    text += `💰 Budget: $${t.budget} (${t.budgetCateg} Tier)\n`;
    text += `👥 Group Type: ${t.travelType}\n`;
    text += `========================================\n\n`;
    
    text += `💵 ESTIMATED BUDGET BREAKDOWN\n`;
    text += `- Total Trip Cost: $${data.estimatedTotalCost}\n`;
    text += `- Stay: $${data.budgetBreakdown?.stay || 0}\n`;
    text += `- Food: $${data.budgetBreakdown?.food || 0}\n`;
    text += `- Transport: $${data.budgetBreakdown?.transport || 0}\n`;
    text += `- Activities: $${data.budgetBreakdown?.activities || 0}\n\n`;

    data.days.forEach((d) => {
      text += `📅 DAY ${d.day}: ${d.title}\n`;
      text += `🌅 Morning: ${d.morning?.activity} - ${d.morning?.details}\n`;
      text += `☀️ Afternoon: ${d.afternoon?.activity} - ${d.afternoon?.details}\n`;
      text += `🌃 Evening: ${d.evening?.activity} - ${d.evening?.details}\n`;
      text += `📍 Places to Visit: ${d.placesToVisit?.join(', ')}\n`;
      text += `🍕 Dining options: ${d.foodRecommendations?.join(', ')}\n`;
      text += `💸 Daily cost estimate: $${d.estimatedDailyExpense}\n\n`;
    });

    text += `💡 GENERAL TRAVEL TIPS\n`;
    data.travelTips?.forEach((tip) => {
      text += `- ${tip}\n`;
    });

    return text;
  };

  if (loading || regenerating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#fff' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
          {regenerating ? 'Regenerating itinerary...' : 'Loading your itinerary...'}
        </p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="main-content" style={{ textAlign: 'center' }}>
        <div className="alert alert-error">{error || 'Itinerary not found.'}</div>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  const { generatedItinerary } = trip;
  const isBudgetExceeded = generatedItinerary.estimatedTotalCost > trip.budget;
  const budgetRatio = Math.min((generatedItinerary.estimatedTotalCost / trip.budget) * 100, 100);

  return (
    <div className="view-itinerary-container">
      {/* Back Button */}
      <div>
        <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Header Info */}
      <div className={`view-itinerary-header ${trip.budgetCateg.toLowerCase()}`}>
        <div className="view-itinerary-header-info">
          <h2>{trip.destination}</h2>
          <p>
            📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} ({trip.numberOfDays} Days) • {trip.travelType}
          </p>
        </div>
        <div className="view-itinerary-actions">
          <button onClick={handleCopy} className="btn btn-secondary">
            {copied ? '✅ Copied!' : '📋 Copy Itinerary'}
          </button>
          <button onClick={handlePrint} className="btn btn-secondary">
            🖨️ Print / Save PDF
          </button>
          <button onClick={handleRegenerate} className="btn btn-primary">
            🔄 Regenerate AI Plan
          </button>
        </div>
      </div>

      {/* Budget Dashboard Panel */}
      <div className="budget-dashboard-card">
        <h3 className="budget-dashboard-title">
          <span>Budget Tracker Dashboard</span>
          <span className={`trip-card-badge ${trip.budgetCateg.toLowerCase()}`} style={{ position: 'static' }}>
            {trip.budgetCateg} Tier
          </span>
        </h3>

        <div className="budget-comparison-row">
          {/* Progress Tracker */}
          <div className="budget-progress-block">
            <div className="budget-val-labels">
              <span className="label">Estimated Total Cost vs Budget Limit</span>
              <span className="val">
                ${generatedItinerary.estimatedTotalCost.toLocaleString()} / ${trip.budget.toLocaleString()}
              </span>
            </div>
            
            <div className="budget-progress-track">
              <div
                className={`budget-progress-bar ${isBudgetExceeded ? 'exceeded' : 'within-budget'}`}
                style={{ width: `${budgetRatio}%` }}
              ></div>
            </div>

            {isBudgetExceeded && (
              <div className="budget-exceeded-warning">
                ⚠️ Warning: Your estimated expenses slightly exceed your set budget limit by ${ (generatedItinerary.estimatedTotalCost - trip.budget).toLocaleString() }. Review the suggestions panel below to reduce costs.
              </div>
            )}
          </div>

          {/* Breakdown cards */}
          <div className="budget-breakdown-grid">
            <div className="breakdown-card">
              <span className="breakdown-card-icon">🏨</span>
              <span className="breakdown-card-label">Stay</span>
              <span className="breakdown-card-val">
                ${(generatedItinerary.budgetBreakdown?.stay || 0).toLocaleString()}
              </span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-icon">🍔</span>
              <span className="breakdown-card-label">Food</span>
              <span className="breakdown-card-val">
                ${(generatedItinerary.budgetBreakdown?.food || 0).toLocaleString()}
              </span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-icon">🚇</span>
              <span className="breakdown-card-label">Transit</span>
              <span className="breakdown-card-val">
                ${(generatedItinerary.budgetBreakdown?.transport || 0).toLocaleString()}
              </span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-card-icon">🎟️</span>
              <span className="breakdown-card-label">Activities</span>
              <span className="breakdown-card-val">
                ${(generatedItinerary.budgetBreakdown?.activities || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Day-Wise Timeline Accordions */}
      <div className="itinerary-timeline">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Day-by-Day Travel Itinerary</h3>
        {generatedItinerary.days.map((dayPlan) => {
          const isExpanded = expandedDays[dayPlan.day];
          return (
            <div key={dayPlan.day} className="timeline-day-card">
              {/* Accordion Header */}
              <div className="timeline-day-header" onClick={() => toggleDay(dayPlan.day)}>
                <div className="timeline-day-title-block">
                  <span className="day-badge">Day {dayPlan.day}</span>
                  <span className="day-title">{dayPlan.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="day-cost-estimate">
                    Est. Cost: ${dayPlan.estimatedDailyExpense}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="timeline-day-content">
                  {/* Morning activity */}
                  <div className="activity-period">
                    <span className="activity-time-tag">🌅 Morning</span>
                    <div className="activity-body">
                      <div className="activity-title">{dayPlan.morning?.activity}</div>
                      <div className="activity-desc">{dayPlan.morning?.details}</div>
                    </div>
                  </div>

                  {/* Afternoon activity */}
                  <div className="activity-period">
                    <span className="activity-time-tag">☀️ Afternoon</span>
                    <div className="activity-body">
                      <div className="activity-title">{dayPlan.afternoon?.activity}</div>
                      <div className="activity-desc">{dayPlan.afternoon?.details}</div>
                    </div>
                  </div>

                  {/* Evening activity */}
                  <div className="activity-period">
                    <span className="activity-time-tag">🌃 Evening</span>
                    <div className="activity-body">
                      <div className="activity-title">{dayPlan.evening?.activity}</div>
                      <div className="activity-desc">{dayPlan.evening?.details}</div>
                    </div>
                  </div>

                  {/* Places to visit / Food recommendation grid */}
                  <div className="places-food-grid">
                    <div className="pf-block">
                      <h4>📍 Top Places to Visit</h4>
                      <ul className="pf-list">
                        {dayPlan.placesToVisit?.map((place, idx) => (
                          <li key={idx} className="pf-item">{place}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pf-block">
                      <h4>🍕 Food Recommendations</h4>
                      <ul className="pf-list">
                        {dayPlan.foodRecommendations?.map((food, idx) => (
                          <li key={idx} className="pf-item">{food}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggestions and Travel Tips panels */}
      <div className="tips-suggestions-row">
        {/* Cost suggestions */}
        <div className="panel-card">
          <h3 style={{ color: '#fca5a5' }}>
            <span>📉 Cost Saving Suggestions</span>
          </h3>
          <ul className="panel-list">
            {generatedItinerary.costSuggestions && generatedItinerary.costSuggestions.length > 0 ? (
              generatedItinerary.costSuggestions.map((suggestion, idx) => (
                <li key={idx} className="panel-list-item suggestion">
                  <span className="panel-list-item-icon">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))
            ) : (
              <li className="panel-list-item tip">
                <span className="panel-list-item-icon">✔️</span>
                <span>You are completely within your budget! Keep up the good expense tracking.</span>
              </li>
            )}
          </ul>
        </div>

        {/* Travel tips */}
        <div className="panel-card">
          <h3>
            <span>💡 Destination Travel Tips</span>
          </h3>
          <ul className="panel-list">
            {generatedItinerary.travelTips?.map((tip, idx) => (
              <li key={idx} className="panel-list-item tip">
                <span className="panel-list-item-icon">✈️</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewItinerary;
