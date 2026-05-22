

import FeaturedCard from "@/components/animations/featured";


async function getIdeas() {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      console.warn("NEXT_PUBLIC_SERVER_URL is not defined");
      return [];
    }
    const res = await fetch(`${serverUrl}/ideas`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Fetch failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error && (error.digest === 'DYNAMIC_SERVER_USAGE' || error.message?.includes('Dynamic server usage'))) {
      throw error;
    }
    console.error("Error fetching ideas:", error);
    return [];
  }
}

export default async function HomeFeatured() {
  const ideas = await getIdeas();
  const ideasArray = Array.isArray(ideas) ? ideas : [];

  return (
 
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
       <h2 className="text-3xl font-bold pb-12 text-center pt-10">Featured Ideas</h2> 
          
           <div className={`grid gap-10 mt-10 justify-center ${
             ideasArray.length === 1
               ? 'grid-cols-1 max-w-md mx-auto'
               : ideasArray.length === 2
                 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                 : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full'
           }`}>
            {
                ideasArray.map(idealimit => <FeaturedCard key={idealimit._id} idealimit={idealimit} />)
            }
           </div>
      </div>
    
  );
}