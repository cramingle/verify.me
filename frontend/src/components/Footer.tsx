import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 py-6 px-6 md:px-10">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            © 2025 Verify.me | Trust Made Simple
          </p>
          <div className="flex space-x-8">
            <Link to="/about" className="text-gradient-start font-medium text-sm">About Us</Link>
            <Link to="/register" className="text-gradient-start font-medium text-sm">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 