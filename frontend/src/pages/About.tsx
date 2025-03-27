import React from 'react';
import { Link } from 'react-router-dom';
import { trackButtonClick, trackFeatureUsage } from '../utils/analytics';

const About: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/forest-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gradient-start/5 to-gradient-end/10 z-0"></div>
      
      {/* Header */}
      <header className="py-4 px-6 md:px-10 flex justify-between items-center relative z-10">
        <Link 
          to="/" 
          className="text-deep-blue text-2xl font-bold"
          onClick={() => trackButtonClick('logo', 'About')}
        >
          Verify<span className="text-gradient">.me</span>
        </Link>
        <Link 
          to="/signup" 
          className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-5 py-1.5 rounded-md font-medium transition-all duration-300 hover:shadow-md text-sm"
          onClick={() => trackButtonClick('for_business', 'About')}
        >
          For Business
        </Link>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-2 relative z-10">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="text-deep-blue">Trust Made </span>
              <span className="text-gradient">Simple</span>
            </h1>
          </div>
          
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* The Problem */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/40">
              <h2 className="text-lg font-bold text-deep-blue mb-2">The Problem</h2>
              <p className="text-gray-700 font-medium text-sm">
                Digital fraud costs billions yearly. Fake accounts, phishing, and scams are everywhere.
              </p>
            </div>
            
            {/* Our Solution */}
            <div className="bg-gradient-to-br from-emerald-300/40 to-green-100/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/40">
              <h2 className="text-lg font-bold text-emerald-800 mb-2">Our Solution</h2>
              <p className="text-emerald-900/80 font-medium text-sm">
                Verify.me creates an unbreakable verification chain across all company channels.
              </p>
            </div>
          </div>
          
          {/* How It Works - Visual Steps */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/40 mb-4">
            <h2 className="text-lg font-bold text-deep-blue mb-2 text-center">How It Works</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="p-2">
                <div className="w-10 h-10 bg-gradient-start/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-gradient-start">1</span>
                </div>
                <p className="text-xs text-gray-700">Company registers channels</p>
              </div>
              
              <div className="p-2">
                <div className="w-10 h-10 bg-gradient-start/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-gradient-start">2</span>
                </div>
                <p className="text-xs text-gray-700">We verify ownership</p>
              </div>
              
              <div className="p-2">
                <div className="w-10 h-10 bg-gradient-start/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-gradient-start">3</span>
                </div>
                <p className="text-xs text-gray-700">Channels join verification chain</p>
              </div>
              
              <div className="p-2">
                <div className="w-10 h-10 bg-gradient-start/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-gradient-start">4</span>
                </div>
                <p className="text-xs text-gray-700">Users instantly verify legitimacy</p>
              </div>
            </div>
          </div>
          
          {/* Benefits - Icon Grid */}
          <div className="bg-gradient-to-br from-blue-300/40 to-purple-100/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/40">
            <h2 className="text-lg font-bold text-deep-blue mb-2 text-center">Benefits</h2>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
                <h3 className="font-bold text-deep-blue mb-1 text-sm">For Businesses</h3>
                <p className="text-xs text-gray-700">Protect brand • Build trust • Reduce fraud</p>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
                <h3 className="font-bold text-deep-blue mb-1 text-sm">For Users</h3>
                <p className="text-xs text-gray-700">Avoid scams • Verify instantly • Stay safe online</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                to="/signup" 
                className="inline-block bg-gradient-to-r from-gradient-start to-gradient-end text-white py-1.5 px-5 rounded-md font-medium text-sm"
                onClick={() => {
                  trackButtonClick('join_now', 'About');
                  trackFeatureUsage('signup_from_about');
                }}
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200/30 py-3 px-6 md:px-10 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-xs mb-1 sm:mb-0">
              © 2025 Verify.me | Trust Made Simple
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/" 
                className="text-gradient-start text-xs font-medium"
                onClick={() => trackButtonClick('home_footer', 'About')}
              >
                Home
              </Link>
              <Link 
                to="/privacy" 
                className="text-gradient-start text-xs font-medium"
                onClick={() => trackButtonClick('privacy_footer', 'About')}
              >
                Privacy
              </Link>
              <Link 
                to="/register" 
                className="text-gradient-start text-xs font-medium"
                onClick={() => trackButtonClick('contact_footer', 'About')}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About; 