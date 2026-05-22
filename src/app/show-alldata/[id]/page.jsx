import Image from "next/image";
import React from "react";
import CommentsSection from "@/components/CommentsSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const ShowDetailsPage = async ({ params }) => {
  const { id } = await params;

  let token = null;
  try {
    const tokenData = await auth.api.getToken({
      headers: await headers(),
    });
    token = tokenData?.token ?? null;
  } catch {
    token = null;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/showalldata/${id}`, {
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  /* ── Not authenticated or forbidden ── */
  if (!res.ok) {
    const status = res.status;
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-10 max-w-md w-full">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 401 || status === 403
              ? "Login Required"
              : "Something went wrong"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            {status === 401 || status === 403
              ? "You need to be logged in to view the details of this idea."
              : `Unable to load this idea (status ${status}). Please try again later.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all text-sm"
            >
              Log In
            </Link>
            <Link
              href="/show-alldata"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Back to Ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const details = await res.json();

  const {
    _id,
    title,
    shortDescription,
    category,
    description,
    targetAudience,
    problemStatement,
    proposedSolution,
    founder,
    status,
    funding,
    imageUrl,
    tags,
    createdAt,
  } = details;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            {category}
          </span>

          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-3 py-1 rounded-full text-sm">
            {status}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {shortDescription}
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {/* Left Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Project Description
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-7">
              {description}
            </p>
          </div>

          {/* Problem Statement */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Problem Statement
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-7">
              {problemStatement}
            </p>
          </div>

          {/* Proposed Solution */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              Proposed Solution
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-7">
              {proposedSolution}
            </p>
          </div>

          {/* Comments Section — fully client-side with MongoDB persistence */}
          <CommentsSection ideaId={_id} title={title} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Founder Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Founder Information
            </h2>

            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">Founder:</span> {founder}
              </p>

              <p>
                <span className="font-semibold">Funding:</span> {funding}
              </p>

              <p>
                <span className="font-semibold">Target Audience:</span>{" "}
                {targetAudience}
              </p>

              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {createdAt}
              </p>

              <p>
                <span className="font-semibold">Project ID:</span> {_id}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Tags
            </h2>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(tags) && tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailsPage;