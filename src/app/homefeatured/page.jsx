// app/homefeatured/page.jsx

import IdeaCard from "@/components/ideacard";

async function getIdeas() {
  const res = await fetch('http://localhost:5000/ideas', {
    cache: 'no-store',
  });

  const data = await res.json();

  return data;
}

export default async function HomeFeatured() {
  const ideas = await getIdeas();

  console.log(ideas);

  return (
    <div className="grid grid-cols-3">
     

      {Array.isArray(ideas) &&
        ideas.map((idea) => (
          <div key={idea._id}>
            <h1>{idea.title}</h1>
            <IdeaCard ideas={ideas}/>
          </div>
        ))}
    </div>
  );
}