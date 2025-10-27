import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

/**
 * PUBLIC_INTERFACE
 * Landing page for the Movie AI marketing hero.
 * Renders a transparent Navbar and a full-height two-column hero section.
 *
 * Integration notes (no routing changes applied automatically):
 * - If using react-router, you can add a route:
 *   // --- BEGIN: Optional Router Integration ---
 *   import { Routes, Route } from 'react-router-dom';
 *   import Landing from './pages/Landing';
 *   // In App component:
 *   <Routes>
 *     <Route path="/" element={<Landing />} />
 *     // other routes...
 *   </Routes>
 *   // --- END: Optional Router Integration ---
 */
export default function Landing() {
  return (
    <main className="min-h-screen">
      <Navbar />
      {/* The section includes its own gradient background and padding per spec */}
      <HeroSection />
    </main>
  );
}
