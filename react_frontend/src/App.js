import React from 'react';
import Home from './pages/Home';

/**
 * PUBLIC_INTERFACE
 * Root application component.
 * - Displays a simple navbar with the app title "MovieAI".
 * - Uses Tailwind utility classes and the Royal Purple theme.
 * - Renders the Home page as the root route for the minimal app.
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      <nav
        aria-label="Main Navigation"
        className="sticky top-0 z-10 bg-surface/80 backdrop-blur border-b border-white/30"
      >
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center">
          <div className="text-2xl font-bold text-primary tracking-wide">
            MovieAI
          </div>
        </div>
      </nav>
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;
