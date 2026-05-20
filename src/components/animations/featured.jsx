

import Image from "next/image";
import { LuMapPin } from "react-icons/lu";


const FeaturedCard = ({ idealimit }) => {

  const {title,category, imageUrl, funding, founder, status,tags, description } = idealimit;

  return (
    
    <div className="border rounded-none shadow-md bg-white dark:bg-zinc-900 flex flex-col justify-center h-full px-10">
     {imageUrl && imageUrl.trim() !== "" ? (
  <Image
    className="w-full h-52 object-cover"
    alt={title}
    src={imageUrl}
    height={300}
    width={500}
  />
) : (
  /* This renders when the URL is empty or null */
  <div 
    className="w-full h-52 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 font-medium"
  >
    🖼 No Image Available
  </div>
)}

      <div className="px-6 py-5 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-1 text-sm bg-[#c9a96e] text-white px-2 py-1 rounded-full w-fit">
          <LuMapPin /> <span>{category}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 line-clamp-1">{title}</h3>
        
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {description}
          </p>
        )}
        
        <div className="mt-auto pt-4 flex justify-between items-center border-t">
          <div>
            <div className="text-sm font-semibold">{founder}</div>
            <div className="text-xs text-gray-500">Founder</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#c9a96e]">{funding}</div>
            <div className="text-xs text-gray-500">Funding</div>
          </div>
        </div>
        <div className="mt-2 text-right">
            <span className="text-sm font-semibold text-green-600">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
