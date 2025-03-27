import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

interface AdminLoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      // TODO: Replace with actual API call
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for demo purposes
      if (data.email === 'admin@verify.me' && data.password === 'admin123') {
        navigate('/admin/dashboard');
      } else {
        setLoginError('Access Denied');
      }
    } catch (error) {
      console.error('Admin Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-deep-blue text-4xl font-bold mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-8">Verify.me Control Panel</p>
        
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-gradient-to-r from-gradient-start to-gradient-end p-[1px] rounded-lg"
        >
          <div className="bg-white p-6 rounded-lg">
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-error-red/10 border border-error-red rounded-md"
              >
                <p className="text-error-red text-sm">{loginError}</p>
              </motion.div>
            )}
            
            <div className="mb-4">
              <label className="block text-deep-blue text-sm mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: true, 
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
                })}
                className={`w-full h-[40px] px-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-gradient-start transition-all duration-300 ${errors.email ? 'border-error-red' : 'border-gray-200'}`}
              />
              {errors.email?.type === 'required' && (
                <span className="text-error-red text-sm mt-1">Email is required</span>
              )}
              {errors.email?.type === 'pattern' && (
                <span className="text-error-red text-sm mt-1">Enter a valid email address</span>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-deep-blue text-sm mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { 
                  required: true 
                })}
                className={`w-full h-[40px] px-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-gradient-start transition-all duration-300 ${errors.password ? 'border-error-red' : 'border-gray-200'}`}
              />
              {errors.password?.type === 'required' && (
                <span className="text-error-red text-sm mt-1">Password is required</span>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-r from-gradient-start to-gradient-end text-white w-[150px] h-[40px] rounded-md mb-3 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block animate-spin">⟳</span>
                ) : 'Log In'}
              </motion.button>
              
              <p className="text-gray-600 text-sm text-center mt-4">
                For demo purposes, use:<br />
                Email: admin@verify.me<br />
                Password: admin123
              </p>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminLogin; 