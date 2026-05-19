import Image from 'next/image';
import React from 'react';

export default async function FeaturedIdeas({ ideas }) {

  return (
    <section className="w-full py-12 px-10 mt-20">

      {/* Title */}
      <div className="mt-15 px-10">
        <h2 className="text-2xl font-extrabold  text-center tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Featured <span className="text-[#c9a96e]">Innovations</span>
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          Explore the top 6 most recent submissions currently secured in the vault.
        </p>
      </div>

      {/* Empty State */}
      {ideas.length === 0 ? (

        <div className="text-center py-16 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-gray-400 text-sm">
            No ideas discovered in the vault database collection yet.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {ideas.map((item) => (

            <div
              key={item._id}
              className="border rounded-2xl overflow-hidden shadow-md bg-white dark:bg-zinc-900"
            >

              {/* Image */}
              <Image
                src={item.imageUrl?.trim() ? item.imageUrl : "/placeholder.png"}
                alt={item.title}
                width={500}
                height={300}
                className="w-full h-52 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">

                <div className="flex justify-between items-center">
                  <span className="text-xs bg-[#c9a96e] text-white px-2 py-1 rounded-full">
                    {item.category}
                  </span>

                  <span className="text-sm font-semibold text-green-600">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {item.description}
                </p>

                <div className="pt-2 border-t flex justify-between text-sm">

                  <div>
                    <p className="font-semibold">
                      {item.founder}
                    </p>

                    <p className="text-gray-500">
                      Founder
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#c9a96e]">
                      {item.funding}
                    </p>

                    <p className="text-gray-500">
                      Funding
                    </p>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}