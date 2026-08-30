import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GenerateItinerary from './pages/GenerateItinerary';
import ViewItinerary from './pages/ViewItinerary';
import SavedTrips from './pages/SavedTrips';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generate"
                element={
                  <ProtectedRoute>
                    <GenerateItinerary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view/:id"
                element={
                  <ProtectedRoute>
                    <ViewItinerary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <SavedTrips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Catch-All */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          
          <footer
            style={{
              textAlign: 'center',
              padding: '2rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              backgroundColor: 'var(--bg-secondary)',
              marginTop: 'auto'
            }}
            className="footer"
          >
            © {new Date().getFullYear()} PlanMyTrip AI. Built with MERN Stack. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
