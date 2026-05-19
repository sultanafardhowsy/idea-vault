'use client';

import React from 'react';
import { Reveal } from '@/components/animations/Reveal';

/* ─────────────────────────────────────────────────────────────
   FeaturedCard — displays a single startup/idea document.

   MongoDB document shape:
   {
     _id:         string
     title:       string           e.g. "SafeRide"
     category:    string           e.g. "Transportation"
     description: string           e.g. "Women-focused ride-sharing..."
     founder:     string           e.g. "Ayesha Karim"
     status:      string           e.g. "Popular" | "Trending" | "New" | "Funded"
     funding:     string           e.g. "$300,000"
     tags:        string[]         e.g. ["transport", "safety", "rideshare"]
     createdAt:   string | Date
   }
   ───────────────────────────────────────────────────────────── */

/* Status badge colour map */
const STATUS_STYLES = {
  Popular:  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Trending: 'bg-orange-500/10  text-orange-600  dark:text-orange-400  border-orange-500/20',
  New:      'bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-500/20',
  Funded:   'bg-violet-500/10  text-violet-600  dark:text-violet-400  border-violet-500/20',
};

const STATUS_ICONS = {
  Popular:  '🔥',
  Trending: '📈',
  New:      '✨',
  Funded:   '💰',
};

/* Category → icon path */
const CATEGORY_ICONS = {
  Transportation: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M8 17l-2-2m0 0l-2-2m2 2h12m-6-9v9M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2" />
  ),
  Health: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ),
  Finance: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 13v-1m0-4a3 3 0 110-6 3 3 0 010 6z" />
  ),
  Education: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  ),
  Technology: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
  ),
  default: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  ),
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/* ── Single card ── */
export function FeaturedCard({ idea, index = 0 }) {
  const statusStyle = STATUS_STYLES[idea.status] ?? STATUS_STYLES.New;
  const statusIcon  = STATUS_ICONS[idea.status]  ?? '✨';
  const categoryIcon = CATEGORY_ICONS[idea.category] ?? CATEGORY_ICONS.default;

  return (
    <Reveal delay={index * 0.1} direction="up">
      <div className="glass-effect rounded-3xl p-7 h-full flex flex-col gap-5 border border-transparent hover:border-blue-500/25 hover:bg-slate-100/40 dark:hover:bg-white/5 transition-all duration-300">

        {/* ── Top row: icon + status badge ── */}
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {categoryIcon}
            </svg>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${statusStyle}`}>
            <span>{statusIcon}</span>
            {idea.status}
          </span>
        </div>

        {/* ── Title + category ── */}
        <div>
          <p className="text-xs font-medium text-blue-500 dark:text-blue-400 mb-1 uppercase tracking-wider">
            {idea.category}
          </p>
          <h3
            style={{ color: 'rgb(var(--foreground-rgb))' }}
            className="text-xl font-bold leading-snug"
          >
            {idea.title}
          </h3>
        </div>

        {/* ── Description ── */}
        <p
          style={{ color: 'rgb(var(--foreground-rgb))' }}
          className="text-sm leading-relaxed opacity-60 flex-1"
        >
          {idea.description}
        </p>

        {/* ── Tags ── */}
        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-200/60 dark:bg-white/8 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Divider ── */}
        <div className="h-px bg-slate-200 dark:bg-white/8" />

        {/* ── Meta: founder + funding + date ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Founder */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
              {idea.founder?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'rgb(var(--foreground-rgb))' }}>
                {idea.founder}
              </p>
              <p className="opacity-40" style={{ color: 'rgb(var(--foreground-rgb))' }}>Founder</p>
            </div>
          </div>

          {/* Funding + Date */}
          <div className="flex flex-col items-end gap-0.5">
            {idea.funding && (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {idea.funding}
              </span>
            )}
            {idea.createdAt && (
              <span className="opacity-40" style={{ color: 'rgb(var(--foreground-rgb))' }}>
                {formatDate(idea.createdAt)}
              </span>
            )}
          </div>
        </div>

      </div>
    </Reveal>
  );
}

/* ── Grid section ── */
export default function FeaturedSection({ ideas = [], title = 'Featured Ideas', isLoading = false }) {
  return (
    <section className="py-24 px-6" id="featured">
      <div className="container mx-auto max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <Reveal direction="down">
            <h2
              style={{ color: 'rgb(var(--foreground-rgb))' }}
              className="text-4xl font-bold mb-2"
            >
              {title}
            </h2>
          </Reveal>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-effect rounded-3xl h-72 animate-pulse bg-slate-200/40 dark:bg-white/5" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && ideas.length === 0 && (
          <div className="text-center py-20 opacity-50" style={{ color: 'rgb(var(--foreground-rgb))' }}>
            <p className="text-lg">No featured ideas yet.</p>
          </div>
        )}

        {/* Cards */}
        {!isLoading && ideas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea, index) => (
              <FeaturedCard key={idea._id ?? index} idea={idea} index={index} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
