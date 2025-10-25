import React, { useEffect, useMemo, useState } from 'react';
import { fetchMovies, getTrending, getFeatured } from '../lib/tmdbClient';
import MovieCard from '../components/MovieCard';

/**
 * PUBLIC_INTERFACE
 * Home component for the MovieAI app.
 * - Provides a debounced search bar for querying TMDB movies.
 * - Renders a responsive grid of results using MovieCard.
 * - Includes loading, error, and empty states.
 * - On mount, fetches Trending (day) and Featured (popular) and renders sections below results.
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

  // Trending state
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState('');

  // Featured state
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState('');

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
        const data = await fetchMovies({ query: debouncedQuery });
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

  // On mount: fetch trending (day) and featured (popular)
  useEffect(() => {
    if (!hasTmdbKey) return;
    let isActive = true;

    async function fetchTrendingAndFeatured() {
      setTrendingLoading(true);
      setFeaturedLoading(true);
      setTrendingError('');
      setFeaturedError('');

      try {
        const [t, f] = await Promise.all([
          getTrending('day'),
          getFeatured(),
        ]);
        if (!isActive) return;
        setTrending(Array.isArray(t?.results) ? t.results : []);
        setFeatured(Array.isArray(f?.results) ? f.results : []);
      } catch (err) {
        if (!isActive) return;
        const msg =
          (err && err.message) ||
          'Unable to fetch movies from TMDB at the moment.';
        // If either fails, set respective error; partial success is allowed
        setTrendingError(msg);
        setFeaturedError(msg);
        setTrending([]);
        setFeatured([]);
      } finally {
        if (!isActive) return;
        setTrendingLoading(false);
        setFeaturedLoading(false);
      }
    }

    fetchTrendingAndFeatured();
    return () => {
      isActive = false;
    };
  }, [hasTmdbKey]);

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

        {/* Trending Today */}
        {hasTmdbKey && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-text mb-4">Trending Today</h2>
            {trendingLoading && (
              <div className="flex items-center gap-3 text-secondary">
                <span className="inline-flex h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading trending movies…</span>
              </div>
            )}
            {trendingError && !trendingLoading && (
              <div
                className="text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
                role="alert"
              >
                {trendingError}
              </div>
            )}
            {!trendingLoading && !trendingError && (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {trending.map((m) => (
                  <MovieCard key={m.id ?? `${m.title}-${m.release_date}-tr`} movie={m} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured */}
        {hasTmdbKey && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-text mb-4">Featured</h2>
            {featuredLoading && (
              <div className="flex items-center gap-3 text-secondary">
                <span className="inline-flex h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading featured movies…</span>
              </div>
            )}
            {featuredError && !featuredLoading && (
              <div
                className="text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
                role="alert"
              >
                {featuredError}
              </div>
            )}
            {!featuredLoading && !featuredError && (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {featured.map((m) => (
                  <MovieCard key={m.id ?? `${m.title}-${m.release_date}-ft`} movie={m} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
