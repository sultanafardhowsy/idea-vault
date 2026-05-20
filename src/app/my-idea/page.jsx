'use client';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client'; 

export default function MyIdeasPage() {
  const { data: session, isPending } = authClient.useSession();
  
  const [ideas, setIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [error, setError] = useState(null);

  // States for handling UI actions
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', funding: '' });
  const [deletingId, setDeletingId] = useState(null);

  // 1. Fetch User Ideas
  const fetchMyIdeas = async () => {
    if (!session?.user?.email) return;
    try {
      setLoadingIdeas(true);
      const response = await fetch(`http://localhost:5000/myideas?email=${session.user.email}`);
      if (!response.ok) throw new Error('Could not retrieve your vault data.');
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingIdeas(false);
    }
  };

  useEffect(() => {
    if (!isPending && session?.user?.email) {
      fetchMyIdeas();
    }
  }, [session, isPending]);

  // 2. Initialize Inline Edit Form
  const startEditing = (idea) => {
    setEditingId(idea._id);
    setEditForm({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      funding: idea.funding
    });
  };

  // 3. Handle Update Request (PUT)
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/ideas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update idea.');

      // Refresh data on success and close edit view
      setEditingId(null);
      fetchMyIdeas();
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. Handle Delete Request (DELETE)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/ideas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete idea.');
      
      setDeletingId(null);
      fetchMyIdeas(); // Refresh remaining items
    } catch (err) {
      alert(err.message);
    }
  };

  if (isPending) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 min-h-screen">Authenticating session...</div>;
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center max-w-md mx-auto mt-12 border rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900">
        <h2 className="font-bold text-lg mb-1">Access Restricted</h2>
        <p className="text-sm">Please log in to your IdeaVault account to view your shared ideas.</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold">My Shared Ideas</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Vault Key: <span className="font-medium text-gray-800 dark:text-gray-200">{session.user.email}</span>
        </p>
      </div>

      {loadingIdeas ? (
        <div className="p-8 text-center text-gray-400 dark:text-gray-500">Opening your Ideavault...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl">{error}</div>
      ) : ideas.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/30">
          <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't added any ideas to the vault yet.</p>
        </div>
      ) : (
        /* Single-column grid structure as requested */
        <div className="grid gap-6 grid-cols-1">
          {ideas.map((idea) => (
            <div key={idea._id} className="flex flex-col md:flex-row bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              
              {idea.imageUrl && (
                <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
                  <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover bg-gray-100 dark:bg-gray-700" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                {editingId === idea._id ? (
                  /* INLINE EDIT MODE WRAPPER */
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={editForm.title} 
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
                      <textarea 
                        rows="3"
                        value={editForm.description} 
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Category</label>
                        <input 
                          type="text" 
                          value={editForm.category} 
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Funding</label>
                        <input 
                          type="text" 
                          value={editForm.funding} 
                          onChange={(e) => setEditForm({...editForm, funding: e.target.value})}
                          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 justify-end">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                      <button onClick={() => handleUpdate(idea._id)} className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  /* STATIC VIEW MODE CONTAINER */
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 uppercase">
                          {idea.category}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          {idea.status}
                        </span>
                      </div>
                      
                      {/* ACTION BUTTON BLOCK */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => startEditing(idea)} 
                          className="p-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          title="Edit Idea"
                        >
                          Edit
                        </button>
                        {deletingId === idea._id ? (
                          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/30 p-1 rounded border border-red-200 dark:border-red-900">
                            <span className="text-[10px] text-red-600 dark:text-red-400 px-1 font-medium">Sure?</span>
                            <button onClick={() => handleDelete(idea._id)} className="px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded hover:bg-red-700">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="px-1.5 py-0.5 text-[10px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">No</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeletingId(idea._id)} 
                            className="p-1.5 text-xs font-medium rounded border border-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Delete Idea"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{idea.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{idea.description}</p>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Funding Goal: <strong className="text-gray-800 dark:text-gray-200">{idea.funding}</strong></span>
                      <span>Created: {idea.createdAt}</span>
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