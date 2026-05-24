'use client';

import { useState, useEffect, useCallback } from 'react';

export default function EditIdeaModal({ ideaId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // ─── Fetch idea by ID on mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/ideas/${ideaId}`
        );
        if (!res.ok) throw new Error('Failed to fetch idea');
        const data = await res.json();
        setForm({
          title: data.title || '',
          category: data.category || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
        });
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (ideaId) fetchIdea();
  }, [ideaId]);

  // ─── ESC key closes modal ────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // ─── Click outside backdrop to close ────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ─── Field change helper ─────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Show toast helper ───────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Submit update ───────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ideas/${ideaId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update idea');
      }

      showToast('Idea updated successfully!');
      setTimeout(() => {
        onSuccess(); // refresh the list in parent
        onClose();   // close modal
      }, 1000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    /* Backdrop */
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">

        {/* ── Toast ── */}
        {toast && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg transition-all
              ${toast.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'}`}
          >
            {toast.message}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Idea
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-6 flex-1">

          {/* Loading skeleton */}
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-11 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
          ) : error && !form.title ? (
            /* Fetch error — no data to show */
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-5">

              {/* Title */}
              <Field label="Title" required>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Your idea title"
                  className={inputCls}
                />
              </Field>

              {/* Category */}
              <Field label="Category">
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Tech, Health, Education"
                  className={inputCls}
                />
              </Field>

              {/* Short Description */}
              <Field label="Short Description">
                <input
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  placeholder="One-liner summary"
                  className={inputCls}
                />
              </Field>

              {/* Full Description */}
              <Field label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your idea in detail..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* Image URL */}
              <Field label="Image URL">
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  className={inputCls}
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    className="mt-2 h-28 w-full object-cover rounded-lg border dark:border-gray-700"
                  />
                )}
              </Field>

              {/* Inline update error */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-4 py-3 rounded-xl">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && (
          <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-900">
            <button
              onClick={onClose}
              disabled={updating}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating || !form.title.trim()}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition"
            >
              {updating && (
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {updating ? 'Updating…' : 'Update Idea'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tiny helpers ──────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
