


import React from 'react';

import IdeaCard from '@/components/ideacard';

const IdeaPage = async() => {
    const res = await fetch('http://localhost:5000/allideas')
    const allideas = await res.json()
    console.log(allideas);
    return (
        <div className='max-w-7xl mx-auto px-4 py-8'>
           <h2 className="text-2xl font-bold mb-6">All Ideas</h2> 
           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
            {
                allideas.map(idea =><IdeaCard key={idea._id} idea={idea} />
                    )
            }
           </div>
        </div>
    );
};

export default IdeaPage;