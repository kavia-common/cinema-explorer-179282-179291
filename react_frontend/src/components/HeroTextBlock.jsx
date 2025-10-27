import React from 'react';

/**
 * PUBLIC_INTERFACE
 * HeroTextBlock renders the left column of the hero with:
 * - Eyebrow label (orange)
 * - Headline "Movie AI"
 * - Description text
 * - Primary CTA button
 */
export default function HeroTextBlock() {
  return (
    <div className="max-w-xl">
      <p className="text-sm font-bold text-orange-500 tracking-wide uppercase">
        TRENDING MOVIES AT
      </p>
      <h1 className="mt-2 text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Movie AI
      </h1>
      <p className="mt-4 mb-6 text-gray-600 max-w-[400px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
        Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at
        nibh elementum imperdiet.
      </p>
      <a
        href="#contact"
        className="inline-flex items-center justify-center rounded-full px-8 py-3 text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-500 shadow-md hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition"
        aria-label="Contact us about Movie AI"
      >
        Contact Us
      </a>
    </div>
  );
}
