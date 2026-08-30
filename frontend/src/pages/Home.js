import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">
          Smart Travel Planning, <span>Tailored to Your Budget</span>
        </h1>
        <p className="hero-subtitle">
          PlanMyTrip AI builds personalized, day-by-day travel itineraries. Choose your destination, dates, and budget tier (Low, Medium, or Luxury) to get a custom breakdown of stays, activities, transit, and dining.
        </p>
        <div className="btn-container">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3 className="feature-title">Budget-Driven AI</h3>
          <p className="feature-desc">
            Specify a total budget and a category (Low, Medium, or Luxury). Our AI adjusts all accommodations, food spots, transit options, and activities to fit perfectly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3 className="feature-title">Day-Wise Timeline</h3>
          <p className="feature-desc">
            Enjoy organized morning, afternoon, and evening plans, complete with estimated costs, food recommendations, and location highlights.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📥</div>
          <h3 className="feature-title">Print & Save PDF</h3>
          <p className="feature-desc">
            Take your travel plans on the go! Copy the raw text or download/print the complete itinerary as a beautiful, clean PDF document.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
