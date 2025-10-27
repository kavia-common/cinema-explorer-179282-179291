import React from 'react';

/**
 * PUBLIC_INTERFACE
 * AuthButtons renders the right side of the Navbar for unauthenticated users:
 * - "Sign In" text link
 * - "Register" outlined button
 *
 * Styling follows the Royal Purple theme and Tailwind utility classes.
 */
export default function AuthButtons({ onSignIn, onRegister }) {
  const handleSignIn = (e) => {
    if (onSignIn) {
      e.preventDefault();
      onSignIn();
    }
  };
  const handleRegister = (e) => {
    if (onRegister) {
      e.preventDefault();
      onRegister();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href="#signin"
        onClick={handleSignIn}
        className="text-sm font-medium text-purple-700 hover:text-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg px-2 py-1"
      >
        Sign In
      </a>
      <a
        href="#register"
        onClick={handleRegister}
        className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 px-4 py-2 text-sm font-semibold transition"
        aria-label="Register your account"
      >
        Register
      </a>
    </div>
  );
}
