import React from 'react';
import Link from 'next/link';
import IdeaCard from '@/components/ideacard';

// 1. Fetching all ideas directly on the server
async function getAllIdeas() {
  try {
    const res = await fetch('http://localhost:5000/allideas', {
      cache: 'no-store', // Ensures fresh data on every page reload
    });

    if (!res.ok) {
      throw new Error('Failed to fetch ideas from Express backend');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function AllIdeasPage() {
  const allideas = await getAllIdeas();

  // Safety fallback: Ensure we always have an array to prevent .map() crashes
  const ideasList = Array.isArray(allideas) ? allideas : [];

  // Calculate quick stats for the top of the dashboard
  const totalIdeas = ideasList.length;
  const trendingCount = ideasList.filter(idea => idea.status === 'Trending').length;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Innovation Hub
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Explore open-source ideas, skill-shares, and crowdsourced community projects.
            </p>
          </div>
          
          {/* Navigation link to the insert page we built earlier */}
          <Link 
            href="/new-idea" 
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-indigo-100"
          >
            + Submit New Idea
          </Link>
        </div>

        {/* Dynamic Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Projects</span>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalIdeas} Active</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Trending Now</span>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{trendingCount} Ideas</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Database Source</span>
            <h3 className="text-2xl font-mono text-gray-600 mt-1 text-sm truncate">mongodb://ideadb/allidea</h3>
          </div>
        </div>

        {/* Empty State fallback if database has zero elements */}
        {ideasList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No ideas found</h3>
            <p className="text-sm text-gray-500 mb-4">Be the first to submit a project to this ecosystem.</p>
            <Link href="/new-idea" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold underline">
              Create an idea &rarr;
            </Link>
          </div>
        ) : (
          /* The Responsive Display Grid: 1 col on mobile, 2 on tablet, 3 on laptop, 4 on wide desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ideasList.map((idea) => (
              <IdeaCard key={idea._id} allidea={idea} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}