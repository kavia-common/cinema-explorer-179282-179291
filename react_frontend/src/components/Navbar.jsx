import React from 'react';
import Logo from './Logo';
import AuthButtons from './AuthButtons';

/**
 * PUBLIC_INTERFACE
 * Navbar with brand on the left and auth actions on the right.
 * Transparent background; centered content width via responsive paddings.
 */
export default function Navbar() {
  return (
    <header>
      <nav
        className="w-full bg-transparent"
        aria-label="Primary"
      >
        <div className="flex items-center justify-between py-4 px-6 md:px-12 xl:px-24">
          <Logo title="Movie AI" />
          <AuthButtons />
        </div>
      </nav>
    </header>
  );
}
