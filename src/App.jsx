import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import AddPost from './pages/AddPost';
import Posts from './pages/Posts';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-black">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/posts" />} />
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/posts" />} />
            <Route path="/add-post" element={isAuthenticated ? <AddPost /> : <Navigate to="/login" />} />
            <Route path="/posts" element={isAuthenticated ? <Posts /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/posts" : "/login"} />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;