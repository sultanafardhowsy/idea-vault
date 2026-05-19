

import FeaturedCard from "@/components/animations/featured";


async function getIdeas() {
  const res = await fetch('http://localhost:5000/ideas', {
    cache: 'no-store',
  });

  const data = await res.json();

  return data;
}

export default async function HomeFeatured() {

  const ideas = await getIdeas();

  return (
 
    <div className='max-w-7xl mx-auto border rounded-2xl shadow-md bg-white dark:bg-zinc-900 flex flex-col h-full'>
           <h2 className="text-2xl font-bold mb-6 text-center pt-10">Featured Ideas</h2> 
           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
            {
                ideas.map(idealimit =><FeaturedCard key={idealimit._id} idealimit={idealimit} />
                    )
            }
           </div>
        </div>
  );
}