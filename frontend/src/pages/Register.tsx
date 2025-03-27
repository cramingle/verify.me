import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface RegisterFormData {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send registration data to backend
      const response = await axios.post('/api/auth/register', {
        name: data.companyName,
        email: data.email,
        password: data.password
      });
      
      setIsSubmitted(true);
      reset();
      // Registration successful, JWT token might be in the response
      // In a real app, you might want to store the token and redirect
      // For now, we'll just show success message
    } catch (error: any) {
      console.error('Error during registration:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation patterns
  const namePattern = /^[a-zA-Z0-9\s-&.,]{2,100}$/;
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/postman.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay to control background image brightness */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-amber-700/10 z-0"></div>
      
      {/* Header */}
      <header className="py-6 px-6 md:px-10 flex justify-between items-center relative z-10">
        <Link to="/" className="text-amber-800 text-2xl font-bold">
          Verify<span className="text-amber-500">.me</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-amber-700 font-medium hover:text-amber-900"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center pt-8 md:pt-0 relative z-10">
        <div className="w-full max-w-5xl mx-auto px-6 grid grid-cols-12 gap-4">
          {/* Left space for Totoro character */}
          <div className="hidden md:block md:col-span-6 lg:col-span-5">
            {/* This space intentionally left empty to accommodate the Totoro character in the background */}
          </div>
          
          {/* Form content - shifted further to the right */}
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <div className="text-center md:text-left mb-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <span className="text-amber-950">Register </span>
                <span className="text-amber-800">Your Company</span>
              </h1>
              <p className="text-lg font-medium bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg text-amber-950 shadow-sm mt-2 inline-block">
                Create your company account to start building trusted verification chains for your customers.
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-gradient-to-br from-amber-300/40 via-amber-200/30 to-orange-100/40 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-amber-100/40 relative overflow-hidden">
              {/* Decorative elements to match the warm library tones */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-200/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-orange-300/20 to-amber-100/30 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-amber-100/70 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">Registration Successful!</h3>
                    <p className="text-amber-800 mb-4">We've sent a verification email to your inbox. Please check and confirm your email to activate your account.</p>
                    <Link 
                      to="/" 
                      className="inline-block bg-gradient-to-r from-amber-500 to-amber-700 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Return to Home
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                      </div>
                    )}
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-amber-900 mb-1">
                        Company Name
                      </label>
                      <input
                        {...register('companyName', { 
                          required: 'Company name is required',
                          pattern: {
                            value: namePattern,
                            message: 'Company name should only contain letters, numbers, spaces, hyphens, ampersands, and periods (2-100 characters)'
                          },
                          minLength: {
                            value: 2,
                            message: 'Company name must be at least 2 characters long'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Company name must not exceed 100 characters'
                          }
                        })}
                        type="text"
                        className={`w-full px-4 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border ${
                          errors.companyName ? 'border-error-red' : 'border-amber-200/60'
                        } focus:border-amber-500 focus:outline-none transition-all duration-300`}
                        placeholder="Acme Corporation"
                      />
                      {errors.companyName && (
                        <p className="text-error-red text-sm mt-1">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-amber-900 mb-1">
                        Business Email
                      </label>
                      <input
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: emailPattern,
                            message: 'Please enter a valid email address'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Email must not exceed 100 characters'
                          }
                        })}
                        type="email"
                        className={`w-full px-4 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border ${
                          errors.email ? 'border-error-red' : 'border-amber-200/60'
                        } focus:border-amber-500 focus:outline-none transition-all duration-300`}
                        placeholder="info@yourcompany.com"
                      />
                      {errors.email && (
                        <p className="text-error-red text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-amber-900 mb-1">
                        Password
                      </label>
                      <input
                        {...register('password', { 
                          required: 'Password is required',
                          pattern: {
                            value: passwordPattern,
                            message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
                          }
                        })}
                        type="password"
                        className={`w-full px-4 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border ${
                          errors.password ? 'border-error-red' : 'border-amber-200/60'
                        } focus:border-amber-500 focus:outline-none transition-all duration-300`}
                      />
                      {errors.password && (
                        <p className="text-error-red text-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-900 mb-1">
                        Confirm Password
                      </label>
                      <input
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: value => value === watch('password') || 'Passwords do not match'
                        })}
                        type="password"
                        className={`w-full px-4 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border ${
                          errors.confirmPassword ? 'border-error-red' : 'border-amber-200/60'
                        } focus:border-amber-500 focus:outline-none transition-all duration-300`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-error-red text-sm mt-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-amber-800 mb-4">
                        By registering, you agree to our <Link to="/terms" className="text-amber-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>.
                      </p>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white py-2.5 px-10 rounded-full font-semibold shadow-lg hover:shadow-amber-400/20 transition-all duration-300 ${
                          isSubmitting ? 'opacity-70' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="inline-flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : 'Create Account'}
                      </motion.button>
                    </div>
                    
                    <div className="text-center mt-6">
                      <p className="text-amber-800">
                        Already have an account? <Link to="/login" className="text-amber-600 hover:underline font-medium">Sign in</Link>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/30 py-6 px-6 md:px-10 bg-amber-50/40 backdrop-blur-sm relative z-10 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-amber-800 text-sm mb-4 sm:mb-0">
              © 2025 Verify.me | Trust Made Simple
            </p>
            <div className="flex space-x-8">
              <Link to="/about" className="text-amber-700 font-medium text-sm">About Us</Link>
              <Link to="/privacy" className="text-amber-700 font-medium text-sm">Privacy</Link>
              <Link to="/terms" className="text-amber-700 font-medium text-sm">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register; 