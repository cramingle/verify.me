import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, username }) => {
  const [profile, setProfile] = useState({
    name: username || 'John Smith',
    email: 'john.smith@example.com',
    company: 'Acme Inc.',
    role: 'Administrator'
  });
  
  // Add payment details
  const cardDetails = {
    name: username || 'John Smith',
    number: '**** **** **** 4242',
    expiry: '12/24'
  };
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payment'>('profile');
  
  if (!isOpen) return null;
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the updated profile to the server
    alert('Profile updated successfully!');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 overflow-auto flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-deep-blue">Settings</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-deep-blue p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex">
              {/* Sidebar Tabs */}
              <div className="w-40 p-2 bg-gray-50 rounded-lg mr-4">
                {(['profile', 'payment', 'security'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-3 py-2 rounded-md mb-1 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-gradient-start to-gradient-end text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Tab content */}
              <div className="flex-1 overflow-y-auto pr-2 max-h-[60vh]">
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-gradient-start to-gradient-end flex items-center justify-center text-white text-lg font-semibold">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{profile.name}</h3>
                          <p className="text-xs text-gray-500">{profile.company} • {profile.role}</p>
                          <button
                            type="button"
                            className="mt-1 text-xs text-gradient-end font-medium hover:text-gradient-start"
                          >
                            Change avatar
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            value={profile.company}
                            onChange={(e) => setProfile({...profile, company: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            id="role"
                            value={profile.role}
                            onChange={(e) => setProfile({...profile, role: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          >
                            <option>Administrator</option>
                            <option>Manager</option>
                            <option>Member</option>
                            <option>Viewer</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                
                {activeTab === 'payment' && (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-medium">Current Subscription</h2>
                          <p className="text-gray-600 text-xs mt-1">Professional Plan - $29.99/month</p>
                          <p className="text-xs text-gray-500">Next payment: June 15, 2023</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <h2 className="text-sm font-medium mb-2">Payment Method</h2>
                      
                      <div className="flex items-center justify-between border rounded-md p-2 border-gray-200">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 rounded-md p-1.5 mr-2">
                            <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-xs">Visa ending in 4242</p>
                            <p className="text-xs text-gray-600">Expires {cardDetails.expiry}</p>
                          </div>
                        </div>
                        <button className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition-colors duration-200">
                          Update
                        </button>
                      </div>
                      
                      <div className="mt-2 flex">
                        <button className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded mr-2 transition-colors duration-200">
                          Cancel Subscription
                        </button>
                        <button className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded transition-colors duration-200">
                          View Invoices
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                      
                      <div className="space-y-2">
                        <div>
                          <label htmlFor="current-password" className="block text-xs font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="new-password" className="block text-xs font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gradient-end focus:border-gradient-end text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-md text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="toggle-2fa"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="toggle-2fa"
                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                          ></label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                          <p className="text-xs text-gray-500">Manage devices where you're currently logged in</p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-xs font-medium hover:bg-red-50 transition-colors duration-200"
                        >
                          Sign out all
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <style>
        {`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #fff;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #4F46E5;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: background-color 0.3s;
        }
        `}
      </style>
    </>
  );
};

export default SettingsModal; 