import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="py-6 px-6 md:px-10 flex justify-between items-center border-b border-gray-100">
      <Link to="/" className="text-deep-blue text-2xl font-bold">
        Verify<span className="text-gradient">.me</span>
      </Link>
      <div className="flex items-center space-x-6">
        {isHome && (
          <Link 
            to="/about"
            className="text-gradient-start font-medium hover:opacity-80 transition-opacity"
          >
            How it works
          </Link>
        )}
        <Link 
          to="/signup" 
          className="bg-white border border-gradient-start hover:border-gradient-end text-gradient-start px-4 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-md"
        >
          For Companies
        </Link>
      </div>
    </header>
  );
};

export default Header; 