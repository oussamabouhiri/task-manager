import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mt-2 text-3xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mt-4 text-center text-gray-600 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button variant="primary" className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;