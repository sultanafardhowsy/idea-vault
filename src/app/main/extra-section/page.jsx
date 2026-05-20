import Image from 'next/image';
import React from 'react';
import Marquee from 'react-fast-marquee';
import story from '@/assets/story.png';
import story1 from '@/assets/story1.png'

const ExtraSection = () => {
    return (
        <div className='my-4 container mx-auto items-center mt-10'>
            <h2 className='text-3xl pt-10 text-center font-bold mb-10'>Success Story</h2>
            {/* Marquee */}
      <Marquee speed={40} gradient={false}>
         <Image
          src={story}
          alt="Banner Image"
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg object-cover"
        />
         <Image
          src={story1}
          alt="Banner Image"
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg object-cover"
        />
      </Marquee>
        </div>
    );
};

export default ExtraSection;