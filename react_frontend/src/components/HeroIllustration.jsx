import React from 'react';
import phoneIllustration from '../assets/hero/phone-illustration.svg';

/**
 * PUBLIC_INTERFACE
 * HeroIllustration renders the right column illustrative graphic.
 * Scales to ~45-50% viewport width on large screens and remains responsive.
 */
export default function HeroIllustration() {
  return (
    <div className="w-full flex justify-center lg:justify-end">
      <img
        src={phoneIllustration}
        alt="Stylized phone with movie elements illustration"
        className="w-full max-w-[520px] lg:max-w-[50vw] h-auto ml-auto"
        loading="eager"
      />
    </div>
  );
}
