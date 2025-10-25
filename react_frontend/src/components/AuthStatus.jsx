import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * AuthStatus shows a Google Sign-In button when logged out
 * and displays the current user's avatar/email with a Sign out button when logged in.
 * Tailwind styling matches the app's elegant Royal Purple theme.
 */

// PUBLIC_INTERFACE
export default function AuthStatus() {
  /** Component rendering the auth status and actions for the navbar area. */
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-secondary/20" />
        <div className="h-6 w-28 rounded bg-secondary/20" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-medium shadow hover:shadow-md hover:opacity-95 transition"
        aria-label="Sign in with Google"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12  s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.082,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20  s20-8.955,20-20C44,22.659,43.861,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.817C14.518,16.229,18.879,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657  C33.64,6.053,29.082,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.176,0,9.86-1.977,13.399-5.197l-6.18-5.237C29.077,35.488,26.671,36.5,24,36.5  c-5.191,0-9.604-3.316-11.264-7.946l-6.53,5.031C9.521,39.641,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.082,5.563  c0.001-0.001,0.002-0.001,0.003-0.002l6.18,5.237C37.053,39.1,44,33.999,44,24C44,22.659,43.861,21.35,43.611,20.083z"/>
        </svg>
        <span>Sign in with Google</span>
      </button>
    );
  }

  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email || user?.user_metadata?.email;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-8 w-8 rounded-full ring-2 ring-primary/30"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-semibold">
            {email?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
        )}
        <span className="text-sm text-text/90">{email}</span>
      </div>
      <button
        onClick={signOut}
        className="px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition text-sm"
        aria-label="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}
