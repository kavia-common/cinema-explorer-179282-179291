import React, { useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * UserMoviesForm allows users to submit custom movies to the Supabase 'movies' table.
 * - Controlled form with fields: title (required), year (required), photo (URL), description
 * - Validates required fields and basic year/photo URL formats
 * - On submit, inserts into Supabase: { title, year, photo, description }
 * - Shows success/error messages and resets after success
 * - Gracefully handles missing Supabase env vars by showing an inline message
 */
export default function UserMoviesForm() {
  const hasSupabaseConfig = useMemo(
    () =>
      Boolean(process.env.REACT_APP_SUPABASE_URL) &&
      Boolean(process.env.REACT_APP_SUPABASE_KEY),
    []
  );

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [photo, setPhoto] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  function validate() {
    const errs = [];
    const y = parseInt(year, 10);

    if (!String(title).trim()) errs.push('Title is required.');
    if (!String(year).trim()) {
      errs.push('Year is required.');
    } else if (Number.isNaN(y) || y < 1888 || y > 2100) {
      errs.push('Year must be a valid number between 1888 and 2100.');
    }

    if (photo && String(photo).trim()) {
      try {
        // eslint-disable-next-line no-new
        new URL(photo);
      } catch {
        errs.push('Photo must be a valid URL if provided.');
      }
    }

    return errs;
    }

  const resetForm = () => {
    setTitle('');
    setYear('');
    setPhoto('');
    setDescription('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!hasSupabaseConfig) {
      setErrorMsg(
        'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY to enable saving.'
      );
      return;
    }

    const errs = validate();
    if (errs.length > 0) {
      setErrorMsg(errs.join(' '));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: String(title).trim(),
        year: parseInt(year, 10),
        photo: String(photo || '').trim() || null,
        description: String(description || '').trim() || null,
      };

      const { error } = await supabase.from('movies').insert(payload);
      if (error) {
        throw error;
      }

      setSuccessMsg('Movie saved successfully!');
      resetForm();

      // Broadcast a custom event so the list can refresh automatically
      try {
        document.dispatchEvent(new CustomEvent('user-movies:changed'));
      } catch {
        // ignore
      }
    } catch (err) {
      const message =
        (err && err.message) ||
        'Unable to save the movie right now. Please try again.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-surface rounded-2xl border border-white/30 shadow-sm p-4 md:p-6">
      <h3 className="text-xl font-semibold text-text mb-3">Add a Movie</h3>

      {!hasSupabaseConfig && (
        <div
          className="mb-4 text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
          role="note"
        >
          Supabase is not configured. Set REACT_APP_SUPABASE_URL and
          REACT_APP_SUPABASE_KEY to enable saving your movies. The app will still
          work without it.
        </div>
      )}

      {errorMsg && (
        <div
          className="mb-4 text-sm rounded-lg border border-error/30 bg-red-50/70 text-error px-3 py-2"
          role="alert"
        >
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div
          className="mb-4 text-sm rounded-lg border border-green-300 bg-green-50 text-green-700 px-3 py-2"
          role="status"
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm text-secondary mb-1" htmlFor="umf-title">
            Title
          </label>
          <input
            id="umf-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/30 bg-white/90 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="e.g., My Indie Film"
            required
            aria-required="true"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-secondary mb-1" htmlFor="umf-year">
              Year
            </label>
            <input
              id="umf-year"
              type="number"
              inputMode="numeric"
              min={1888}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-white/30 bg-white/90 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g., 2024"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm text-secondary mb-1" htmlFor="umf-photo">
              Photo URL
            </label>
            <input
              id="umf-photo"
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-white/30 bg-white/90 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="https://example.com/poster.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-secondary mb-1" htmlFor="umf-description">
            Description
          </label>
          <textarea
            id="umf-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/30 bg-white/90 outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Tell us about this movie..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !hasSupabaseConfig}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition
              ${submitting || !hasSupabaseConfig
                ? 'bg-secondary/40 text-white cursor-not-allowed'
                : 'bg-primary text-white hover:opacity-95 shadow'
              }`}
            aria-busy={submitting ? 'true' : 'false'}
          >
            {submitting ? (
              <>
                <span className="inline-flex h-4 w-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              'Save Movie'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
