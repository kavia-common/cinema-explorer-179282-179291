import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * UserMoviesList fetches and displays records from the Supabase 'movies' table.
 * - select * from movies order by created_at desc
 * - Renders a responsive grid with image, title, year, and description
 * - Includes loading, error, and empty states
 * - Gracefully handles missing Supabase env vars by showing a prompt to configure
 */
export default function UserMoviesList() {
  const hasSupabaseConfig = useMemo(
    () =>
      Boolean(process.env.REACT_APP_SUPABASE_URL) &&
      Boolean(process.env.REACT_APP_SUPABASE_KEY),
    []
  );

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const placeholder = 'https://via.placeholder.com/342x200?text=No+Image';

  async function fetchMovies() {
    setErrorMsg('');
    setLoading(true);
    try {
      const query = supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        throw error;
      }
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        (err && err.message) ||
        'Unable to load your movies at the moment. Please try again.';
      setErrorMsg(message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchMovies();
    })();

    // Listen for form submission events to refresh automatically
    const onChanged = () => fetchMovies();
    document.addEventListener('user-movies:changed', onChanged);

    return () => {
      mounted = false;
      document.removeEventListener('user-movies:changed', onChanged);
    };
  }, [hasSupabaseConfig]);

  if (!hasSupabaseConfig) {
    return (
      <div
        className="mt-4 text-sm rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-700 px-3 py-2"
        role="note"
      >
        Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY
        to view your saved movies.
      </div>
    );
  }

  return (
    <section className="bg-surface rounded-2xl border border-white/30 shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-text">Your Saved Movies</h3>
        <button
          type="button"
          onClick={fetchMovies}
          className="px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition text-sm"
          aria-label="Refresh movies"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-secondary">
          <span className="inline-flex h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading your movies…</span>
        </div>
      )}

      {errorMsg && !loading && (
        <div
          className="text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && movies.length === 0 && (
        <div className="text-secondary">
          No movies yet. Add one using the form above.
        </div>
      )}

      {!loading && !errorMsg && movies.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          aria-live="polite"
        >
          {movies.map((m) => {
            const imgSrc = m?.photo || placeholder;
            const title = m?.title || 'Untitled';
            const year = m?.year ? String(m.year) : '—';
            const desc = m?.description || '';

            return (
              <article
                key={`${m.id ?? `${title}-${year}`}`}
                className="group bg-surface rounded-2xl border border-white/30 shadow-sm hover:shadow-lg transition overflow-hidden"
                aria-label={title}
              >
                <div className="relative">
                  <img
                    src={imgSrc}
                    alt={`${title} poster`}
                    className="w-full aspect-video object-cover bg-purple-100"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-text truncate" title={title}>
                    {title}
                  </h4>
                  <div className="mt-1 text-xs text-secondary">{year}</div>
                  {desc && (
                    <p className="mt-2 text-sm text-secondary line-clamp-3">
                      {desc}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
