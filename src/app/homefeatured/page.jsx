

import FeaturedCard from "@/components/animations/featured";


async function getIdeas() {
  const res = await fetch('http://localhost:5000/ideas', {
    cache: 'no-store',
  });

  const data = await res.json();

  return data;
}

export default async function HomeFeatured() {

  const ideas = (await getIdeas()) || [];

  return (
 
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
       <h2 className="text-3xl font-bold pb-12 text-center pt-10">Featured Ideas</h2> 
          
           <div className={`grid gap-10 mt-10 justify-center ${
             ideas.length === 1
               ? 'grid-cols-1 max-w-md mx-auto'
               : ideas.length === 2
                 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                 : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full'
           }`}>
            {
                ideas.map(idealimit => <FeaturedCard key={idealimit._id} idealimit={idealimit} />)
            }
           </div>
      </div>
    
  );
}