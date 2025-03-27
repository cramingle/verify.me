import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChannelList from '../components/dashboard/ChannelList';
import CsvUploadModal from '../components/dashboard/CsvUploadModal';
import AddCompanyChannelModal from '../components/dashboard/AddCompanyChannelModal';
import AddEmployeeChannelModal from '../components/dashboard/AddEmployeeChannelModal';
import VerificationResults from '../components/dashboard/VerificationResults';
import TopNavigation from '../components/dashboard/TopNavigation';
import VerificationBadge from '../components/dashboard/VerificationBadge';

interface Channel {
  id: string;
  type: 'x' | 'telegram' | 'website' | 'email' | 'phone';
  value: string;
  verified: boolean;
  verifiedAt: string;
  isEmployeeChannel: boolean;
  employeeInfo?: {
    name: string;
    role: string;
    department?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
}

interface VerificationData {
  channel: string;
  type: string;
  description?: string;
  status: 'unverified' | 'verified' | 'failed';
}

const channelTypeLabels = {
  x: 'X (Twitter)',
  telegram: 'Telegram',
  website: 'Website',
  email: 'Email',
  phone: 'Phone',
};

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Channels: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Channels',
      path: '/channels',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      label: 'Payment',
      path: '/payment',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const [channels, setChannels] = useState<Channel[]>([
    // Company channels
    { id: '1', type: 'x', value: '@CompanyX', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    { id: '2', type: 'website', value: 'companyx.com', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    { id: '3', type: 'telegram', value: 't.me/CompanyX', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    { id: '4', type: 'email', value: 'support@companyx.com', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    
    // Employee channels
    { 
      id: '5', 
      type: 'telegram', 
      value: 't.me/JohnSupport', 
      verified: true, 
      verifiedAt: '2025-03-01', 
      isEmployeeChannel: true,
      employeeInfo: {
        name: 'John Doe',
        role: 'Customer Support',
        department: 'Support',
        verificationStatus: 'verified'
      }
    },
    { 
      id: '6', 
      type: 'x', 
      value: '@SarahMarketing', 
      verified: true, 
      verifiedAt: '2025-03-01', 
      isEmployeeChannel: true,
      employeeInfo: {
        name: 'Sarah Smith',
        role: 'Marketing Manager',
        department: 'Marketing',
        verificationStatus: 'verified'
      }
    },
    { 
      id: '7', 
      type: 'email', 
      value: 'michael.dev@companyx.com', 
      verified: false, 
      verifiedAt: '', 
      isEmployeeChannel: true,
      employeeInfo: {
        name: 'Michael Johnson',
        role: 'Lead Developer',
        department: 'Engineering',
        verificationStatus: 'pending'
      }
    },
  ]);
  
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [, setUploadSuccess] = useState(false);
  const [, setUploadError] = useState<string | null>(null);
  const [, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<VerificationData[]>([]);

  // Channel performance data for analytics
  const channelPerformance = [
    { id: '1', verifications: 120 },
    { id: '2', verifications: 85 },
    { id: '3', verifications: 40 },
    { id: '4', verifications: 25 },
    { id: '5', verifications: 65 },
  ];

  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  const handleAddChannel = (newChannel: Channel) => {
    setChannels([...channels, newChannel]);
  };

  const handleUpload = async (data: any[]) => {
    try {
      setUploadError(null);
      
      // Format data for backend
      const formattedData = data.map(item => ({
        channel: item.channel,
        type: item.type,
        description: item.description || '',
        is_employee_channel: item.is_employee_channel,
        employee_info: item.is_employee_channel ? {
          name: item.employee_name,
          role: item.employee_role,
          department: item.employee_department || undefined
        } : undefined
      }));
      
      const response = await axios.post('/api/csv/upload', { channels: formattedData });
      setUploadSuccess(true);
      setVerificationResults(response.data.verifications);
      setShowCsvModal(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload CSV data');
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setIsVerifying(true);
      setUploadError(null);
      const verificationIds = verificationResults.map((v: any) => v.id);
      const response = await axios.post('/api/csv/verify', { verificationIds });
      setVerificationResults(response.data.results);
      
      // Update the channel's verification status
      setChannels(channels.map(channel => 
        channel.id === id 
          ? { 
              ...channel, 
              verified: true, 
              verifiedAt: new Date().toISOString(),
              employeeInfo: channel.employeeInfo 
                ? { ...channel.employeeInfo, verificationStatus: 'verified' as const } 
                : undefined
            } 
          : channel
      ));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to verify data');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <TopNavigation username="John Smith" />
      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Channel Management</h1>

        {/* Company Channels Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Company Channels</h2>
            <button 
              onClick={() => setShowCompanyModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end hover:from-gradient-start-dark hover:to-gradient-end-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-start"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Channel
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {channels.filter(channel => !channel.isEmployeeChannel).map((channel) => (
                <li key={channel.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {channel.type === 'x' && (
                          <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.243 11.86L21.503 3h-1.912l-6.313 7.658L8.503 3H3.103l7.897 11.46L3.537 23h1.912l6.716-8.136L17.103 23h5.4l-8.26-11.14zm-1.306 1.589l-.78-1.116L5.753 4.569h2.697l5.1 7.287.78 1.116 6.603 9.459h-2.697l-5.299-7.982z" />
                          </svg>
                        )}
                        {channel.type === 'telegram' && (
                          <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.95 1.24-5.51 3.65-.52.36-1 .53-1.4.52-.46-.01-1.34-.26-2-.47-.8-.26-1.43-.4-1.38-.85.03-.22.35-.45.96-.68 3.78-1.65 6.3-2.74 7.58-3.28 3.61-1.53 4.36-1.8 4.85-1.81.11 0 .37.03.53.16.14.13.19.31.2.48 0 .14-.03.31-.05.45z" />
                          </svg>
                        )}
                        {channel.type === 'website' && (
                          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        )}
                        {channel.type === 'email' && (
                          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {channel.type === 'phone' && (
                          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{channelTypeLabels[channel.type]}</h3>
                        <p className="text-sm text-gray-700">{channel.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <VerificationBadge verified={channel.verified} />
                      <button
                        onClick={() => handleRemoveChannel(channel.id)}
                        className="ml-4 text-gray-500 hover:text-red-500"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Employee Channels Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Employee Channels</h2>
            <button 
              onClick={() => setShowEmployeeModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end hover:from-gradient-start-dark hover:to-gradient-end-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-start"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee Channel
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {channels.filter(channel => channel.isEmployeeChannel).map((channel) => (
                <li key={channel.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {channel.type === 'x' && (
                            <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.243 11.86L21.503 3h-1.912l-6.313 7.658L8.503 3H3.103l7.897 11.46L3.537 23h1.912l6.716-8.136L17.103 23h5.4l-8.26-11.14zm-1.306 1.589l-.78-1.116L5.753 4.569h2.697l5.1 7.287.78 1.116 6.603 9.459h-2.697l-5.299-7.982z" />
                            </svg>
                          )}
                          {channel.type === 'telegram' && (
                            <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.95 1.24-5.51 3.65-.52.36-1 .53-1.4.52-.46-.01-1.34-.26-2-.47-.8-.26-1.43-.4-1.38-.85.03-.22.35-.45.96-.68 3.78-1.65 6.3-2.74 7.58-3.28 3.61-1.53 4.36-1.8 4.85-1.81.11 0 .37.03.53.16.14.13.19.31.2.48 0 .14-.03.31-.05.45z" />
                            </svg>
                          )}
                          {channel.type === 'email' && (
                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{channel.employeeInfo?.name}</h3>
                            {channel.employeeInfo && (
                              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                channel.employeeInfo.verificationStatus === 'verified' 
                                  ? 'bg-green-100 text-green-800' 
                                  : channel.employeeInfo.verificationStatus === 'rejected' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {channel.employeeInfo.verificationStatus.charAt(0).toUpperCase() + channel.employeeInfo.verificationStatus.slice(1)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{channel.employeeInfo?.role}{channel.employeeInfo?.department ? `, ${channel.employeeInfo.department}` : ''}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {channelTypeLabels[channel.type]}: {channel.value}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {!channel.verified && (
                          <button
                            onClick={() => handleVerify(channel.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-gradient-start to-gradient-end hover:from-gradient-start-dark hover:to-gradient-end-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-start"
                          >
                            Verify
                          </button>
                        )}
                        {channel.verified && <VerificationBadge verified={channel.verified} />}
                        <button
                          onClick={() => handleRemoveChannel(channel.id)}
                          className="ml-4 text-gray-500 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCompanyChannelModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onAddChannel={handleAddChannel}
      />

      <AddEmployeeChannelModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onAddChannel={handleAddChannel}
      />

      <CsvUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onUpload={handleUpload}
      />
    </motion.div>
  );
};

export default Channels; 