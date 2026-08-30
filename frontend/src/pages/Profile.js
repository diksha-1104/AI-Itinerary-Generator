import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTrips: 0,
    averageDays: 0,
    lowBudgetCount: 0,
    mediumBudgetCount: 0,
    luxuryBudgetCount: 0,
    totalBudget: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        const response = await API.get('/trips');
        const trips = response.data;
        
        if (trips.length > 0) {
          const totalDays = trips.reduce((sum, t) => sum + (t.numberOfDays || 0), 0);
          const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
          const low = trips.filter((t) => t.budgetCateg === 'Low').length;
          const medium = trips.filter((t) => t.budgetCateg === 'Medium').length;
          const luxury = trips.filter((t) => t.budgetCateg === 'Luxury').length;

          setStats({
            totalTrips: trips.length,
            averageDays: Math.round((totalDays / trips.length) * 10) / 10,
            lowBudgetCount: low,
            mediumBudgetCount: medium,
            luxuryBudgetCount: luxury,
            totalBudget
          });
        }
      } catch (err) {
        console.error('Failed to calculate stats', err);
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, []);

  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="profile-card">
        {/* User Info Header */}
        <div className="profile-user-info">
          <div className="profile-avatar-placeholder">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-details">
            <h2>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>📧 {user?.email}</p>
            <span
              style={{
                display: 'inline-block',
                marginTop: '0.75rem',
                backgroundColor: 'rgba(99,102,241,0.1)',
                color: 'var(--accent-primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Verified Member
            </span>
          </div>
        </div>

        {/* User stats */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Travel Planner Analytics</h3>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
              <div className="spinner"></div>
            </div>
          ) : stats.totalTrips > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Numeric Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    {stats.totalTrips}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Trips Created
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    {stats.averageDays} Days
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Avg. Trip Length
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', display: 'block' }}>
                    ${stats.totalBudget.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Total Budget Monitored
                  </span>
                </div>
              </div>

              {/* Budget Category breakdown charts */}
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>
                  Budget Category Distribution
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Low Budget */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      <span>Low Budget Tier (Hostels & Public Transit)</span>
                      <strong>{stats.lowBudgetCount} Trips</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--color-low)',
                          width: `${(stats.lowBudgetCount / stats.totalTrips) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Medium Budget */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      <span>Medium Budget Tier (Standard Hotels & Cafes)</span>
                      <strong>{stats.mediumBudgetCount} Trips</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--color-medium)',
                          width: `${(stats.mediumBudgetCount / stats.totalTrips) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Luxury Budget */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      <span>Luxury Budget Tier (Premium Resorts & Fine Dining)</span>
                      <strong>{stats.luxuryBudgetCount} Trips</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--color-luxury)',
                          width: `${(stats.luxuryBudgetCount / stats.totalTrips) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>You haven't generated any itineraries yet. Generate some plans to unlock travel analytics!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
