import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Logo component rendering the app brand with a small film icon and text.
 * Accessible semantic link pointing to the root hash for now.
 */
export default function Logo({ title = 'Movie AI' }) {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-2 text-primary hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
      aria-label={`${title} home`}
    >
      {/* Simple film reel icon */}
      <span
        className="inline-grid place-items-center h-9 w-9 rounded-xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M4 4h8a4 4 0 014 4v1h1a3 3 0 110 6h-1v1a4 4 0 01-4 4H4a2 2 0 01-2-2V6a2 2 0 012-2zm7 3H4v10h7a2 2 0 002-2v-6a2 2 0 00-2-2zm5 4h1a1 1 0 110 2h-1v-2zM7 8h2v2H7V8zm0 4h2v2H7v-2z" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-wide text-gray-900">{title}</span>
    </a>
  );
}
