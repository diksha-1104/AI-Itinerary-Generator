import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '0.25rem' }}
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.5.5l-.3.3c-.4.4-.4 1.1 0 1.5L9 12l-4 4H3l-2 2v2l2-2v-2h1l4-4 3.5 6.2c.4.4 1.1.4 1.5 0l.3-.3c.4-.4.6-1 .5-1.5Z" />
          </svg>
          PlanMyTrip AI
        </Link>

        <button className="navbar-toggle" onClick={toggleMobileMenu} aria-label="Toggle Navigation Menu">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {user ? (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/generate"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Plan Trip
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/saved"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Saved Trips
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
