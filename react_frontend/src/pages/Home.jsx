import React, { useEffect, useMemo, useState } from 'react';
import { searchMovies } from '../lib/tmdbClient';
import MovieCard from '../components/MovieCard';

/**
 * PUBLIC_INTERFACE
 * Home component for the MovieAI app.
 * - Provides a debounced search bar for querying TMDB movies.
 * - Renders a responsive grid of results using MovieCard.
 * - Includes loading, error, and empty states.
 * - Gracefully handles missing TMDB API key by disabling search and showing an inline message.
 */
export default function Home() {
  const hasTmdbKey = useMemo(
    () => Boolean(process.env.REACT_APP_TMDB_API_KEY),
    []
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Debounce the query input by 400ms
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [query]);

  // Fetch when debouncedQuery changes
  useEffect(() => {
    let isActive = true;
    async function run() {
      // Clear previous errors for new run
      setErrorMsg('');

      // Skip if no API key configured, or no query
      if (!hasTmdbKey || !debouncedQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMovies(debouncedQuery);
        if (!isActive) return;
        setResults(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        if (!isActive) return;
        const message =
          (err && err.message) ||
          'Something went wrong while searching. Please try again.';
        setErrorMsg(message);
        setResults([]);
      } finally {
        if (isActive) setLoading(false);
      }
    }
    run();
    return () => {
      isActive = false;
    };
  }, [debouncedQuery, hasTmdbKey]);

  return (
    <section className="min-h-[calc(100vh-56px)] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-text">
            Welcome to MovieAI
          </h1>
          <p className="mt-3 text-secondary">
            Search the TMDB catalog and discover films you&apos;ll love.
          </p>
        </header>

        <div className="bg-surface rounded-2xl border border-white/30 shadow-sm p-4 md:p-6">
          <label
            htmlFor="movie-search"
            className="block text-sm font-medium text-secondary mb-2"
          >
            Search movies
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 2a8 8 0 015.292 13.708l4.5 4.5-1.414 1.414-4.5-4.5A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
            </svg>
            <input
              id="movie-search"
              type="text"
              placeholder={
                hasTmdbKey
                  ? 'Search by title, e.g., “Inception”'
                  : 'TMDB API key missing — search disabled'
              }
              className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition bg-white/90 backdrop-blur
                ${hasTmdbKey ? 'border-white/30 focus:ring-2 focus:ring-primary/50' : 'border-error/40'}
              `}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!hasTmdbKey}
              aria-busy={loading ? 'true' : 'false'}
              aria-invalid={errorMsg ? 'true' : 'false'}
            />
          </div>

          {!hasTmdbKey && (
            <div
              className="mt-3 text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
              role="note"
            >
              TMDB API key is not configured. Set REACT_APP_TMDB_API_KEY and
              rebuild to enable search. The rest of the app remains usable.
            </div>
          )}

          {errorMsg && hasTmdbKey && (
            <div
              className="mt-3 text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
              role="alert"
            >
              {errorMsg}
            </div>
          )}
        </div>

        {/* Results area */}
        <div className="mt-8">
          {loading && hasTmdbKey && (
            <div className="flex items-center gap-3 text-secondary">
              <span className="inline-flex h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Searching for “{debouncedQuery}”...</span>
            </div>
          )}

          {!loading && hasTmdbKey && debouncedQuery && results.length === 0 && !errorMsg && (
            <div className="text-secondary">
              No movies found for “{debouncedQuery}”. Try another search.
            </div>
          )}

          {!loading && (!debouncedQuery || !hasTmdbKey) && results.length === 0 && !errorMsg && (
            <div className="text-secondary">
              Start typing in the search box above to find movies.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              aria-live="polite"
            >
              {results.map((m) => (
                <MovieCard key={m.id ?? `${m.title}-${m.release_date}`} movie={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
