import React from 'react';
import { buildImageUrl } from '../lib/tmdbClient';

/**
 * PUBLIC_INTERFACE
 * MovieCard component renders a single movie poster with title, release year, and rating.
 * - Handles missing poster gracefully via buildImageUrl (placeholder).
 * - Styled with Tailwind using Royal Purple accents.
 * 
 * @param {Object} props
 * @param {Object} props.movie - The TMDB movie object (expects id, title, poster_path, release_date, vote_average).
 * @returns {JSX.Element}
 */
export default function MovieCard({ movie }) {
  if (!movie) return null;

  const {
    title = 'Untitled',
    poster_path,
    release_date,
    vote_average,
  } = movie;

  const year = release_date ? String(release_date).slice(0, 4) : '—';
  const imgUrl = buildImageUrl(poster_path, 'w342');
  const rating =
    typeof vote_average === 'number' && !Number.isNaN(vote_average)
      ? Math.round(vote_average * 10) / 10
      : '—';

  return (
    <article
      className="group bg-surface rounded-2xl border border-white/30 shadow-sm hover:shadow-lg transition overflow-hidden"
      aria-label={title}
    >
      <div className="relative">
        <img
          src={imgUrl}
          alt={`Poster for ${title}`}
          className="w-full aspect-[2/3] object-cover bg-purple-100"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/90 text-white text-xs font-medium shadow">
          <svg
            className="h-3.5 w-3.5 text-white/90"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 .587l3.668 7.43 8.2 1.193-5.934 5.784 1.401 8.168L12 18.896l-7.335 3.866 1.401-8.168L.132 9.21l8.2-1.193z" />
          </svg>
          <span>{rating}</span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-text truncate" title={title}>
          {title}
        </h3>
        <div className="mt-1 text-xs text-secondary">{year}</div>
      </div>
    </article>
  );
}
