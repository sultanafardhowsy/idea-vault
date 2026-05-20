"use client";

import { useEffect, useState } from "react";

export default function CommunityFeedback() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/comments6")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Community Feedback
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {comments.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
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
    </section>
  );
}