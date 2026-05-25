'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // ─── Fetch existing idea data ─────────────────────────────────────────────
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${ideaId}`,
          { credentials: 'include' }
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
        setError(err.message);
        toast.error(err.message || 'Failed to load idea');
      } finally {
        setLoading(false);
      }
    };

    if (ideaId) fetchIdea();
  }, [ideaId]);

  // ─── ESC key closes modal ─────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // ─── Click outside backdrop to close ─────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ─── Field change helper ──────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Submit update ────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${ideaId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update idea');
      }

      toast.success('Idea updated successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* React Toastify container — light theme, top-right */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Panel
            – On mobile: full-width sheet sliding up from bottom, rounded only on top
            – On sm+: centred card with rounded-2xl all around, max-w-2xl           */}
        <div className="
          relative w-full bg-white flex flex-col
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl border border-gray-200
          max-h-[92dvh] sm:max-h-[88vh]
          sm:max-w-2xl
          overflow-hidden
        ">

          {/* ── Drag handle (mobile only) ── */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-gray-900">
                Edit Idea
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                Make changes and save when done
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-4 sm:px-6 py-5 sm:py-6 flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-11 bg-gray-100 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : error && !form.title ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm">
                {error}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">

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
                      className="mt-2 h-28 w-full object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </Field>

                {/* Inline update error */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {!loading && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white">
              <button
                onClick={onClose}
                disabled={updating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating || !form.title.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
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
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
