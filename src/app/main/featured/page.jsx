// app/page.jsx

async function getIdeas() {
  const res = await fetch('http://localhost:5000/ideas', {
    cache: 'no-store',
  });

  return res.json();
}

export default async function Home() {
  const ideas = await getIdeas();

  return (
    <div>
      <h1>Ideas</h1>

      {ideas.map((idea) => (
        <div key={idea._id}>
          <h2>{idea.title}</h2>
        </div>
      ))}
    </div>
  );
}