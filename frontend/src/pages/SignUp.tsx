import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const LandingPage: React.FC = () => {
  // Demo state for the business side (left)
  const [demoInput, setDemoInput] = useState('');
  const [demoResult, setDemoResult] = useState<null | { verified: boolean, company: string }>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // User channel state (right) - stored in local storage
  const [userChannel, setUserChannel] = useState('');
  const [userChannelType, setUserChannelType] = useState('x');
  const [channelSaved, setChannelSaved] = useState(false);
  
  // Load user channel from localStorage on component mount
  useEffect(() => {
    const savedChannel = localStorage.getItem('userChannel');
    const savedChannelType = localStorage.getItem('userChannelType');
    
    if (savedChannel) {
      setUserChannel(savedChannel);
      setChannelSaved(true);
    }
    
    if (savedChannelType) {
      setUserChannelType(savedChannelType);
    }
  }, []);
  
  // Save user channel to localStorage
  const saveUserChannel = () => {
    if (!userChannel) return;
    
    // Remove @ prefix for Twitter handles before saving
    let channelToSave = userChannel;
    if (userChannelType === 'x' && channelToSave.startsWith('@')) {
      channelToSave = channelToSave.substring(1);
    }
    
    localStorage.setItem('userChannel', channelToSave);
    localStorage.setItem('userChannelType', userChannelType);
    setChannelSaved(true);
  };

  const handleDemoVerify = () => {
    if (!demoInput) return;
    
    setIsAnimating(true);
    
    // Enhanced verification process that checks against the user's saved channel
    setTimeout(() => {
      const savedChannel = localStorage.getItem('userChannel');
      const savedChannelType = localStorage.getItem('userChannelType');
      
      // Format input and saved channel for comparison
      let formattedInput = demoInput.toLowerCase();
      let formattedSavedChannel = savedChannel ? savedChannel.toLowerCase() : '';
      
      // Handle Twitter handles with @ for comparison
      if (savedChannelType === 'x') {
        if (formattedInput.startsWith('@')) formattedInput = formattedInput.substring(1);
        if (formattedSavedChannel.startsWith('@')) formattedSavedChannel = formattedSavedChannel.substring(1);
      }
      
      // First check if the input matches the user's saved channel
      if (savedChannel && (formattedInput === formattedSavedChannel || formattedInput === `@${formattedSavedChannel}`)) {
        setDemoResult({ 
          verified: true, 
          company: 'Your Company (Demo)' 
        });
      }
      // Default demo examples still work
      else if (['@companyx', 'companyx.com', 'telegram.me/companyx'].includes(formattedInput)) {
        setDemoResult({ verified: true, company: 'Company X' });
      } else {
        setDemoResult({ verified: false, company: '' });
      }
      
      setIsAnimating(false);
    }, 1200);
  };

  // Format channel for display based on type
  const getFormattedChannel = (type: string, value: string) => {
    switch (type) {
      case 'x':
        // Remove @ if it exists at the beginning of the value
        const cleanHandle = value.startsWith('@') ? value : `@${value}`;
        return cleanHandle;
      case 'website':
        return value.includes('http') ? value : `${value}`;
      case 'telegram':
        return value.includes('t.me') ? value : `t.me/${value}`;
      case 'email':
        return value;
      default:
        return value;
    }
  };
  
  // Clear user channel
  const clearUserChannel = () => {
    localStorage.removeItem('userChannel');
    localStorage.removeItem('userChannelType');
    setUserChannel('');
    setChannelSaved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-blue to-deep-blue overflow-hidden">
      {/* Animated gradient circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-gradient-start opacity-10 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-gradient-end opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[50%] w-[25rem] h-[25rem] rounded-full bg-teal opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-20 backdrop-blur-md bg-deep-blue/30 border-b border-white/10 py-5 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Verify<span className="text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">.me</span>
          </Link>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/register" className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-md border border-white/20 hover:bg-white/20 transition-colors">
              Register
            </Link>
          </motion.div>
        </div>
      </header>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Verification Demo for Businesses */}
          <div>
            <h1 
              className="text-6xl font-bold text-white mb-6 leading-tight"
            >
              One chain to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">verify</span> them all
            </h1>
            
            <p 
              className="text-white/80 text-xl mb-10"
            >
              Eliminate fraud with a verified channel chain for your brand's digital presence
            </p>
            
            {/* Business Verification Demo */}
            <div 
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl mb-8"
            >
              <h2 className="text-white text-xl font-semibold mb-2">Business View: Verify a Channel</h2>
              <p className="text-white/80 text-sm mb-4">
                <span className="bg-gradient-start/20 text-gradient-start px-2 py-1 rounded-full text-sm font-bold mr-1">Try it now!</span> 
                Enter any handle or website to see instant verification in action
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Enter @handle, website, or number"
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDemoVerify}
                  className="absolute right-2 top-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white py-1 px-4 rounded-md"
                >
                  Verify
                </motion.button>
              </div>
              
              <AnimatePresence>
                {(demoResult || isAnimating) && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isAnimating ? (
                      <div className="flex items-center space-x-3 text-white/70">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Verifying...</span>
                      </div>
                    ) : demoResult?.verified ? (
                      <div className="flex items-center space-x-3 text-success-green">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Verified: Official channel of {demoResult.company}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 text-error-red">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Not verified: Channel not found in any company chain</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="bg-gradient-start/10 border border-gradient-start/30 rounded-md p-3 mt-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-white/80 text-sm">
                    <strong className="text-gradient-start">Demo examples:</strong> Try with {channelSaved ? getFormattedChannel(userChannelType, userChannel) : 'your own channel →'}, 
                    <strong className="text-white"> @CompanyX</strong>, 
                    <strong className="text-white"> companyx.com</strong>, or 
                    <strong className="text-white"> telegram.me/companyx</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/register" className="bg-gradient-to-r from-gradient-start to-gradient-end text-white py-3 px-8 rounded-md font-medium text-center block">
                  Register
                </Link>
              </motion.div>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/10 backdrop-blur-md text-white py-3 px-8 rounded-md font-medium border border-white/20"
                >
                  See How It Works
                </motion.button>
              </Link>
            </div>
          </div>
          
          {/* Right side - User Channel Setup */}
          <div
            className="relative lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end opacity-30 blur-xl rounded-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl shadow-2xl">
              <div className="bg-deep-blue/90 rounded-lg p-6">
                {/* User Dashboard Mock Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-white font-bold">Your Verify.me Channel</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-error-red"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-success-green"></div>
                  </div>
                </div>
                
                {/* User Channel Setup */}
                <div className="mb-6">
                  <h2 className="text-white text-xl font-semibold mb-2">Create Your Verifiable Channel</h2>
                  <p className="text-white/80 text-sm mb-4">
                    <span className="bg-gradient-end/20 text-gradient-end px-2 py-1 rounded-full text-sm font-bold">Live Demo</span> 
                    Create your channel and verify it instantly on the left
                  </p>
                  
                  {!channelSaved ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Channel Type</label>
                        <select 
                          value={userChannelType}
                          onChange={(e) => setUserChannelType(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent"
                        >
                          <option value="x">X (Twitter)</option>
                          <option value="website">Website</option>
                          <option value="telegram">Telegram</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          {userChannelType === 'x' ? 'Handle (with or without @)' : 
                           userChannelType === 'website' ? 'Website URL' : 
                           userChannelType === 'telegram' ? 'Telegram Username' : 
                           'Email Address'}
                        </label>
                        <input
                          type="text"
                          value={userChannel}
                          onChange={(e) => setUserChannel(e.target.value)}
                          placeholder={
                            userChannelType === 'x' ? '@yourusername' : 
                            userChannelType === 'website' ? 'yourwebsite.com' : 
                            userChannelType === 'telegram' ? 'yourusername' : 
                            'you@company.com'
                          }
                          className="w-full bg-white/10 border border-white/20 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent"
                        />
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveUserChannel}
                        disabled={!userChannel}
                        className={`w-full py-3 px-4 rounded-md font-medium text-center ${
                          !userChannel 
                            ? 'bg-white/5 text-white/50 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-gradient-start to-gradient-end text-white'
                        }`}
                      >
                        Create My Channel & Test It
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white/5 p-6 rounded-lg border border-success-green/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70 text-sm">Your Channel</span>
                          <span className="bg-success-green/20 text-success-green text-xs px-2 py-1 rounded-full">Verified</span>
                        </div>
                        <div className="text-white text-xl font-semibold mb-4">
                          {getFormattedChannel(userChannelType, userChannel)}
                        </div>
                        <div className="text-white/60 text-sm">
                          Channel Type: {
                            userChannelType === 'x' ? 'X (Twitter)' : 
                            userChannelType === 'website' ? 'Website' : 
                            userChannelType === 'telegram' ? 'Telegram' : 
                            'Email'
                          }
                        </div>
                      </div>
                      
                      <div className="bg-gradient-end/10 border border-gradient-end/30 rounded-md p-4 text-white/80 text-sm">
                        <p className="font-bold text-gradient-end mb-2">✨ Try it now! ✨</p>
                        <p className="mb-2">Your channel is ready to verify! Copy and paste your channel in the verification field on the left:</p>
                        <p className="bg-white/10 p-2 rounded text-center font-medium">
                          {getFormattedChannel(userChannelType, userChannel)}
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearUserChannel}
                        className="w-full bg-white/10 border border-white/20 text-white py-2 px-4 rounded-md font-medium"
                      >
                        Clear & Create New Channel
                      </motion.button>
                    </div>
                  )}
                </div>
                
                {/* Stats Preview */}
                <div>
                  <div className="text-white text-lg font-semibold mb-3">Channel Statistics</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-md">
                      <div className="text-gradient-start text-2xl font-bold">1</div>
                      <div className="text-white/70 text-sm mt-1">Verified Channel</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-md">
                      <div className="text-gradient-end text-2xl font-bold">100%</div>
                      <div className="text-white/70 text-sm mt-1">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features with Graphics */}
        <div className="mb-20">
          <h2 
            className="text-3xl font-bold text-center text-white mb-16"
          >
            How Verify.me Protects Your Brand
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Chain Your Channels",
                description: "Link all your digital touchpoints into a verified chain",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                title: "Instant Verification",
                description: "Users verify any channel with one click",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Track & Analyze",
                description: "See how users interact with your approachable channel",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-gradient-start mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pricing */}
        <div 
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">Simple Pricing</h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">Protect your brand with our straightforward pricing - perfect for indie hackers and businesses</p>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 max-w-4xl mx-auto">
            {/* useState hooks for pricing toggle */}
            {(() => {
              const [isAnnual, setIsAnnual] = React.useState(false);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Freemium Plan */}
                  <div className="p-6">
                    <div className="text-white text-2xl font-bold mb-4">Freemium</div>
                    <div className="flex flex-col items-center mb-6">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-white">$0</span>
                        <span className="text-white/70 ml-1 mb-1">/forever</span>
                      </div>
                      <div className="text-white/60 text-sm mt-1">Perfect for getting started</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                        <span className="text-white/80">1 verified channel</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                        <span className="text-white/80">500 verifications/month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80">Basic analytics</span>
                  </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Community support</span>
                      </li>
                </ul>
                    <div className="h-10"> {/* Fixed height container to align buttons */}
                <motion.a
                        href="/signup"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="block bg-white/10 hover:bg-white/20 text-white text-center py-3 rounded-md font-medium"
                >
                        Start Free
                </motion.a>
                    </div>
              </div>
              
                  {/* Indie Plan */}
              <div className="p-6 relative">
                <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[-10%]">
                  <div className="bg-gradient-to-r from-gradient-start to-gradient-end text-white text-xs uppercase font-bold py-1 px-3 rounded-full inline-block">Popular</div>
                </div>
                    <div className="text-white text-2xl font-bold mb-4">Indie Plan</div>
                    
                    {/* Pricing Toggle */}
                    <div className="flex items-center justify-center mb-6">
                      <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/70'}`}>Monthly</span>
                      <label className="relative inline-flex items-center cursor-pointer mx-3">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isAnnual}
                          onChange={() => setIsAnnual(!isAnnual)}
                        />
                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gradient-to-r from-gradient-start to-gradient-end after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-end/20"></div>
                      </label>
                      <span className={`text-sm flex items-center ${isAnnual ? 'text-white' : 'text-white/70'}`}>
                        Annual
                        <span className="ml-1 bg-gradient-start/20 text-gradient-start text-xs px-1.5 py-0.5 rounded-full">Save $10</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-center mb-6">
                      <div className="flex items-end">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">
                          {isAnnual ? '$50' : '$5'}
                        </span>
                        <span className="text-white/70 ml-1 mb-1">
                          {isAnnual ? '/year' : '/month'}
                        </span>
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        {isAnnual ? 'Less than $4.17/month' : 'or $50/year (billed annually)'}
                      </div>
                </div>
                    
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Up to 8 verified channels</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">2,000 verifications/month</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                        <span className="text-white/80">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Email support</span>
                      </li>
                    </ul>
                    <div className="h-10"> {/* Fixed height container to align buttons */}
                      <motion.a
                        href="/signup"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className="block bg-gradient-to-r from-gradient-start to-gradient-end text-white text-center py-3 rounded-md font-medium"
                      >
                        Get Started
                      </motion.a>
                    </div>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="p-6">
                    <div className="text-white text-2xl font-bold mb-4">Enterprise</div>
                    <div className="flex flex-col items-center mb-6">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-white">Custom pricing</span>
                      </div>
                      <div className="text-white/60 text-sm mt-1">Tailored to your needs</div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                        <span className="text-white/80">Unlimited verified channels</span>
                  </li>
                  <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80">Unlimited verifications</span>
                  </li>
                  <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Advanced analytics & reporting</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                        <span className="text-white/80">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                        <svg className="h-5 w-5 text-gradient-start mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/80">Priority support</span>
                  </li>
                </ul>
                    <div className="h-10"> {/* Fixed height container to align buttons */}
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                        className="block bg-white/10 hover:bg-white/20 text-white text-center py-3 rounded-md font-medium"
                >
                        Register
                </motion.a>
              </div>
            </div>
          </div>
              );
            })()}
          </div>
        </div>
        
        {/* CTA */}
        <div
          className="bg-gradient-to-r from-gradient-start to-gradient-end p-0.5 rounded-xl mb-20"
        >
          <div className="bg-deep-blue/90 backdrop-blur-md rounded-lg p-10 text-center">
            <h2 className="text-white text-3xl font-bold mb-4">Create a trusted chain for your users</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Help your customers connect with confidence, knowing they're engaging with legitimate representatives and avoiding fraud
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/register" className="inline-block bg-gradient-to-r from-gradient-start to-gradient-end text-white py-3 px-8 rounded-md font-medium">
                Build Trust Today
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-20 backdrop-blur-md bg-deep-blue/30 border-t border-white/10 py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 sm:mb-0">
              © 2025 Verify.me | Trust Made Simple
            </p>
            <div className="flex space-x-8">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Link to="/about" className="text-white/70 hover:text-white font-medium text-sm transition-colors">
                  About Us
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Link to="/privacy" className="text-white/70 hover:text-white font-medium text-sm transition-colors">
                  Privacy Policy
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 