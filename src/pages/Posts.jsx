import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);  // State to store post clicked for Read More
  const postsPerPage = 6;

  useEffect(() => {
    // Fetch all posts from the backend API
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blog-post-backend.vercel.app/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`https://blog-post-backend.vercel.app/api/post/${id}`);
        setPosts(posts.filter(post => post._id !== id));
        toast.success('Post deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        title: editingPost.title,
        description: editingPost.description,
        image: editingPost.image,
      };
      const response = await axios.put(`https://blog-post-backend.vercel.app/api/post/${editingPost._id}`, updatedData);
      setPosts(posts.map(post => (post._id === editingPost._id ? response.data : post)));
      setEditingPost(null);
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedPost(null); // Reset expanded post when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (post) => {
    setExpandedPost(post);  // Open the modal with full post content
  };

  const closeModal = () => {
    setExpandedPost(null); // Close the modal
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex space-x-2">
          {getPageNumbers().map((number, index) => (
            number === '...' ? (
              <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={number}
                onClick={() => typeof number === 'number' && handlePageChange(number)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === number
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white'
                } transition-colors min-w-[40px]`}
              >
                {number}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-purple-500 mb-8">Blog Posts</h2>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-purple-500 mb-6">Edit Post</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                  value={editingPost.image}
                  onChange={(e) => setEditingPost({...editingPost, image: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100"
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {expandedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">{expandedPost.title}</h3>
            <img
              src={expandedPost.image}
              alt={expandedPost.title}
              className="w-full h-[300px] object-cover rounded-lg mb-6"
            />
            <p className="text-white">{expandedPost.description}</p>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post) => (
          <div key={post._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[200px] object-cover rounded-lg mt-4"
            />
            <p className="text-gray-400 mt-4">
              {post.description.length > 100 ? `${post.description.slice(0, 100)}...` : post.description}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleReadMore(post)}  // Open modal on Read More click
                className="text-purple-500 hover:text-purple-700 text-sm"
              >
                Read More
              </button>
              <div className="space-x-4">
                <FiEdit
                  onClick={() => handleEdit(post)}
                  className="text-yellow-400 hover:text-yellow-500 text-lg cursor-pointer"
                />
                <FiTrash2
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
}

export default Posts;
