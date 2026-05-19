import Image from "next/image";
import React from "react";

const ShowDetailsPage = async ({ params }) => {
  const { id } = await params;

  const res = await fetch(`http://localhost:5000/showalldata/${id}`, {
    headers: {
      authorization: "logged in",
    },
    cache: "no-store",
  });

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

  // Dummy comments
  const comments = [
    {
      id: 1,
      user: "Tamanna",
      text: "This idea looks amazing!",
    },
    {
      id: 2,
      user: "Sultana",
      text: "You should add more features.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
        <Image
          src={imageUrl || "/placeholder.jpg"}
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

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Comments
            </h2>

            {/* Add Comment */}
            <div className="mb-6">
              <textarea
                placeholder="Write your comment..."
                className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                rows={4}
              />

              <button className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
                Add Comment
              </button>
            </div>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {comment.user}
                      </h4>

                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {comment.text}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white">
                        Edit
                      </button>

                      <button className="px-3 py-1 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              {tags?.map((tag, index) => (
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