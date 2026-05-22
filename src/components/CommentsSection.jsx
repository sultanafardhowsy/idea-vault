"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const BASE = "http://localhost:5000";

export default function CommentsSection({ ideaId,title }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const editRef = useRef(null);

  useEffect(() => {
    fetchComments();
  },[ideaId, title || ""]);

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  async function fetchComments() {
    try {
      const res = await fetch(`${BASE}/comments?ideaId=${ideaId}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId,
          title,
          text,
          userId: user.id,
          userName: user.name,
         
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setText("");
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(commentId) {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${BASE}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, text: editText.trim() } : c
          )
        );
        setEditingId(null);
        setEditText("");
      }
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  }

  async function handleDelete(commentId) {
    setDeletingId(commentId);
    try {
      const res = await fetch(`${BASE}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Failed to delete comment", err);
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(comment) {
    setEditingId(comment._id);
    setEditText(comment.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        💬 Comments
        {comments.length > 0 && (
          <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2.5 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Add Comment */}
      {user ? (
        <form onSubmit={handleAdd} className="mb-8">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts on this idea..."
                rows={3}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all text-sm font-semibold flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Posting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium">
          Please{" "}
          <a href="/login" className="underline font-bold">
            log in
          </a>{" "}
          to leave a comment.
        </div>
      )}

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-600">
          <p className="text-4xl mb-2">💭</p>
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = user && user.id === comment.userId;
            const isEditing = editingId === comment._id;
            const isDeleting = deletingId === comment._id;

            return (
              <div
                key={comment._id}
                className="group border border-gray-100 dark:border-gray-800 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {comment.userImage ? (
                      <Image
                        src={comment.userImage}
                        alt={comment.userName}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      comment.userName?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.updatedAt && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            (edited)
                          </span>
                        )}
                      </div>

                      {isOwner && !isEditing && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(comment)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-medium transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            disabled={isDeleting}
                            className="px-2.5 py-1 text-xs rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-medium transition-all disabled:opacity-50"
                          >
                            {isDeleting ? "..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          ref={editRef}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full p-3 rounded-xl border border-blue-400 dark:border-blue-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none text-sm transition-all"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdate(comment._id)}
                            disabled={!editText.trim()}
                            className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-all"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}