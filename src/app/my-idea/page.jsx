'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export default function MyIdeasPage() {
  const { data: session, isPending } = authClient.useSession();

  const [ideas, setIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    funding: ''
  });

  const [deletingId, setDeletingId] = useState(null);

  // ✅ Fetch Ideas
  const fetchMyIdeas = async () => {
    if (!session?.user?.email) return;

    setLoadingIdeas(true);
    setError(null);

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      if (!serverUrl) return;
      const response = await fetch(
        `${serverUrl}/ideas-by-email?email=${session.user.email}`
      );

      if (!response.ok) throw new Error('Failed to fetch ideas');

      const data = await response.json();
      setIdeas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError('Failed to load ideas');
      setIdeas([]);
    } finally {
      setLoadingIdeas(false);
    }
  };

  // ✅ Load ideas after session ready
  useEffect(() => {
    if (!isPending && session?.user?.email) {
      fetchMyIdeas();
    }
  }, [session, isPending]);

  // ✅ Start Edit
  const startEditing = (idea) => {
    setEditingId(idea._id);
    setEditForm({
      title: idea.title || '',
      description: idea.description || '',
      category: idea.category || '',
      funding: idea.funding || ''
    });
  };

  // ✅ Update Idea
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/ideas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Failed to update');

      setEditingId(null);
      fetchMyIdeas();
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Delete Idea
  const handleDelete = async (id) => {
    if (!confirm('Delete this idea permanently?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/ideas/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete');

      fetchMyIdeas();
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Loading session
  if (isPending) {
    return <div className="p-12 text-center">Loading session...</div>;
  }

  // ❌ Not logged in
  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 text-center border rounded-2xl bg-amber-50 dark:bg-amber-950 border-amber-200">
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p>Please log in to view your ideas.</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen bg-white dark:bg-gray-900">

      {/* Header */}
      <div className="mb-8 pb-4 border-b dark:border-gray-800">
        <h1 className="text-3xl font-bold">My Shared Ideas</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Vault:{' '}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {session.user.email}
          </span>
        </p>
      </div>

      {/* States */}
      {loadingIdeas ? (
        <div className="text-center py-20">Loading your ideas...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 dark:bg-red-900/30 p-6 rounded-xl text-center">
          {error}
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
          <p className="text-lg text-gray-500">No ideas yet. Start sharing!</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1">

          {ideas?.map((idea) => (
            <div
              key={idea._id}
              className="flex flex-col md:flex-row bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
            >

              {/* Image */}
              {idea.imageUrl && (
                <div className="md:w-56 h-56 flex-shrink-0">
                  <img
                    src={idea.imageUrl}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1">

                {/* Edit Mode */}
                {editingId === idea._id ? (
                  <div className="space-y-4">

                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />

                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="p-3 border rounded-lg dark:bg-gray-700"
                      />

                      <input
                        value={editForm.funding}
                        onChange={(e) =>
                          setEditForm({ ...editForm, funding: e.target.value })
                        }
                        className="p-3 border rounded-lg dark:bg-gray-700"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-5 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => handleUpdate(idea._id)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>

                    {/* Top Actions */}
                    <div className="flex justify-between mb-4">

                      <div className="flex gap-2">
                        <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 rounded-full">
                          {idea.category}
                        </span>

                        <span className="px-3 py-1 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 rounded-full">
                          {idea.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(idea)}
                          className="px-4 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(idea._id)}
                          className="px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Idea Info */}
                    <h3 className="text-2xl font-bold mb-2">{idea.title}</h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {idea.description}
                    </p>

                    <div className="text-sm flex justify-between border-t pt-4 text-gray-500">
                      <span>
                        Funding: <strong>{idea.funding}</strong>
                      </span>

                      <span>
                        {idea.createdAt
                          ? new Date(idea.createdAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      )}
    </main>
  );
}