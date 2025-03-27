import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

// Page components
const Home = React.lazy(() => import('./pages/Home'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Channels = React.lazy(() => import('./pages/Channels'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const About = React.lazy(() => import('./pages/About'));
const Register = React.lazy(() => import('./pages/Register'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const VerifyProfile = React.lazy(() => import('./pages/VerifyProfile'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-16 h-16 border-t-4 border-b-4 border-gradient-end rounded-full animate-spin"></div>
  </div>
);

// Simple 404 component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="mt-4 text-xl text-gray-600">Page not found</p>
    <a href="/" className="mt-8 px-4 py-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-md">
      Go Home
    </a>
  </div>
);

// AnimatePresence wrapper for routes
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
        
        {/* Verification profile route - handles paths like /@kisra_fistya */}
        <Route path="/:handle" element={<PageTransition><VerifyProfile /></PageTransition>} />
        
        {/* Protected routes (would have auth check in real app) */}
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/channels" element={<PageTransition><Channels /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
        
        {/* Static pages */}
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        
        {/* Fallback route */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <AnimatedRoutes />
    </React.Suspense>
  );
}

export default App;