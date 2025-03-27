import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// Mock data - would be replaced with real API calls
const mockVerifiedProfiles: Record<string, VerifiedProfile> = {
  '@kisra_fistya': {
    handle: '@kisra_fistya',
    verified: true,
    company: 'KisraFistya Inc.',
    role: 'employee' as const,
    title: 'Lead Developer',
    channels: [
      { type: 'x', handle: '@kisra_fistya', url: 'https://x.com/kisra_fistya', verified: true },
      { type: 'telegram', handle: 't.me/kisra_fistya', url: 'https://t.me/kisra_fistya', verified: true },
      { type: 'website', handle: 'kisrafistya.com', url: 'https://kisrafistya.com', verified: true },
      { type: 'email', handle: 'contact@kisrafistya.com', url: 'mailto:contact@kisrafistya.com', verified: true },
      { type: 'linkedin', handle: 'in/kisrafistya', url: 'https://linkedin.com/in/kisrafistya', verified: true }
    ]
  },
  '@companyx': {
    handle: '@companyx',
    verified: true,
    company: 'Company X',
    role: 'company' as const,
    channels: [
      { type: 'x', handle: '@companyx', url: 'https://x.com/companyx', verified: true },
      { type: 'telegram', handle: 't.me/companyx', url: 'https://t.me/companyx', verified: true },
      { type: 'website', handle: 'companyx.com', url: 'https://companyx.com', verified: true },
      { type: 'email', handle: 'support@companyx.com', url: 'mailto:support@companyx.com', verified: true }
    ]
  },
  '@companyx_rep': {
    handle: '@companyx_rep',
    verified: true,
    company: 'Company X',
    role: 'representative' as const,
    title: 'Customer Support Manager',
    channels: [
      { type: 'x', handle: '@companyx_rep', url: 'https://x.com/companyx_rep', verified: true },
      { type: 'telegram', handle: 't.me/companyx_rep', url: 'https://t.me/companyx_rep', verified: true },
      { type: 'email', handle: 'rep@companyx.com', url: 'mailto:rep@companyx.com', verified: true }
    ]
  }
};

interface Channel {
  type: string;
  handle: string;
  url: string;
  verified: boolean;
}

interface VerifiedProfile {
  handle: string;
  verified: boolean;
  company: string;
  role: 'company' | 'representative' | 'employee';
  title?: string;
  channels: Channel[];
}

const VerifyProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<VerifiedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/verify/${handle}`);
        // setProfile(response.data);
        
        // For now, use mock data
        setTimeout(() => {
          // Clean the handle parameter - removes the @ if it's in the URL but not in the key
          let searchHandle = handle || '';
          if (!searchHandle.startsWith('@') && Object.keys(mockVerifiedProfiles).some(k => k === `@${searchHandle}`)) {
            searchHandle = `@${searchHandle}`;
          }
          
          const mockProfile = mockVerifiedProfiles[searchHandle as keyof typeof mockVerifiedProfiles];
          
          if (mockProfile) {
            setProfile(mockProfile);
          } else {
            setError('Profile not found or not verified');
          }
          
          setLoading(false);
        }, 800); // Simulate API delay
      } catch (err) {
        setError('Error fetching profile information');
        setLoading(false);
      }
    };

    if (handle) {
      fetchProfile();
    } else {
      setError('Invalid handle');
      setLoading(false);
    }
  }, [handle]);

  // Icons for different channel types
  const getChannelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'x':
        return (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'website':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case 'telegram':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.932 9.112c-.146.658-.537.818-1.088.51l-3.01-2.22-1.45 1.397c-.16.16-.296.296-.606.296l.214-3.053 5.552-5.023c.242-.212-.054-.332-.374-.12l-6.865 4.326-2.962-.924c-.642-.203-.657-.642.136-.95l11.57-4.458c.536-.196 1.006.128.815 1.107z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/nature-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay to control background image brightness */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gradient-start/5 to-gradient-end/10 z-0"></div>
      
      {/* Header */}
      <header className="py-6 px-6 md:px-10 flex justify-between items-center relative z-10">
        <Link to="/" className="text-deep-blue text-2xl font-bold">
          Verify<span className="text-gradient">.me</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gradient-start font-medium hover:opacity-80 transition-opacity"
          >
            Home
          </Link>
          <Link 
            to="/signup" 
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-6 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-md"
          >
            For Business
          </Link>
        </div>
      </header>
      
      {/* Main Content - Full height */}
      <main className="flex-grow flex items-center justify-center py-4 relative z-10">
        <div className="w-full max-w-4xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-t-4 border-b-4 border-gradient-start rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-8 py-5 rounded-2xl shadow-lg backdrop-blur-lg border border-white/40 relative overflow-hidden bg-gradient-to-br from-rose-300/40 via-pink-200/30 to-red-100/40">
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full blur-xl" 
                  style={{
                    background: 'linear-gradient(to bottom right, rgba(225, 29, 72, 0.2), rgba(248, 113, 113, 0.3))'
                  }}></div>
                
                <motion.div
                  animate={{ x: [0, -3, 3, -3, 0] }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex items-center"
                >
                  <div className="bg-rose-100/70 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-rose-800 font-semibold text-lg">Not Found</div>
                    <span className="text-rose-700/90 font-medium">
                      {error}
                    </span>
                  </div>
                </motion.div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="mt-8 bg-gradient-to-r from-gradient-start to-gradient-end text-white px-8 py-3 rounded-md font-medium"
              >
                Return to Home
              </motion.button>
            </motion.div>
          ) : profile ? (
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
              >
                <div className="inline-flex items-center px-8 py-5 rounded-2xl shadow-lg backdrop-blur-lg border border-white/40 relative overflow-hidden bg-gradient-to-br from-emerald-300/40 via-teal-200/30 to-green-100/40">
                  <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full blur-xl" 
                    style={{
                      background: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))'
                    }}></div>
                  
                  <div className="flex items-center relative z-10">
                    <div className="bg-emerald-100/70 rounded-full p-2 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-emerald-700/90 font-medium">
                        {profile.role === 'company' ? (
                          <>Official account of <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">{profile.company}</span></>
                        ) : profile.role === 'representative' ? (
                          <>Verified representative of <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">{profile.company}</span></>
                        ) : (
                          <>Verified employee of <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">{profile.company}</span></>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mb-12"
              >
                <div className="p-8 border-b border-gray-200/50">
                  <h1 className="text-3xl font-bold text-deep-blue flex items-center">
                    {profile.handle}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    {profile.role === 'company' ? (
                      `Official identity of ${profile.company}`
                    ) : (
                      <>
                        {profile.title && <span className="font-medium">{profile.title}</span>}
                        {profile.title && ' at '}
                        {profile.company}
                        {profile.role === 'representative' ? ' (Company Representative)' : ' (Employee)'}
                      </>
                    )}
                  </p>
                </div>
                
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-4 text-gradient-start">Verified Channels</h2>
                  
                  <div className="space-y-3">
                    {profile.channels.map((channel, index) => (
                      <motion.a
                        key={index}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between px-6 py-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 text-gradient-start">
                            {getChannelIcon(channel.type)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-800">{channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}</h3>
                            <p className="text-gray-600">{channel.handle}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-emerald-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
                
                <div className="p-8 bg-gray-50/80 border-t border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-800">Verification by Verify.me</h2>
                      <p className="text-gray-600 text-sm">Last verified: Today</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Verified since June 2025
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto mt-8 bg-gradient-to-br from-emerald-300/20 via-teal-200/10 to-green-100/20 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-white/40 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-300/20 to-teal-100/30 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-teal-200/20 to-green-100/30 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <p className="text-base leading-relaxed text-emerald-900/80 mb-4">
                    This profile has been verified by Verify.me's trusted chain technology. All linked channels belong to {profile.company} and are safe to interact with.
                  </p>
                  
                  <p className="text-sm italic text-emerald-700/70 mt-6 border-t border-emerald-200/50 pt-4">
                    Note: Only trust channels verified through Verify.me. Always check the URL is verify.me before trusting verification results.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <Link 
                  to="/" 
                  className="inline-flex items-center text-gradient-start hover:underline font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Return to Home
                </Link>
              </motion.div>
            </div>
          ) : null}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200/30 py-6 px-6 md:px-10 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0">
              © 2025 Verify.me | Trust Made Simple
            </p>
            <div className="flex space-x-8">
              <Link to="/about" className="text-gradient-start font-medium text-sm">About Us</Link>
              <Link to="/register" className="text-gradient-start font-medium text-sm">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerifyProfile; 