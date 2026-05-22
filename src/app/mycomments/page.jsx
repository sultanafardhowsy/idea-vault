'use client';

import { useEffect, useState } from 'react';
import { authClient, useSession } from '@/lib/auth-client';

export default function MyCommentsPage() {
  //const { data: session } = useSession();
  const { data: session, isPending } = authClient.useSession();
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (session?.user?.id) fetchMyComments();
  }, [session]);

  const fetchMyComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/mycomments?userId=${encodeURIComponent(session.user.id)}`
      );
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Comment
  const deleteComment = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:5000/comments/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
        alert("Comment deleted successfully");
      }
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  // Start Editing
  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  // Update Comment
  const updateComment = async (id) => {
    if (!editText.trim()) return alert("Comment cannot be empty");

    try {
      const res = await fetch(`http://localhost:5000/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });

      if (res.ok) {
        setComments(comments.map(c => 
          c._id === id ? { ...c, text: editText, updatedAt: new Date() } : c
        ));
        setEditingId(null);
        setEditText('');
        alert("Comment updated successfully");
      }
    } catch (err) {
      alert("Failed to update comment");
    }
  };

//   if (loading) {
//     return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">Loading...</div>;
//   }


// // Optional: Fallback if there's no active session yet
// if (!session?.user) {
//   return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">Please sign in to view your comments.</div>;
// }


  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-lg font-semibold text-red-500">
          Please log in first.
        </p>
      </div>
    );
  }

  const user = session.user;

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
    <div className="max-w-4xl mx-auto px-6 pt-10">
      
      {/* Dynamic Header with Comment Count */}
      <div className="flex items-baseline gap-3 mb-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Comments</h1>
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full">
          {comments.length}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-lg mb-10">
        Welcome back, {session?.user?.name || session?.user?.email}
      </p>

        {comments.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-20 text-center">
            <p className="text-2xl text-gray-400 dark:text-gray-500">No comments yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
              >
                {editingId === comment._id ? (
                  // Edit Mode
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={5}
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => updateComment(comment._id)}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditText(''); }}
                        className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal View
                  <>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">
                      {comment.title}
                    </h2>

                    <p className="text-[17px] leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.text}
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        By {comment.userName} •{' '}
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(comment)}
                          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteComment(comment._id)}
                          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}