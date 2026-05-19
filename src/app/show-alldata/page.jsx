


import React from 'react';

import IdeaCard from '@/components/ideacard';

const IdeaPage = async() => {
    const res = await fetch('http://localhost:5000/allideas')
    const allideas = await res.json()
    console.log(allideas);
    return (
        <div className='max-w-7xl mx-auto'>
           <h2>All ideas</h2> 
           <div className='grid grid-cols-4 gap-3'>
            {
                allideas.map(idea =><IdeaCard key={idea._id} idea={idea} />
                    )
            }
           </div>
        </div>
    );
};

export default IdeaPage;