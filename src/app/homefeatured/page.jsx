// app/homefeatured/page.jsx

import FeaturedIdeas from "../main/featured/page";

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
    <div className="px-10 py-5">
      <FeaturedIdeas ideas={ideas} />
    </div>
  );
}