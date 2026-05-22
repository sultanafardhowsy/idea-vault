"use client";

import { useEffect, useState } from "react";

export default function CommunityFeedback() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) return;
    fetch(`${serverUrl}/comments6`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching community feedback:", err);
        setComments([]);
      });
  }, []);

  return (
    // <section className=" py-16 px-4 bg-gray-100 dark:bg-gray-900">
    <div className='min-h-auto w-7xl mx-auto flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300'>
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Community Feedback
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {comments?.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h4>
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{item.text}"
              </p>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.userName}
                </h4>

                <p className="text-sm text-gray-500">
                  Idea Contributor
                </p>
              </div>
            </div>
          ))}
          
        </div>
      </div>
      </div>
    // </section>
  );
}