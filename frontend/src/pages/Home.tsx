import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import './Home.css'; // Import CSS file for animations

interface VerifyFormData {
  inputValue: string;
}

const Home: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyFormData>();
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    company?: string;
    inputValue?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: VerifyFormData) => {
    setIsLoading(true);
    try {
      // Clean the input value
      const inputValue = data.inputValue.trim();
      
      // Make API call to backend (simulated for now)
      // In a real app, this would be an actual API call
      setTimeout(() => {
        if (['@companyx', 'companyx.com', 'telegram.me/companyx', '@kisra_fistya', 'kisra_fistya'].includes(inputValue.toLowerCase())) {
          const company = inputValue.toLowerCase().includes('kisra') ? 'KisraFistya Inc.' : 'Company X';
          setVerificationResult({
            verified: true,
            company: company,
            inputValue: inputValue
          });
        } else {
          setVerificationResult({
            verified: false,
            inputValue: inputValue
          });
        }
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        verified: false,
        inputValue: data.inputValue
      });
      setIsLoading(false);
    }
  };

  const handleViewDetails = (inputValue: string) => {
    // Target the main content container for animation instead of document.documentElement
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.add('fadeout-bounce');
    }
    
    // Navigate after a short delay to allow the animation to play
    setTimeout(() => {
      navigate(`/${inputValue}`);
    }, 300);
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
            to="/about"
            className="text-gradient-start font-medium hover:opacity-80 transition-opacity"
          >
            How it works
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
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-deep-blue">Trust Made </span>
              <span className="text-gradient">Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10">
              Verify any company channel in seconds and eliminate digital fraud
            </p>
            
            {/* Main Input Field */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <input
                  {...register('inputValue', { required: true })}
                  className={`w-full px-6 py-5 pr-36 text-lg rounded-full border ${errors.inputValue ? 'border-error-red' : 'border-gray-200'} focus:border-gradient-start focus:outline-none shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm`}
                  placeholder="Enter handle, website, or number"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white px-8 rounded-full font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin">⟳</span>
                  ) : 'Verify'}
                </motion.button>
                {errors.inputValue && (
                  <p className="text-error-red text-sm mt-2 text-left pl-4">Please enter a value to verify</p>
                )}
              </div>
            </form>
            
            {/* Verification Result */}
            {verificationResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className={`inline-flex items-center px-8 py-5 rounded-2xl shadow-lg backdrop-blur-lg border border-white/40 relative overflow-hidden ${
                  verificationResult.verified 
                    ? 'bg-gradient-to-br from-emerald-300/40 via-teal-200/30 to-green-100/40' 
                    : 'bg-gradient-to-br from-rose-300/40 via-pink-200/30 to-red-100/40'
                }`}>
                  {/* Decorative elements */}
                  <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full blur-xl" 
                    style={{
                      background: verificationResult.verified 
                        ? 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))' 
                        : 'linear-gradient(to bottom right, rgba(225, 29, 72, 0.2), rgba(248, 113, 113, 0.3))'
                    }}></div>
                  
                  {verificationResult.verified ? (
                    <>
                      <div className="flex flex-col relative z-10">
                        <div className="flex items-center">
                          <div className="bg-emerald-100/70 rounded-full p-2 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-emerald-700/90 font-medium">
                              Part of <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">{verificationResult.company}</span>'s official chain
                            </span>
                          </div>
                        </div>
                        {verificationResult.inputValue && (
                          <button
                            onClick={() => handleViewDetails(verificationResult.inputValue || '')}
                            className="text-sm text-emerald-700 hover:text-emerald-900 mt-3 flex items-center justify-start hover:underline transition-colors"
                          >
                            <span>Check detailed profile</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
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
                            This channel isn't verified
                          </span>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Simplified explanation text - using cards with slight transparency */}
            <div className="max-w-2xl mx-auto mt-8 bg-gradient-to-br from-emerald-300/40 via-teal-200/30 to-green-100/40 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-white/40 relative overflow-hidden">
              {/* Decorative elements to mimic the anime-style nature background */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-300/20 to-teal-100/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-teal-200/20 to-green-100/30 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                
                <p className="text-base leading-relaxed text-emerald-900/80 mb-4">
                  Simply enter any channel you want to verify in the search box. Our trusted chain ensures 
                  that you're interacting with legitimate company representatives. Including but not limited to 
                  <span className="font-bold text-emerald-700"> Twitter</span>, 
                  <span className="font-bold text-emerald-700"> Facebook</span>, 
                  <span className="font-bold text-emerald-700"> Telegram</span>, 
                  <span className="font-bold text-emerald-700"> Medium</span>, 
                  <span className="font-bold text-emerald-700"> YouTube</span>, 
                  <span className="font-bold text-emerald-700"> Instagram</span>, 
                  <span className="font-bold text-emerald-700"> LinkedIn</span>, 
                  <span className="font-bold text-emerald-700"> Reddit</span>, 
                  <span className="font-bold text-emerald-700"> Phone number</span> and 
                  <span className="font-bold text-emerald-700"> WeChat</span> account.
                </p>
                
                <p className="text-sm italic text-emerald-700/70 mt-6 border-t border-emerald-200/50 pt-4">
                  Note: Only trust channels verified through Verify.me.
                </p>
              </div>
            </div>
          </div>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 