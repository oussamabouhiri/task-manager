import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, CheckSquare, User, LogOut, PlusSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiBaseUrl } from '../../services/api';

// Updated to use environment variables
const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR_PATH;
const API_BASE_URL = getApiBaseUrl();
console.log("Default Avatar : ", DEFAULT_AVATAR);
console.log("API_BASE_URL Avatar : ", API_BASE_URL);
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to get the proper avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return `${API_BASE_URL}${DEFAULT_AVATAR}`;
    // If it's already an absolute URL
    if (avatarPath.startsWith('http')) return avatarPath;
    // Otherwise join with API base URL
    return `${API_BASE_URL}${avatarPath}`;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TManager</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/tasks/create" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <PlusSquare className="h-4 w-4 mr-1" />
              New Task
            </Link>
            <div className="relative ml-3">
              <div className="flex items-center">
                <Link
                  to="/profile" 
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <User className="h-4 w-4 mr-1" /> 
                  {currentUser?.name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks/create"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Task
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;