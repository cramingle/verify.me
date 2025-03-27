import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="py-6 px-6 md:px-10 flex justify-between items-center border-b border-gray-100">
        <Link to="/" className="text-deep-blue text-2xl font-bold">
          Verify<span className="text-gradient">.me</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/signup" 
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-6 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-md"
          >
            For Companies
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="text-deep-blue">Privacy </span>
            <span className="text-gradient">Policy</span>
          </h1>

          <div className="space-y-8 text-gray-600">
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-deep-blue mb-4">Data Security Commitment</h2>
              <p className="mb-4">
                At Verify.me, we take your privacy seriously. Our platform is built with security-first principles, ensuring that your data remains protected at every step of the process.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-start/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gradient-start" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-blue mb-2">End-to-End Encryption</h3>
                    <p>
                      All data is encrypted before it reaches our servers. We use industry-standard encryption protocols to ensure your information remains secure and inaccessible to unauthorized parties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-start/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gradient-start" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-blue mb-2">Zero-Knowledge Architecture</h3>
                    <p>
                      Our system is designed with a zero-knowledge architecture, meaning we never have access to your raw data. All information is encrypted before it reaches our servers and remains encrypted while stored.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-start/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gradient-start" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-blue mb-2">Secure Data Storage</h3>
                    <p>
                      Your data is stored in encrypted form in our secure databases. We use multiple layers of security measures to protect against unauthorized access, including regular security audits and updates.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-deep-blue mb-4">Your Rights</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-success-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You have full control over your data</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-success-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Request data deletion at any time</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-success-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Export your data in a secure format</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
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

export default Privacy; 