import { useState } from 'react';

function Dashboard() {
  const [stats] = useState({
    totalPosts: 8,
    views: 1234,
    comments: 89,
    likes: 432
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalPosts}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.views}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Comments</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.comments}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Likes</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.likes}</p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-700">New Post Published</h4>
                  <p className="text-gray-500 text-sm">2 hours ago</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  Blog Post
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;