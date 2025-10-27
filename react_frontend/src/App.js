import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import { AuthProvider } from './context/AuthContext';
import AuthStatus from './components/AuthStatus';

/**
 * PUBLIC_INTERFACE
 * Root application component with routing.
 * - "/" renders the marketing Landing page.
 * - "/app" renders the original application shell and Home.
 * - Provides global authentication via AuthProvider.
 * - Uses Tailwind utility classes and the Royal Purple theme.
 */
function AppHomeLayout() {
  // Preserve the previous App.js shell for the Home route
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      <nav
        aria-label="Main Navigation"
        className="sticky top-0 z-10 bg-surface/80 backdrop-blur border-b border-white/30"
      >
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary tracking-wide">
            MovieAI
          </div>
          <div>
            <AuthStatus />
          </div>
        </div>
      </nav>
      <main>
        <Home />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppHomeLayout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
