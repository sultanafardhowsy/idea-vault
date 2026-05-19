
import Image from "next/image";
import { LuMapPin } from "react-icons/lu";


const IdeaCard = ({ idea }) => {

  console.log(idea);
  const {title,category, imageUrl, funding, founder, status,tags, description } = idea;

  return (
    <div className="border">
     {imageUrl && imageUrl.trim() !== "" ? (
  <Image
    className="object-cover"
    alt={title}
    src={imageUrl}
    height={200}
    width={200}
  />
) : (
  /* This renders when the URL is empty or null */
  <div 
    style={{ height: '400px', width: '400px' }} 
    className="bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 font-medium"
  >
    🖼 No Image Available
  </div>
)}

      <div className="p-2">
        <div className="flex items-center gap-1">
          <LuMapPin /> <span>{category}</span>
        </div>
        <div className="flex justify-between">
          <div>
            <div>
              <h2 className="text-xl font-bold">{founder}</h2>
            </div>
            <div className="flex gap-1 items-center">
               {funding}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold">$ {status}</h3>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default IdeaCard;
