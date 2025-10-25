import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Home component for the MovieAI app.
 * Renders the main welcome message for the application.
 */
export default function Home() {
  return (
    <section className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50">
      <h1 className="tw-text-3xl tw-text-gray-800 tw-font-semibold">
        Welcome to MovieAI
      </h1>
    </section>
  );
}
