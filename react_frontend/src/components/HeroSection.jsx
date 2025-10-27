import React from 'react';
import HeroTextBlock from './HeroTextBlock';
import HeroIllustration from './HeroIllustration';

/**
 * PUBLIC_INTERFACE
 * HeroSection lays out the two-column responsive hero.
 * Grid: 1 col on mobile, 2 cols on lg+, vertically centered, with generous padding.
 */
export default function HeroSection() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-screen px-6 md:px-12 xl:px-24 bg-gradient-to-b from-purple-50 to-purple-100"
      aria-label="Hero"
    >
      <div className="py-10 lg:py-0">
        <HeroTextBlock />
      </div>
      <div className="py-10 lg:py-0">
        <HeroIllustration />
      </div>
    </section>
  );
}
