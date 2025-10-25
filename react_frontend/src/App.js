import React from 'react';
import './App.css';
import Home from './pages/Home';

/**
 * PUBLIC_INTERFACE
 * Root application component.
 * - Displays a simple navbar with the app title "MovieAI".
 * - Renders the Home page as the root route for the minimal app.
 */
function App() {
  return (
    <div className="App">
      <nav
        aria-label="Main Navigation"
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            letterSpacing: '0.3px',
            color: '#1f2937',
          }}
        >
          MovieAI
        </div>
      </nav>
      <Home />
    </div>
  );
}

export default App;
