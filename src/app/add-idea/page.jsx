import { redirect } from 'next/navigation';

export default function NewIdeaPage() {
  
  // This is a Server Action that runs securely on the server
  async function createIdea(formData) {
  'use server';

  const rawFormData = {
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    founder: formData.get('founder'),
    status: formData.get('status') || 'New',
    funding: formData.get('funding') || '$0',
    tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  console.log("Next.js is sending this payload:", rawFormData); // <-- CHECK TERMINAL

  try {
    const res = await fetch('http://localhost:5000/allidea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rawFormData),
    });

    const responseData = await res.json();
    console.log("Express server responded with:", responseData); // <-- CHECK TERMINAL

    if (!res.ok) throw new Error('Backend rejected insertion');
    
  } catch (error) {
    console.error("Submission failed:", error);
    return;
  }

  redirect('/'); 
}


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        {/* Page Header */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Submit an Innovation Idea</h1>
          <p className="text-sm text-gray-500 mt-1">Fill out the fields below to add your project to the platform.</p>
        </div>

        {/* Form using the Server Action */}
        <form action={createIdea} className="space-y-6">
          
          {/* Title input */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Project Title</label>
            <input type="text" id="title" name="title" required placeholder="e.g., SkillSwap"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category selection */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Category</label>
              <select id="category" name="category" required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800">
                <option value="Education">Education</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Status selection */}
            <div>
              <label htmlFor="status" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Status</label>
              <select id="status" name="status"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800">
                <option value="New">New</option>
                <option value="Trending">Trending</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Description</label>
            <textarea id="description" name="description" rows="3" required placeholder="Describe how your project works..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Founder input */}
            <div>
              <label htmlFor="founder" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Founder Name</label>
              <input type="text" id="founder" name="founder" required placeholder="Sarah Ahmed"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
            </div>

            {/* Funding input */}
            <div>
              <label htmlFor="funding" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Funding Amount</label>
              <input type="text" id="funding" name="funding" placeholder="e.g., $25,000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
            </div>
          </div>

          {/* Tags entry */}
          <div>
            <label htmlFor="tags" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Tags (Separated by commas)</label>
            <input type="text" id="tags" name="tags" placeholder="education, skills, community"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800" />
          </div>

          {/* Submit Button */}
          <button type="submit" 
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-colors text-sm">
            Publish Project Idea
          </button>

        </form>
      </div>
    </div>
  );
}