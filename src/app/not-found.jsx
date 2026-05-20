"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black transition-colors duration-300">
      
      <div className="text-center">
        <h1 className="text-7xl md:text-9xl font-extrabold text-blue-600 dark:text-blue-400">
          404
        </h1>

        <h2 className="mt-4 text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
}