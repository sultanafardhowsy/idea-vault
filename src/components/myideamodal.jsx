'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { authClient } from '@/lib/auth-client';
import 'react-toastify/dist/ReactToastify.css';

export default function EditIdeaModal({ ideaId, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Fetch existing idea ──
  useEffect(() => {
    if (!mounted || !ideaId) return;

    const fetchIdea = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Get auth token
        const { data: tokenData } = await authClient.token();

        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${ideaId}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${tokenData?.token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error ${res.status}`);
        }

        const data = await res.json();

        setForm({
          title: data.title || '',
          category: data.category || '',
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          founder: data.founder || '',
          funding: data.funding || '',
          status: data.status || '',
          email: data.email || '',
          tags: data.tags || '',
        });
      } catch (err) {
        console.error(err);
        const msg = err.message || 'Failed to load idea';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, mounted]);

  // ── ESC key closes modal ──
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // ── Lock body scroll ──
  useEffect(() => {
    if (!mounted) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, mounted]);

  // ── Backdrop click ──
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── Field change ──
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Update idea ──
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError(null);

      // ✅ Get auth token for PATCH too
      const { data: tokenData } = await authClient.token();

      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${ideaId}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`,
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update idea');
      }

      toast.success('Idea updated successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1200);
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
        role="dialog"
        aria-modal="true"
      >
        {/* Modal */}
        <div className="relative w-full bg-white flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 max-h-[92dvh] sm:max-h-[88vh] sm:max-w-2xl overflow-hidden">

          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Idea</h2>
              <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                Make changes and save when done
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-5 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : error && !form.title ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm">
                {error}
              </div>
            ) : (
              <div className="space-y-5">
                <Field label="Title" required>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Your idea title"
                    className={inputCls}
                  />
                </Field>

                <Field label="Category">
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Tech, Health, Education..."
                    className={inputCls}
                  />
                </Field>

                <Field label="Short Description">
                  <input
                    type="text"
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    placeholder="Short summary"
                    className={inputCls}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Detailed description..."
                    className={`${inputCls} resize-none`}
                  />
                </Field>


                <Field label="Founder Name">
                  <input
                    type="text"
                    name="founder"
                    value={form.founder}
                    onChange={handleChange}
                    placeholder="Founder Name"
                    className={inputCls}
                  />
                </Field>

                <Field label="Funding">
                  <input
                    type="text"
                    name="funding"
                    value={form.funding}
                    onChange={handleChange}
                    placeholder="Funding amount"
                    className={inputCls}
                  />
                </Field>
                <Field label="Status">
                  <input
                    type="text"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    placeholder="Funding amount"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email"
                    className={inputCls}
                  />
                </Field>
                <Field label="Tags">
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Funding amount"
                    className={inputCls}
                  />
                </Field>

                <Field label="Image URL">
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={inputCls}
                  />
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </Field>

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                disabled={updating}
                className="w-full bg-blue-600 sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating || !form.title.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-amber-700 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Idea'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

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

const inputCls =
  'w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';