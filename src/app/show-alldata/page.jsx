"use client";

import React, { useEffect, useState } from "react";
import IdeaCard from "@/components/ideacard";
import { FiFilter, FiCalendar, FiSearch } from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Education",
  "Agriculture",
  "Technology",
  "Health",
  "Finance",
];

const IdeaPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  /* ── Debounce search input ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Fetch ideas when debounced search changes ── */
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/allideas?search=${encodeURIComponent(debouncedSearch)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setIdeas(Array.isArray(data) ? data : data.ideas || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, [debouncedSearch]);

  /* ── Client-side filter + sort ── */
  const displayedIdeas = ideas
    .filter(
      (idea) =>
        selectedCategory === "All" || idea.category === selectedCategory
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Search bar ── */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
        <input
          type="text"
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white pl-11 pr-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          <FiFilter className="text-gray-400 text-sm flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort by date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <FiCalendar className="text-gray-400 flex-shrink-0" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* ── Result count ── */}
      {!loading && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          {displayedIdeas.length === 0
            ? "No ideas found"
            : `Showing ${displayedIdeas.length} idea${displayedIdeas.length !== 1 ? "s" : ""}${
                selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""
              }`}
        </p>
      )}

      {loading && (
        <p className="text-center text-gray-400 dark:text-gray-500 mb-4 animate-pulse">
          Loading ideas…
        </p>
      )}

      {/* ── Card grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedIdeas.length === 0 && !loading ? (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
            <span className="text-5xl mb-3">💡</span>
            <p className="text-base font-medium">
              {debouncedSearch || selectedCategory !== "All"
                ? "No ideas match your filters"
                : "No ideas yet"}
            </p>
          </div>
        ) : (
          displayedIdeas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))
        )}
      </div>
    </div>
  );
};

export default IdeaPage;