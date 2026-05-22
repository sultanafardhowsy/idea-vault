"use client";

import React, { useEffect, useState, useCallback } from "react";
import IdeaCard from "@/components/ideacard";

const IdeaPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");        // This is for input
  const [debouncedSearch, setDebouncedSearch] = useState(""); // This is for API
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch ideas when debouncedSearch changes
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <input
        type="text"
        placeholder="Search ideas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-center mb-4">Searching...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ideas.length === 0 && !loading ? (
          <p className="col-span-3 text-center text-gray-500 py-10">
            {debouncedSearch ? "No ideas found" : "No ideas yet"}
          </p>
        ) : (
          ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))
        )}
      </div>
    </div>
  );
};

export default IdeaPage;