import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Home component for the MovieAI app.
 * Renders the main welcome message for the application using Tailwind utilities.
 */
export default function Home() {
  return (
    <section className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-16">
      <div className="card-elegant text-center max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-text">
          Welcome to MovieAI
        </h1>
        <p className="mt-3 text-secondary">
          Explore trending and featured movies with an elegant, modern UI.
        </p>
      </div>
    </section>
  );
}
