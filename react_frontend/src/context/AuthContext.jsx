import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * AuthContext provides app-wide authentication state and helpers.
 * It subscribes to Supabase's auth state changes and exposes:
 * { user, session, loading, signInWithGoogle, signOut }.
 */

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signInWithGoogle: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: async () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provider that wires Supabase auth state to React context so the entire app
   * can access authentication status and actions.
   */
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      } catch {
        // do nothing, already surfaced via client fallback warnings if misconfigured
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      try {
        listener?.subscription?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    // Use current origin for redirect to keep SPA simple
    const redirectTo = window.location.origin;
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({ user, session, loading, signInWithGoogle, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Hook to access the authentication context.
   * @returns {{user: any, session: any, loading: boolean, signInWithGoogle: Function, signOut: Function}}
   */
  return useContext(AuthContext);
}
