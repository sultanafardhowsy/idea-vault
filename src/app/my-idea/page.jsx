'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import EditIdeaModal from '@/components/myideamodal';

export default function MyIdeasPage() {
  const { data: session, isPending } = authClient.useSession();

  const [ideas, setIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchMyIdeas = async () => {
    if (!session?.user?.email) return;
    setLoadingIdeas(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ideas-by-email?email=${session.user.email}`
      );
      if (!res.ok) throw new Error('Failed to fetch ideas');
      const data = await res.json();
      setIdeas(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load ideas');
      setIdeas([]);
    } finally {
      setLoadingIdeas(false);
    }
  };

  useEffect(() => {
    if (!isPending && session?.user?.email) fetchMyIdeas();
  }, [session, isPending]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this idea permanently?')) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ideas/${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete');
      fetchMyIdeas();
    } catch (err) {
      alert(err.message);
    }
  };

  // ─── Always render <main> so server & client agree on the root element ───
  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen bg-white">

      {/* ── Session loading ── */}
      {isPending ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-gray-400 text-sm animate-pulse">Loading session…</span>
        </div>
      ) : (
        <>
          {/* ── Header ── */}
          <div className="mb-6 sm:mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Shared Ideas</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Vault:{' '}
              <span className="font-medium text-gray-700">
                {session?.user?.email}
              </span>
            </p>
          </div>

          {/* ── Content states ── */}
          {loadingIdeas ? (
            /* Skeleton */
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="sm:w-56 h-40 sm:h-auto bg-gray-100 flex-shrink-0" />
                  <div className="p-6 flex-1 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-6 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-6 rounded-xl text-center text-sm">
              {error}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-2xl">
              <p className="text-lg text-gray-400">No ideas yet. Start sharing!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1">
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  {idea.imageUrl && (
                    <div className="w-full sm:w-56 h-48 sm:h-auto flex-shrink-0">
                      <img
                        src={idea.imageUrl}
                        alt={idea.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    {/* Badges + Actions */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {idea.category && (
                          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {idea.category}
                          </span>
                        )}
                        {idea.status && (
                          <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                            {idea.status}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 ml-auto">
                        <button
                          onClick={() => setEditingId(idea._id)}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idea._id)}
                          className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base mb-4 flex-1 line-clamp-3">
                      {idea.description}
                    </p>
                    <div className="text-xs sm:text-sm flex flex-wrap justify-between gap-2 border-t border-gray-100 pt-4 text-gray-400">
                      <span>
                        Funding:{' '}
                        <strong className="text-gray-600">{idea.funding}</strong>
                      </span>
                      <span>
                        {idea.createdAt
                          ? new Date(idea.createdAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Edit modal ── */}
      {editingId && (
        <EditIdeaModal
          ideaId={editingId}
          onClose={() => setEditingId(null)}
          onSuccess={fetchMyIdeas}
        />
      )}
    </main>
  );
}
