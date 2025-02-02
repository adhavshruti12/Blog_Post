import { Link } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav className="bg-black border-b border-purple-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/posts" className="text-xl font-bold text-purple-500 hover:text-purple-400 transition-colors">
            BlogApp
          </Link>
          <div className="flex space-x-6">
            <Link to="/posts" className="text-gray-300 hover:text-purple-400 transition-colors">
              Posts
            </Link>
            <Link to="/add-post" className="text-gray-300 hover:text-purple-400 transition-colors">
              Add Post
            </Link>
            <button
              onClick={onLogout}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;