
export default function IdeaCard({ ideas }) {
  
  // 2. Add an optional chaining fallback (allidea || {}) so it never crashes 
  const tags = ideas?.tags || ['Networking', 'Barter', 'Community'];

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="p-6">
        {/* Render your title using the matching prop name */}
        <h2 className="text-xl font-bold text-gray-900">{ideas?.title}</h2>
        <p className="text-gray-600 text-sm mt-2">{ideas?.description}</p>
        
        {/* Render tags safely */}
        <div className="flex gap-2 mt-4">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}