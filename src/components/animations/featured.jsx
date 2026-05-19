// 'use client';

import Image from "next/image";

import React from 'react';

const IdeaPage = async ({idea}) => {

 
  return (
    <div className='max-w-7xl mx-auto'>
      
      <h2 className='text-3xl font-bold mb-6'>
        All Ideas
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        
        {
          allideas.map((idea) => (

            <div
              key={idea._id}
              className='border rounded-xl px-8 shadow-md'
            >

               {imageUrl && imageUrl.trim() !== "" ? (
               <div className="relative w-[400px] h-[400px] shrink-0 overflow-hidden rounded-xl">
  <Image
    src={imageUrl}
    alt={title}
     width={400} 
  height={300} 
  className="object-cover" 
  
  />
</div>





             ) : (
               /* This renders when the URL is empty or null */
               <div 
                 style={{ height: '400px', width: '400px' }} 
                 className="bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 font-medium"
               >
                 🖼 No Image Available
               </div>
             )}
              <div className='mt-3 space-y-2'>

                <h2 className='text-xl font-bold'>
                  {idea.title}
                </h2>

                <p>
                  <span className='font-semibold'>
                    Founder:
                  </span>{" "}
                  {idea.founder}
                </p>

                <p>
                  <span className='font-semibold'>
                    Category:
                  </span>{" "}
                  {idea.category}
                </p>

                <p>
                  <span className='font-semibold'>
                    Funding:
                  </span>{" "}
                  ${idea.funding}
                </p>

                <p>
                  <span className='font-semibold'>
                    Status:
                  </span>{" "}
                  {idea.status}
                </p>

                <p className='text-sm text-gray-500'>
                  {idea.description}
                </p>

              </div>

            </div>
          ))
        }

      </div>
    </div>
  );
};

export default IdeaPage;